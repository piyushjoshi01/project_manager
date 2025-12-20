package com.work.ProjectManager.llm.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for LLM query requests
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LLMQueryRequest {
    private String prompt;
    private String projectKey;
}

