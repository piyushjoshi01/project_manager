//package com.work.ProjectManager.jira.controllers;
//
//import com.work.ProjectManager.jira.service.JiraService;
//import com.work.ProjectManager.utils.ApiResponse;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PathVariable;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//import reactor.core.publisher.Mono;
//
//@RestController
//@RequestMapping("/api/jira/users")
//public class JiraUserController {
//
//    private final JiraService jiraService;
//
//    public JiraUserController(JiraService jiraService) {
//        this.jiraService = jiraService;
//    }
//
//    @GetMapping
//    public Mono<ResponseEntity<ApiResponse>> getAllUsers() {
//        return jiraService.getAllUsers()
//                .map(users -> ResponseEntity.ok(new ApiResponse(true, users, null)))
//                .onErrorResume(e ->
//                        Mono.just(ResponseEntity.badRequest()
//                                .body(new ApiResponse(false, null, e.getMessage()))));
//    }
//
//    @GetMapping("/{accountId}")
//    public Mono<ResponseEntity<ApiResponse>> getUserDetails(@PathVariable String accountId) {
//        return jiraService.getUserDetails(accountId)
//                .map(user -> ResponseEntity.ok(new ApiResponse(true, user, null)))
//                .onErrorResume(e ->
//                        Mono.just(ResponseEntity.badRequest()
//                                .body(new ApiResponse(false, null, e.getMessage()))));
//    }
//}
