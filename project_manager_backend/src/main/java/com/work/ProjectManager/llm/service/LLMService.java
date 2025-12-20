package com.work.ProjectManager.llm.service;

import com.work.ProjectManager.llm.dto.LLMDataDTO;
import com.work.ProjectManager.llm.dto.LLMQueryResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

/**
 * Service for interacting with external LLM server
 */
@Slf4j
@Service
public class LLMService {

    private WebClient webClient;
    
    @Value("${llm.server.url:http://localhost:8000}")
    private String llmServerUrl;
    
    @Value("${llm.server.api-key:}")
    private String llmApiKey;
    
    @Value("${llm.server.timeout:30}")
    private int timeoutSeconds;

    private final WebClient.Builder webClientBuilder;

    public LLMService(WebClient.Builder webClientBuilder) {
        this.webClientBuilder = webClientBuilder;
    }

    @jakarta.annotation.PostConstruct
    public void init() {
        this.webClient = webClientBuilder
                .baseUrl(llmServerUrl)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
    }

    /**
     * Send a prompt to the external LLM server
     * 
     * Expected request format to LLM server:
     * POST {llmServerUrl}/api/chat
     * {
     *   "prompt": "user question",
     *   "context": { ... project data ... }
     * }
     * 
     * Expected response format from LLM server:
     * {
     *   "response": "LLM generated answer",
     *   "error": null
     * }
     * 
     * @param prompt User's question
     * @param context Project data to provide as context
     * @return LLM response
     */
    public Mono<String> askLLM(String prompt, LLMDataDTO context) {
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("prompt", prompt);
        requestBody.put("context", context);
        
        // Add API key to headers if configured
        WebClient.RequestHeadersSpec<?> requestSpec = webClient.post()
                .uri("/api/chat")
                .bodyValue(requestBody);
        
        if (llmApiKey != null && !llmApiKey.isEmpty()) {
            requestSpec = requestSpec.header("Authorization", "Bearer " + llmApiKey);
        }
        
        return requestSpec
                .retrieve()
                .bodyToMono(LLMQueryResponse.class)
                .timeout(Duration.ofSeconds(timeoutSeconds))
                .map(response -> {
                    if (response.getError() != null && !response.getError().isEmpty()) {
                        throw new RuntimeException("LLM server error: " + response.getError());
                    }
                    return response.getResponse();
                })
                .doOnError(error -> {
                    log.error("Error calling LLM server: {}", error.getMessage());
                })
                .onErrorResume(error -> {
                    // Fallback to simple response if LLM server is unavailable
                    log.warn("LLM server unavailable, using fallback response");
                    return Mono.just(generateFallbackResponse(prompt, context));
                });
    }

    /**
     * Fallback response generator when LLM server is unavailable
     */
    private String generateFallbackResponse(String prompt, LLMDataDTO data) {
        String lowerPrompt = prompt.toLowerCase();
        
        if (lowerPrompt.contains("cost") || lowerPrompt.contains("expensive")) {
            double totalCost = data.getIssues().stream()
                    .mapToDouble(issue -> issue.getTotalCost() != null ? issue.getTotalCost() : 0.0)
                    .sum();
            return String.format("The total cost across all issues is $%.2f. There are %d issues and %d assignees in the system.",
                    totalCost, data.getIssues().size(), data.getAssignees().size());
        }
        
        if (lowerPrompt.contains("efficient") || lowerPrompt.contains("performance")) {
            if (data.getAssignees().isEmpty()) {
                return "No assignee performance data available. Please sync issues first.";
            }
            var topAssignee = data.getAssignees().stream()
                    .max((a, b) -> Double.compare(
                            a.getAverageEfficiencyScore() != null ? a.getAverageEfficiencyScore() : 0.0,
                            b.getAverageEfficiencyScore() != null ? b.getAverageEfficiencyScore() : 0.0
                    ));
            if (topAssignee.isPresent()) {
                var assignee = topAssignee.get();
                return String.format("The most efficient assignee is %s with an average efficiency score of %.2f. They completed %d issues with an average time of %.2f hours.",
                        assignee.getName(), assignee.getAverageEfficiencyScore(), assignee.getTotalIssuesCompleted(), assignee.getAverageTimeHours());
            }
        }
        
        if (lowerPrompt.contains("issue") || lowerPrompt.contains("task")) {
            return String.format("There are %d issues in the system. %d are completed. The average time per issue is %.2f hours.",
                    data.getIssues().size(),
                    data.getIssues().stream().mapToInt(i -> "Done".equalsIgnoreCase(i.getStatus()) ? 1 : 0).sum(),
                    data.getIssues().stream().mapToDouble(i -> i.getTimeTakenHours() != null ? i.getTimeTakenHours() : 0.0).average().orElse(0.0));
        }
        
        // Default response
        return String.format("Based on the project data: There are %d issues and %d assignees. " +
                "The total cost is $%.2f. " +
                "Would you like more specific information about costs, efficiency, or issues?",
                data.getIssues().size(),
                data.getAssignees().size(),
                data.getIssues().stream().mapToDouble(i -> i.getTotalCost() != null ? i.getTotalCost() : 0.0).sum());
    }
}

