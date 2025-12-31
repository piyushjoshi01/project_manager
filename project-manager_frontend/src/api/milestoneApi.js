import { api } from "./axios.config";
/**
 * Get all milestones (optionally filtered by project)
 * @param projectKey - Optional project key to filter milestones
 * @returns Array of milestones
 */
export const fetchMilestones = async (projectKey) => {
    const url = projectKey
        ? `/milestones/project/${projectKey}`
        : "/milestones";
    const res = await api.get(url);
    return res.data.data || [];
};
/**
 * Get milestones for a specific project
 * @param projectKey - Project key
 * @returns Array of milestones for the project
 */
export const fetchMilestonesByProject = async (projectKey) => {
    const res = await api.get(`/milestones/project/${projectKey}`);
    return res.data.data || [];
};
/**
 * Get a milestone by ID
 * @param id - Milestone ID
 * @returns Milestone details
 */
export const fetchMilestoneById = async (id) => {
    const res = await api.get(`/milestones/${id}`);
    return res.data.data;
};
/**
 * Create a single milestone
 * @param milestone - Milestone data to create
 * @returns Created milestone
 */
export const createMilestone = async (milestone) => {
    const res = await api.post("/milestones", milestone);
    return res.data.data;
};
/**
 * Create multiple milestones in bulk
 * @param milestones - Array of milestone data to create
 * @returns Array of created milestones
 */
export const createMilestones = async (milestones) => {
    const res = await api.post("/milestones/bulk", milestones);
    return res.data.data;
};
/**
 * Update a milestone by ID
 * @param id - Milestone ID
 * @param milestone - Updated milestone data
 * @returns Updated milestone
 */
export const updateMilestone = async (id, milestone) => {
    const res = await api.put(`/milestones/${id}`, milestone);
    return res.data.data;
};
/**
 * Delete a milestone by ID
 * @param id - Milestone ID
 * @returns Success response
 */
export const deleteMilestone = async (id) => {
    await api.delete(`/milestones/${id}`);
};
/**
 * Delete all milestones
 * @returns Success response
 */
export const deleteAllMilestones = async () => {
    await api.delete("/milestones");
};
