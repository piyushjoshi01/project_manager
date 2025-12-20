package com.work.ProjectManager.milestone.controller;

import com.work.ProjectManager.milestone.dto.MilestoneDTO;
import com.work.ProjectManager.milestone.dto.MilestoneRequestDTO;
import com.work.ProjectManager.milestone.service.MilestoneService;
import com.work.ProjectManager.utils.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/milestones")
@RequiredArgsConstructor
public class MilestoneController {

    private final MilestoneService milestoneService;

    @PostMapping
    public ResponseEntity<ApiResponse> createMilestone(@RequestBody MilestoneRequestDTO requestDTO) {
        try {
            MilestoneDTO created = milestoneService.createMilestone(requestDTO);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(true, created, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, null, e.getMessage()));
        }
    }

    @PostMapping("/bulk")
    public ResponseEntity<ApiResponse> createMilestones(@RequestBody List<MilestoneRequestDTO> requestDTOs) {
        try {
            List<MilestoneDTO> created = milestoneService.createMilestones(requestDTOs);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(true, created, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, null, e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse> getAllMilestones(
            @RequestParam(required = false) String projectKey) {
        try {
            List<MilestoneDTO> milestones;
            if (projectKey != null && !projectKey.trim().isEmpty()) {
                milestones = milestoneService.getMilestonesByProject(projectKey);
            } else {
                milestones = milestoneService.getAllMilestones();
            }
            return ResponseEntity.ok(new ApiResponse(true, milestones, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, null, e.getMessage()));
        }
    }

    @GetMapping("/project/{projectKey}")
    public ResponseEntity<ApiResponse> getMilestonesByProject(@PathVariable String projectKey) {
        try {
            List<MilestoneDTO> milestones = milestoneService.getMilestonesByProject(projectKey);
            return ResponseEntity.ok(new ApiResponse(true, milestones, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, null, e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getMilestoneById(@PathVariable Long id) {
        try {
            MilestoneDTO milestone = milestoneService.getMilestoneById(id);
            return ResponseEntity.ok(new ApiResponse(true, milestone, null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, null, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, null, e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateMilestone(
            @PathVariable Long id,
            @RequestBody MilestoneRequestDTO requestDTO) {
        try {
            MilestoneDTO updated = milestoneService.updateMilestone(id, requestDTO);
            return ResponseEntity.ok(new ApiResponse(true, updated, null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, null, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, null, e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteMilestone(@PathVariable Long id) {
        try {
            milestoneService.deleteMilestone(id);
            return ResponseEntity.ok(new ApiResponse(true, "Milestone deleted successfully", null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, null, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, null, e.getMessage()));
        }
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse> deleteAllMilestones() {
        try {
            milestoneService.deleteAllMilestones();
            return ResponseEntity.ok(new ApiResponse(true, "All milestones deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, null, e.getMessage()));
        }
    }

    @DeleteMapping("/project/{projectKey}")
    public ResponseEntity<ApiResponse> deleteMilestonesByProject(@PathVariable String projectKey) {
        try {
            milestoneService.deleteMilestonesByProject(projectKey);
            return ResponseEntity.ok(new ApiResponse(true, "All milestones for project deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, null, e.getMessage()));
        }
    }
}

