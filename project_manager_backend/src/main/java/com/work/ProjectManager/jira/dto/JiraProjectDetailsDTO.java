package com.work.ProjectManager.jira.dto;

import lombok.Data;
import java.util.List;

@Data
public class JiraProjectDetailsDTO {
    private String id;
    private String key;
    private String name;
    private String description;
    private List<String> components;
}
