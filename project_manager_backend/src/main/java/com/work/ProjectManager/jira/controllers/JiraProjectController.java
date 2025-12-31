package com.work.ProjectManager.jira.controllers;

import com.work.ProjectManager.jira.dto.JiraProjectDTO;
import com.work.ProjectManager.jira.service.JiraService;
import com.work.ProjectManager.utils.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/jira/projects")
@RequiredArgsConstructor
@Tag(name = "Jira Projects", description = "APIs for managing and retrieving Jira projects")
public class JiraProjectController {

    private final JiraService jiraService;

    @Operation(
            summary = "Get all Jira projects",
            description = "Retrieves all projects from your Jira instance. Requires Jira credentials to be configured."
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Successfully retrieved projects",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400",
                    description = "Failed to retrieve projects - check Jira credentials"
            )
    })
    @GetMapping
    public Mono<ResponseEntity<ApiResponse>> getAllProjects() {
        return jiraService.getAllProjects()
                .map(projects ->
                        ResponseEntity.ok(new ApiResponse(true, projects, null)))
                .onErrorResume(e ->
                        Mono.just(ResponseEntity.badRequest()
                                .body(new ApiResponse(false, null, e.getMessage()))));
    }

    @Operation(
            summary = "Get project details",
            description = "Retrieves detailed information about a specific Jira project by its key or ID"
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Successfully retrieved project details"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400",
                    description = "Project not found or invalid credentials"
            )
    })
    @GetMapping("/{projectIdOrKey}")
    public Mono<ResponseEntity<ApiResponse>> getProjectDetails(
            @Parameter(description = "Project key (e.g., 'PROJ') or ID", example = "MW")
            @PathVariable String projectIdOrKey) {
        return jiraService.getProjectDetails(projectIdOrKey)
                .map(project -> ResponseEntity.ok(new ApiResponse(true, project, null)))
                .onErrorResume(e ->
                        Mono.just(ResponseEntity.badRequest()
                                .body(new ApiResponse(false, null, e.getMessage()))));
    }
}
