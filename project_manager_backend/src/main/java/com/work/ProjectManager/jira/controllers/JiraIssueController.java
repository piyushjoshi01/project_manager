package com.work.ProjectManager.jira.controllers;

import com.work.ProjectManager.jira.service.JiraService;
import com.work.ProjectManager.utils.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/jira/issues")
public class JiraIssueController {

    private JiraService jiraService;

    public JiraIssueController(JiraService jiraService) {
        this.jiraService = jiraService;
    }

    @GetMapping("/project/{projectKey}")
    public Mono<ResponseEntity<ApiResponse>> getIssuesByProject(@PathVariable String projectKey) {
        return jiraService.getIssuesByProject(projectKey)
                .map(issues -> ResponseEntity.ok(new ApiResponse(true, issues, null)))
                .onErrorResume(e ->
                        Mono.just(ResponseEntity.badRequest()
                                .body(new ApiResponse(false, null, e.getMessage()))));
    }

    @GetMapping("/assigned/{accountId}")
    public Mono<ResponseEntity<ApiResponse>> getIssuesAssignedToUser(@PathVariable String accountId) {
        return jiraService.getIssuesAssignedToUser(accountId)
                .map(issues -> ResponseEntity.ok(new ApiResponse(true, issues, null)))
                .onErrorResume(e ->
                        Mono.just(ResponseEntity.badRequest()
                                .body(new ApiResponse(false, null, e.getMessage()))));
    }
}

