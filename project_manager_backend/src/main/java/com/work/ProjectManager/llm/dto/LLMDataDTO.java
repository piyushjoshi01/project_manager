package com.work.ProjectManager.llm.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LLMDataDTO {
    private List<IssueAnalysisDTO> issues;
    private List<AssigneePerformanceDTO> assignees;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class IssueAnalysisDTO {
        private String issueKey;
        private String projectKey;
        private String summary;
        private String description;
        private String assigneeName;
        private String assigneeEmail;
        private String status;
        private Double timeTakenHours;
        private Double totalCost;
        private Double efficiencyScore;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AssigneePerformanceDTO {
        private String accountId;
        private String name;
        private String email;
        private Double hourlyCost;
        private Integer totalIssuesCompleted;
        private Double averageTimeHours;
        private Double averageEfficiencyScore;
        private Double totalCostIncurred;
    }
}

