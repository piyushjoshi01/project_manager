package com.work.ProjectManager.llm.repository;

import com.work.ProjectManager.llm.entity.IssueAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IssueAnalysisRepository extends JpaRepository<IssueAnalysis, String> {
    List<IssueAnalysis> findByProjectKey(String projectKey);
    
    List<IssueAnalysis> findByAssigneeAccountId(String accountId);
    
    List<IssueAnalysis> findByStatus(String status);
    
    @Query("SELECT ia FROM IssueAnalysis ia WHERE ia.resolvedDate IS NOT NULL")
    List<IssueAnalysis> findCompletedIssues();
    
    @Query("SELECT ia FROM IssueAnalysis ia WHERE ia.assigneeAccountId = :accountId AND ia.resolvedDate IS NOT NULL")
    List<IssueAnalysis> findCompletedIssuesByAssignee(String accountId);
}

