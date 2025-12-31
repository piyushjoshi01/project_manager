import { api } from "./axios.config";
/**
 * Jira Projects API
 */
/**
 * Get all Jira projects
 * @returns Array of Jira projects
 */
export const fetchProjects = async () => {
    const res = await api.get("/jira/projects");
    return res.data.data;
};
/**
 * Get project details by project ID or key
 * @param projectIdOrKey - Project ID or key
 * @returns Project details or null if not found
 */
export const fetchProjectByKey = async (projectIdOrKey) => {
    try {
        const res = await api.get(`/jira/projects/${projectIdOrKey}`);
        return res.data.data;
    }
    catch (error) {
        console.error("Error fetching project:", error);
        return null;
    }
};
/**
 * Jira Issues API
 */
/**
 * Get all issues for a specific project
 * @param projectKey - Project key
 * @returns Array of Jira issues
 */
export const fetchIssuesByProject = async (projectKey) => {
    const res = await api.get(`/jira/issues/project/${projectKey}`);
    return res.data.data;
};
/**
 * Get all issues assigned to a specific user
 * @param accountId - User's Jira account ID
 * @returns Array of Jira issues assigned to the user
 */
export const fetchIssuesAssignedToUser = async (accountId) => {
    const res = await api.get(`/jira/issues/assigned/${accountId}`);
    return res.data.data;
};
