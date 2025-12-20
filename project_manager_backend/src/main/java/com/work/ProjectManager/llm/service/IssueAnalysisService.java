package com.work.ProjectManager.llm.service;

import com.work.ProjectManager.jira.dto.JiraIssueDTO;
import com.work.ProjectManager.jira.service.JiraService;
import com.work.ProjectManager.llm.entity.AssigneePerformance;
import com.work.ProjectManager.llm.entity.IssueAnalysis;
import com.work.ProjectManager.llm.repository.AssigneePerformanceRepository;
import com.work.ProjectManager.llm.repository.IssueAnalysisRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class IssueAnalysisService {

    private final JiraService jiraService;
    private final IssueAnalysisRepository issueAnalysisRepository;
    private final AssigneePerformanceRepository assigneePerformanceRepository;

    /**
     * Sync issues from Jira for a project and store analysis data
     */
    @Transactional
    public Mono<Void> syncIssuesForProject(String projectKey) {
        return jiraService.getIssuesByProject(projectKey)
                .doOnNext(issues -> {
                    for (JiraIssueDTO issue : issues) {
                        saveOrUpdateIssueAnalysis(issue);
                    }
                })
                .then(Mono.fromRunnable(() -> {
                    // Recalculate assignee performance after syncing
                    recalculateAssigneePerformance();
                }));
    }

    /**
     * Save or update issue analysis from Jira issue data
     */
    private void saveOrUpdateIssueAnalysis(JiraIssueDTO jiraIssue) {
        if (jiraIssue.getKey() == null || jiraIssue.getFields() == null) {
            return;
        }

        IssueAnalysis analysis = issueAnalysisRepository.findById(jiraIssue.getKey())
                .orElse(new IssueAnalysis());
        
        analysis.setIssueKey(jiraIssue.getKey());
        analysis.setProjectKey(jiraIssue.getFields().getProject() != null 
                ? jiraIssue.getFields().getProject().getKey() 
                : null);
        analysis.setSummary(jiraIssue.getFields().getSummary());
        analysis.setDescription(jiraIssue.getFields().getDescription());
        analysis.setStatus(jiraIssue.getFields().getStatus() != null 
                ? jiraIssue.getFields().getStatus().getName() 
                : null);
        
        // Parse dates
        analysis.setCreatedDate(jiraIssue.parseJiraDate(jiraIssue.getFields().getCreated()));
        analysis.setResolvedDate(jiraIssue.parseJiraDate(jiraIssue.getFields().getResolutiondate()));
        
        // Set assignee information
        if (jiraIssue.getFields().getAssignee() != null) {
            analysis.setAssigneeAccountId(jiraIssue.getFields().getAssignee().getAccountId());
            analysis.setAssigneeName(jiraIssue.getFields().getAssignee().getDisplayName());
            analysis.setAssigneeEmail(jiraIssue.getFields().getAssignee().getEmailAddress());
        }
        
        // Calculate time taken if resolved
        if (analysis.getCreatedDate() != null && analysis.getResolvedDate() != null) {
            Duration duration = Duration.between(analysis.getCreatedDate(), analysis.getResolvedDate());
            analysis.setTimeTakenHours(duration.toHours() + (duration.toMinutes() % 60) / 60.0);
        }
        
        // Get assignee hourly cost from performance table
        if (analysis.getAssigneeAccountId() != null) {
            Optional<AssigneePerformance> assigneePerf = assigneePerformanceRepository
                    .findById(analysis.getAssigneeAccountId());
            if (assigneePerf.isPresent() && assigneePerf.get().getHourlyCost() != null) {
                analysis.setAssigneeHourlyCost(assigneePerf.get().getHourlyCost());
                if (analysis.getTimeTakenHours() != null) {
                    analysis.setTotalCost(analysis.getAssigneeHourlyCost() * analysis.getTimeTakenHours());
                }
            }
        }
        
        // Calculate efficiency score
        analysis.setEfficiencyScore(calculateEfficiencyScore(analysis));
        
        analysis.setLastSynced(LocalDateTime.now());
        issueAnalysisRepository.save(analysis);
    }

    /**
     * Calculate efficiency score based on time taken and assignee performance
     * Lower time with good quality = higher efficiency
     */
    private Double calculateEfficiencyScore(IssueAnalysis analysis) {
        if (analysis.getTimeTakenHours() == null || analysis.getAssigneeAccountId() == null) {
            return null;
        }
        
        // Get average time for this assignee
        List<IssueAnalysis> completedIssues = issueAnalysisRepository
                .findCompletedIssuesByAssignee(analysis.getAssigneeAccountId());
        
        if (completedIssues.isEmpty()) {
            // First issue, default efficiency
            return 0.5;
        }
        
        double avgTime = completedIssues.stream()
                .filter(ia -> ia.getTimeTakenHours() != null)
                .mapToDouble(IssueAnalysis::getTimeTakenHours)
                .average()
                .orElse(analysis.getTimeTakenHours());
        
        // Efficiency = how much faster/slower than average
        // If completed faster than average, efficiency > 1.0
        // If completed slower than average, efficiency < 1.0
        if (avgTime > 0) {
            double efficiency = avgTime / analysis.getTimeTakenHours();
            // Normalize to 0-1 scale
            return Math.min(1.0, Math.max(0.0, efficiency));
        }
        
        return 0.5;
    }

    /**
     * Recalculate performance metrics for all assignees
     */
    @Transactional
    public void recalculateAssigneePerformance() {
        List<IssueAnalysis> allIssues = issueAnalysisRepository.findAll();
        
        // Get distinct assignee account IDs
        allIssues.stream()
                .filter(ia -> ia.getAssigneeAccountId() != null)
                .map(IssueAnalysis::getAssigneeAccountId)
                .distinct()
                .forEach(accountId -> {
                    List<IssueAnalysis> assigneeIssues = issueAnalysisRepository
                            .findCompletedIssuesByAssignee(accountId);
                    
                    if (!assigneeIssues.isEmpty()) {
                        // Get first issue to get assignee name/email
                        IssueAnalysis firstIssue = assigneeIssues.get(0);
                        
                        AssigneePerformance perf = assigneePerformanceRepository
                                .findById(accountId)
                                .orElse(new AssigneePerformance());
                        
                        perf.setAccountId(accountId);
                        perf.setName(firstIssue.getAssigneeName());
                        perf.setEmail(firstIssue.getAssigneeEmail());
                        
                        // Calculate averages
                        double avgTime = assigneeIssues.stream()
                                .filter(ia -> ia.getTimeTakenHours() != null)
                                .mapToDouble(IssueAnalysis::getTimeTakenHours)
                                .average()
                                .orElse(0.0);
                        perf.setAverageTimeHours(avgTime);
                        
                        double avgEfficiency = assigneeIssues.stream()
                                .filter(ia -> ia.getEfficiencyScore() != null)
                                .mapToDouble(IssueAnalysis::getEfficiencyScore)
                                .average()
                                .orElse(0.0);
                        perf.setAverageEfficiencyScore(avgEfficiency);
                        
                        perf.setTotalIssuesCompleted(assigneeIssues.size());
                        
                        // Calculate total cost
                        double totalCost = assigneeIssues.stream()
                                .filter(ia -> ia.getTotalCost() != null)
                                .mapToDouble(IssueAnalysis::getTotalCost)
                                .sum();
                        perf.setTotalCostIncurred(totalCost);
                        
                        // Set hourly cost if not already set (default to 50 if not configured)
                        if (perf.getHourlyCost() == null) {
                            perf.setHourlyCost(50.0); // Default hourly rate
                        }
                        
                        perf.setLastUpdated(LocalDateTime.now());
                        assigneePerformanceRepository.save(perf);
                    }
                });
    }

    /**
     * Get all issue analysis data for LLM
     */
    public List<IssueAnalysis> getAllIssueAnalysis() {
        return issueAnalysisRepository.findAll();
    }

    /**
     * Get issue analysis by project key
     */
    public List<IssueAnalysis> getIssueAnalysisByProject(String projectKey) {
        return issueAnalysisRepository.findByProjectKey(projectKey);
    }

    /**
     * Get all assignee performance data for LLM
     */
    public List<AssigneePerformance> getAllAssigneePerformance() {
        return assigneePerformanceRepository.findAll();
    }

    /**
     * Update assignee hourly cost
     */
    @Transactional
    public void updateAssigneeHourlyCost(String accountId, Double hourlyCost) {
        Optional<AssigneePerformance> perf = assigneePerformanceRepository.findById(accountId);
        if (perf.isPresent()) {
            perf.get().setHourlyCost(hourlyCost);
            assigneePerformanceRepository.save(perf.get());
            
            // Recalculate costs for all issues assigned to this person
            List<IssueAnalysis> issues = issueAnalysisRepository.findByAssigneeAccountId(accountId);
            issues.forEach(issue -> {
                if (issue.getTimeTakenHours() != null) {
                    issue.setAssigneeHourlyCost(hourlyCost);
                    issue.setTotalCost(hourlyCost * issue.getTimeTakenHours());
                    issueAnalysisRepository.save(issue);
                }
            });
        }
    }
}

