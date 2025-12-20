package com.work.ProjectManager.llm.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "assignee_performance")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssigneePerformance {
    @Id
    @Column(name = "account_id", nullable = false, unique = true)
    private String accountId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "email")
    private String email;

    @Column(name = "hourly_cost")
    private Double hourlyCost;

    @Column(name = "total_issues_completed")
    private Integer totalIssuesCompleted;

    @Column(name = "average_time_hours")
    private Double averageTimeHours;

    @Column(name = "average_efficiency_score")
    private Double averageEfficiencyScore;

    @Column(name = "total_cost_incurred")
    private Double totalCostIncurred;

    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;
}

