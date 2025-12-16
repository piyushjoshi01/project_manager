import { JiraIssue, JiraProject } from "types/jira.types";
import { api } from "./axios.config";


export const fetchProjects = async (): Promise<JiraProject[]> => {
const res = await api.get("/jira/projects");
console.log(res.data.data);
return res.data.data;
};


export const fetchIssuesByProject = async (projectKey: string): Promise<JiraIssue[]> => {
const res = await api.get(`/jira/issues/project/${projectKey}`);
return res.data.data;
};

export const fetchProjectByKey = async (projectKey: string): Promise<JiraProject | null> => {
try {
  const res = await api.get(`/jira/projects/${projectKey}`);
  return res.data.data;
} catch (error) {
  console.error("Error fetching project:", error);
  return null;
}
};

// Milestones API - matches backend controller at /api/milestones
export const fetchMilestones = async (projectKey?: string) => {
  const res = await api.get(`/milestones`);
  const milestones = res.data.data || [];
  // If projectKey is provided, filter milestones (assuming backend might add projectKey later)
  // For now, return all milestones as backend doesn't have projectKey filtering
  return milestones;
};

export const createMilestone = async (projectKey: string, milestone: any) => {
  // Backend /bulk endpoint expects an array of MilestoneRequestDTO
  const res = await api.post(`/milestones/bulk`, [milestone]);
  return res.data.data;
};

export const updateMilestone = async (projectKey: string, milestoneId: string, milestone: any) => {
  // Backend PUT /{id} expects a single MilestoneRequestDTO (not an array)
  const res = await api.put(`/milestones/${milestoneId}`, milestone);
  return res.data.data;
};

export const deleteMilestone = async (projectKey: string, milestoneId: string) => {
  // Backend DELETE /{id} expects just the id in path
  const res = await api.delete(`/milestones/${milestoneId}`);
  return res.data;
};