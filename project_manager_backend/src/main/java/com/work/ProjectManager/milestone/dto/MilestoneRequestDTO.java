package com.work.ProjectManager.milestone.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MilestoneRequestDTO {
    private String name;
    private LocalDate startDate;
    private LocalDate endDate;
    private String description;
    private String projectKey;
}

