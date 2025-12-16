package com.work.ProjectManager.jira.controllers;

import com.work.ProjectManager.jira.dto.JiraProjectDTO;
import com.work.ProjectManager.jira.service.JiraService;
import com.work.ProjectManager.utils.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/jira/projects")
@RequiredArgsConstructor
public class JiraProjectController {

    private final JiraService jiraService;


    @GetMapping
    public Mono<ResponseEntity<ApiResponse>> getAllProjects() {
        return jiraService.getAllProjects()
                .map(projects ->
                        ResponseEntity.ok(new ApiResponse(true, projects, null)))
                .onErrorResume(e ->
                        Mono.just(ResponseEntity.badRequest()
                                .body(new ApiResponse(false, null, e.getMessage()))));
    }


    @GetMapping("/{projectIdOrKey}")
    public Mono<ResponseEntity<ApiResponse>> getProjectDetails(@PathVariable String projectIdOrKey) {
        return jiraService.getProjectDetails(projectIdOrKey)
                .map(project -> ResponseEntity.ok(new ApiResponse(true, project, null)))
                .onErrorResume(e ->
                        Mono.just(ResponseEntity.badRequest()
                                .body(new ApiResponse(false, null, e.getMessage()))));
    }
}
