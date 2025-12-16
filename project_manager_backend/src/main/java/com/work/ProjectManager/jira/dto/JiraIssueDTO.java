package com.work.ProjectManager.jira.dto;

import lombok.Data;

@Data
public class JiraIssueDTO {
    private String id;
    private String key;
    private Fields fields;

    @Data
    public static class Fields {
        private JiraUserDTO assignee;
        private String summary;
        private Status status;
    }

    @Data
    public static class Status {
        private String name;
    }
}
