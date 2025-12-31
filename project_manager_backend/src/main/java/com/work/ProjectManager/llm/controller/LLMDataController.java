package com.work.ProjectManager.llm.controller;

import com.work.ProjectManager.llm.dto.LLMDataDTO;
import com.work.ProjectManager.llm.dto.LLMQueryRequest;
import com.work.ProjectManager.llm.entity.AssigneePerformance;
import com.work.ProjectManager.llm.entity.IssueAnalysis;
import com.work.ProjectManager.llm.service.IssueAnalysisService;
import com.work.ProjectManager.llm.service.LLMService;
import com.work.ProjectManager.utils.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/llm")
@RequiredArgsConstructor
@Tag(name = "LLM & Analytics", description = "APIs for issue analysis, performance metrics, and LLM-powered insights")
public class LLMDataController {

    private final IssueAnalysisService issueAnalysisService;
    private final LLMService llmService;

    @Operation(
            summary = "Sync Jira issues",
            description = "Syncs all issues from a Jira project and analyzes them for performance metrics"
    )
    @PostMapping("/sync/project/{projectKey}")
    public Mono<ResponseEntity<ApiResponse>> syncProject(
            @Parameter(description = "Project key", example = "MW")
            @PathVariable String projectKey) {
        return issueAnalysisService.syncIssuesForProject(projectKey)
                .then(Mono.just(ResponseEntity.ok(new ApiResponse(true, "Issues synced successfully", null))))
                .onErrorResume(e -> Mono.just(ResponseEntity.badRequest()
                        .body(new ApiResponse(false, null, e.getMessage()))));
    }

    @Operation(
            summary = "Get all LLM data",
            description = "Retrieves all issue analysis and assignee performance data"
    )
    @GetMapping("/data")
    public ResponseEntity<ApiResponse> getAllLLMData() {
        List<IssueAnalysis> issues = issueAnalysisService.getAllIssueAnalysis();
        List<AssigneePerformance> assignees = issueAnalysisService.getAllAssigneePerformance();

        LLMDataDTO dto = new LLMDataDTO(
                issues.stream().map(this::mapToIssueDTO).collect(Collectors.toList()),
                assignees.stream().map(this::mapToAssigneeDTO).collect(Collectors.toList())
        );

        return ResponseEntity.ok(new ApiResponse(true, dto, null));
    }

    @Operation(
            summary = "Get project LLM data",
            description = "Retrieves issue analysis and performance data for a specific project"
    )
    @GetMapping("/data/project/{projectKey}")
    public ResponseEntity<ApiResponse> getProjectLLMData(
            @Parameter(description = "Project key", example = "MW")
            @PathVariable String projectKey) {
        List<IssueAnalysis> issues = issueAnalysisService.getIssueAnalysisByProject(projectKey);
        List<AssigneePerformance> assignees = issueAnalysisService.getAllAssigneePerformance();

        LLMDataDTO dto = new LLMDataDTO(
                issues.stream().map(this::mapToIssueDTO).collect(Collectors.toList()),
                assignees.stream().map(this::mapToAssigneeDTO).collect(Collectors.toList())
        );

        return ResponseEntity.ok(new ApiResponse(true, dto, null));
    }

    @Operation(
            summary = "Update assignee hourly cost",
            description = "Updates the hourly cost for an assignee and recalculates all related costs"
    )
    @PutMapping("/assignee/{accountId}/cost")
    public ResponseEntity<ApiResponse> updateAssigneeCost(
            @Parameter(description = "Jira account ID")
            @PathVariable String accountId,
            @Parameter(description = "Hourly cost in dollars", example = "75.50")
            @RequestParam Double hourlyCost) {
        try {
            issueAnalysisService.updateAssigneeHourlyCost(accountId, hourlyCost);
            return ResponseEntity.ok(new ApiResponse(true, "Assignee cost updated successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, null, e.getMessage()));
        }
    }

    @Operation(
            summary = "Recalculate performance metrics",
            description = "Recalculates all assignee performance metrics based on current data"
    )
    @PostMapping("/recalculate")
    public ResponseEntity<ApiResponse> recalculatePerformance() {
        try {
            issueAnalysisService.recalculateAssigneePerformance();
            return ResponseEntity.ok(new ApiResponse(true, "Performance metrics recalculated", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, null, e.getMessage()));
        }
    }

    @Operation(
            summary = "Ask LLM a question",
            description = "Ask natural language questions about project data and get AI-powered insights"
    )
    @PostMapping("/ask")
    public Mono<ResponseEntity<ApiResponse>> askLLM(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Question and optional project key for context"
            )
            @RequestBody LLMQueryRequest request) {
        // Get relevant data based on projectKey
        LLMDataDTO data;
        if (request.getProjectKey() != null && !request.getProjectKey().isEmpty()) {
            List<IssueAnalysis> issues = issueAnalysisService.getIssueAnalysisByProject(request.getProjectKey());
            List<AssigneePerformance> assignees = issueAnalysisService.getAllAssigneePerformance();
            data = new LLMDataDTO(
                    issues.stream().map(this::mapToIssueDTO).collect(Collectors.toList()),
                    assignees.stream().map(this::mapToAssigneeDTO).collect(Collectors.toList())
            );
        } else {
            List<IssueAnalysis> issues = issueAnalysisService.getAllIssueAnalysis();
            List<AssigneePerformance> assignees = issueAnalysisService.getAllAssigneePerformance();
            data = new LLMDataDTO(
                    issues.stream().map(this::mapToIssueDTO).collect(Collectors.toList()),
                    assignees.stream().map(this::mapToAssigneeDTO).collect(Collectors.toList())
            );
        }

        // Call external LLM service
        return llmService.askLLM(request.getPrompt(), data)
                .map(response -> ResponseEntity.ok(new ApiResponse(true, response, null)))
                .onErrorResume(error -> Mono.just(ResponseEntity.badRequest()
                        .body(new ApiResponse(false, null, error.getMessage()))));
    }

    private LLMDataDTO.IssueAnalysisDTO mapToIssueDTO(IssueAnalysis issue) {
        return new LLMDataDTO.IssueAnalysisDTO(
                issue.getIssueKey(),
                issue.getProjectKey(),
                issue.getSummary(),
                issue.getDescription(),
                issue.getAssigneeName(),
                issue.getAssigneeEmail(),
                issue.getStatus(),
                issue.getTimeTakenHours(),
                issue.getTotalCost(),
                issue.getEfficiencyScore()
        );
    }

    private LLMDataDTO.AssigneePerformanceDTO mapToAssigneeDTO(AssigneePerformance assignee) {
        return new LLMDataDTO.AssigneePerformanceDTO(
                assignee.getAccountId(),
                assignee.getName(),
                assignee.getEmail(),
                assignee.getHourlyCost(),
                assignee.getTotalIssuesCompleted(),
                assignee.getAverageTimeHours(),
                assignee.getAverageEfficiencyScore(),
                assignee.getTotalCostIncurred()
        );
    }
}
