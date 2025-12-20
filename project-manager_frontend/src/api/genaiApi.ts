import { api } from "./axios.config";
import { IssueAnalysis, AssigneePerformance, LLMData } from "../types/llm.types";

/**
 * LLM/GenAI API - All endpoints for LLM data and analysis
 */

/**
 * Sync issues from Jira for a specific project
 * This will fetch and analyze issues from Jira and store them in the database
 * @param projectKey - Project key to sync
 * @returns Success message
 */
export const syncProjectIssues = async (projectKey: string): Promise<string> => {
  const res = await api.post(`/llm/sync/project/${projectKey}`);
  return res.data.data || "Issues synced successfully";
};

/**
 * Get all LLM data (issues and assignee performance)
 * @returns LLM data containing all issues and assignee performance metrics
 */
export const getAllLLMData = async (): Promise<LLMData> => {
  const res = await api.get("/llm/data");
  return res.data.data;
};

/**
 * Get LLM data for a specific project
 * @param projectKey - Project key
 * @returns LLM data for the specified project
 */
export const getProjectLLMData = async (projectKey: string): Promise<LLMData> => {
  const res = await api.get(`/llm/data/project/${projectKey}`);
  return res.data.data;
};

/**
 * Update assignee hourly cost
 * @param accountId - Assignee's Jira account ID
 * @param hourlyCost - New hourly cost
 * @returns Success message
 */
export const updateAssigneeCost = async (
  accountId: string,
  hourlyCost: number
): Promise<string> => {
  const res = await api.put(`/llm/assignee/${accountId}/cost`, null, {
    params: { hourlyCost },
  });
  return res.data.data || "Assignee cost updated successfully";
};

/**
 * Recalculate all performance metrics
 * This will recalculate efficiency scores and costs for all assignees
 * @returns Success message
 */
export const recalculatePerformance = async (): Promise<string> => {
  const res = await api.post("/llm/recalculate");
  return res.data.data || "Performance metrics recalculated";
};

/**
 * Send a prompt/question to the LLM for analysis
 * @param prompt - User's question or prompt
 * @param projectKey - Optional project key for project-specific context
 * @returns LLM response
 */
export const askLLM = async (prompt: string, projectKey?: string): Promise<string> => {
  const res = await api.post("/llm/ask", { prompt, projectKey });
  return res.data.data || "";
};
