package com.work.ProjectManager.jira.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

@Data
public class JiraIssueDTO {
    private String id;
    private String key;
    private Fields fields;

    @Data
    public static class Fields {
        private JiraUserDTO assignee;
        private String summary;
        private String description;
        private Status status;
        
        @JsonProperty("created")
        private String created;
        
        @JsonProperty("resolutiondate")
        private String resolutiondate;
        
        @JsonProperty("project")
        private Project project;
    }

    @Data
    public static class Status {
        private String name;
    }
    
    @Data
    public static class Project {
        private String key;
    }
    
    // Helper method to parse Jira date string to LocalDateTime
    public LocalDateTime parseJiraDate(String jiraDateString) {
        if (jiraDateString == null || jiraDateString.isEmpty()) {
            return null;
        }
        try {
            // Jira dates are in ISO-8601 format: "2024-01-15T10:30:00.000+0000" or "2024-01-15T10:30:00.000Z"
            // Try parsing with ZonedDateTime first (handles timezone)
            if (jiraDateString.endsWith("Z")) {
                ZonedDateTime zonedDateTime = ZonedDateTime.parse(jiraDateString, DateTimeFormatter.ISO_ZONED_DATE_TIME);
                return zonedDateTime.toLocalDateTime();
            } else {
                // Handle format like "2024-01-15T10:30:00.000+0000"
                String normalized = jiraDateString;
                if (normalized.length() > 19 && normalized.charAt(19) == '.') {
                    // Has milliseconds
                    int plusIndex = normalized.indexOf('+');
                    int minusIndex = normalized.indexOf('-', 10); // Skip date part
                    if (plusIndex > 0) {
                        String datePart = normalized.substring(0, plusIndex);
                        String timezonePart = normalized.substring(plusIndex);
                        if (timezonePart.length() == 5) {
                            // Format: +0000
                            normalized = datePart + timezonePart.substring(0, 3) + ":" + timezonePart.substring(3);
                        }
                    } else if (minusIndex > 19) {
                        // Negative timezone
                        String datePart = normalized.substring(0, minusIndex);
                        String timezonePart = normalized.substring(minusIndex);
                        if (timezonePart.length() == 5) {
                            normalized = datePart + timezonePart.substring(0, 3) + ":" + timezonePart.substring(3);
                        }
                    }
                }
                ZonedDateTime zonedDateTime = ZonedDateTime.parse(normalized);
                return zonedDateTime.toLocalDateTime();
            }
        } catch (Exception e) {
            // Fallback: try ISO_LOCAL_DATE_TIME if no timezone
            try {
                return LocalDateTime.parse(jiraDateString.substring(0, 19), DateTimeFormatter.ISO_LOCAL_DATE_TIME);
            } catch (Exception ex) {
                return null;
            }
        }
    }
}
