package com.work.ProjectManager.jira.service;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.work.ProjectManager.config.JiraRestClient;
import com.work.ProjectManager.jira.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;


@Service
@RequiredArgsConstructor
public class JiraService {

    private final JiraRestClient jiraRestClient;

    /** Get all projects (basic info only) */
    public Mono<JiraProjectDTO[]> getAllProjects() {
        // /project returns array of all projects in Jira Cloud
        return jiraRestClient.get("/rest/api/3/project", JiraProjectDTO[].class);
    }

    /** Get single project details by key or id */
    public Mono<JiraProjectDetailsDTO> getProjectDetails(String projectKey) {
        String endpoint = "/rest/api/3/project/" + encodePath(projectKey);
        return jiraRestClient.get(endpoint, JiraProjectDetailsDTO.class);
    }

    /** Get all issues for a project using JQL */
    public Mono<JiraIssueDTO[]> getIssuesByProject(String projectKey) {
        String jql = "project=\"" + projectKey + "\" ORDER BY created DESC";
        return searchIssuesAndExtractIssues(jql);
    }

    /** Get all issues assigned to a user (accountId required) */
    public Mono<JiraIssueDTO[]> getIssuesAssignedToUser(String accountId) {
        String jql = "assignee=\"" + accountId + "\" AND resolution=Unresolved ORDER BY created DESC";
        return searchIssuesAndExtractIssues(jql);
    }

    /** Search issues using arbitrary JQL */
    public Mono<JiraSearchResponse> searchIssues(String jql) {
        // Use new /rest/api/3/search/jql endpoint with GET and JQL as query parameter
        String endpoint = "/rest/api/3/search/jql";
        java.util.Map<String, String> queryParams = new java.util.HashMap<>();
        queryParams.put("jql", jql);
        queryParams.put("maxResults", "100");
        queryParams.put("startAt", "0");
        queryParams.put("fields", "summary,description,status,assignee,id,key,created,resolutiondate,project");
        return jiraRestClient.getWithQueryParams(endpoint, queryParams, JiraSearchResponse.class);
    }

    /** Get issue details by issue key */
    public Mono<JiraIssueDTO> getIssueDetails(String issueKey) {
        String endpoint = "/rest/api/3/issue/" + encodePath(issueKey);
        return jiraRestClient.get(endpoint, JiraIssueDTO.class);
    }

    /* ---------------- Helper methods ---------------- */

    private Mono<JiraIssueDTO[]> searchIssuesAndExtractIssues(String jql) {
        // Use new /rest/api/3/search/jql endpoint with GET and JQL as query parameter
        String endpoint = "/rest/api/3/search/jql";
        java.util.Map<String, String> queryParams = new java.util.HashMap<>();
        queryParams.put("jql", jql);
        queryParams.put("maxResults", "100");
        queryParams.put("startAt", "0");
        queryParams.put("fields", "summary,description,status,assignee,id,key,created,resolutiondate,project");
        return jiraRestClient.getWithQueryParams(endpoint, queryParams, JiraSearchResponse.class)
                .map(resp -> resp.getIssues() != null ? resp.getIssues() : new JiraIssueDTO[0]);
    }

    private String encodePath(String pathSegment) {
        return java.net.URLEncoder.encode(pathSegment, java.nio.charset.StandardCharsets.UTF_8).replace("+", "%20");
    }

    /* ---------------- Request/Response wrappers ---------------- */

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class JiraSearchRequest {
        private String jql;
        private Integer maxResults;
        private Integer startAt;
        private String[] fields;

        public JiraSearchRequest() {}

        public JiraSearchRequest(String jql, int maxResults, int startAt) {
            this.jql = jql;
            this.maxResults = maxResults;
            this.startAt = startAt;
            // Include fields that we need - this is required for proper response mapping
            this.fields = new String[]{"summary", "status", "assignee", "id", "key"};
        }

        // Constructor for minimal request (just JQL) - used for /rest/api/3/search/jql
        public JiraSearchRequest(String jql) {
            this.jql = jql;
        }

        public String getJql() { return jql; }
        public void setJql(String jql) { this.jql = jql; }
        public Integer getMaxResults() { return maxResults; }
        public void setMaxResults(Integer maxResults) { this.maxResults = maxResults; }
        public Integer getStartAt() { return startAt; }
        public void setStartAt(Integer startAt) { this.startAt = startAt; }
        public String[] getFields() { return fields; }
        public void setFields(String[] fields) { this.fields = fields; }
    }

    public static class JiraSearchResponse {
        private JiraIssueDTO[] issues;

        public JiraIssueDTO[] getIssues() { return issues; }
        public void setIssues(JiraIssueDTO[] issues) { this.issues = issues; }
    }
}
