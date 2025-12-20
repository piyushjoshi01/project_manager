package com.work.ProjectManager.llm.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "issue_analysis")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class IssueAnalysis {
    @Id
    @Column(name = "issue_key", nullable = false, unique = true)
    private String issueKey;

    @Column(name = "project_key", nullable = false)
    private String projectKey;

    @Column(name = "summary", length = 1000)
    private String summary;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "assignee_account_id")
    private String assigneeAccountId;

    @Column(name = "assignee_name")
    private String assigneeName;

    @Column(name = "assignee_email")
    private String assigneeEmail;

    @Column(name = "status")
    private String status;

    @Column(name = "created_date")
    private LocalDateTime createdDate;

    @Column(name = "resolved_date")
    private LocalDateTime resolvedDate;

    @Column(name = "time_taken_hours")
    private Double timeTakenHours;

    @Column(name = "assignee_hourly_cost")
    private Double assigneeHourlyCost;

    @Column(name = "total_cost")
    private Double totalCost;

    @Column(name = "efficiency_score")
    private Double efficiencyScore;

    @Column(name = "last_synced")
    private LocalDateTime lastSynced;
}

