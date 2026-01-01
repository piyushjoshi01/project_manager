/**
 * LLM/GenAI Data Types
 */

export interface IssueAnalysis {
  issueKey: string;
  projectKey: string;
  summary: string;
  description: string;
  assigneeName: string;
  assigneeEmail: string;
  status: string;
  timeTakenHours: number;
  totalCost: number;
  efficiencyScore: number;
}

export interface AssigneePerformance {
  accountId: string;
  name: string;
  email: string;
  hourlyCost: number;
  totalIssuesCompleted: number;
  averageTimeHours: number;
  averageEfficiencyScore: number;
  totalCostIncurred: number;
}

export interface LLMData {
  issues: IssueAnalysis[];
  assignees: AssigneePerformance[];
}

