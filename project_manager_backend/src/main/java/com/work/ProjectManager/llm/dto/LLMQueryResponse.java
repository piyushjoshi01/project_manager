package com.work.ProjectManager.llm.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for LLM query responses from external LLM server
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LLMQueryResponse {
    private String response;
    private String error;
}

