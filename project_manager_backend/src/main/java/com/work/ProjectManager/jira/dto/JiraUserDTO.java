package com.work.ProjectManager.jira.dto;

import lombok.Data;

@Data
public class JiraUserDTO {
    private String accountId;
    private String displayName;
    private String emailAddress;
}
