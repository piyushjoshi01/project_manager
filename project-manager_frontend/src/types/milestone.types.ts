export interface Milestone {
  id?: string;
  name: string;
  startDate: string;
  endDate: string;
  description: string;
  status?: 'on-track' | 'at-risk' | 'delayed';
}

export interface MilestoneStatus {
  totalIssues: number;
  toDo: number;
  backlog: number;
  completed: number;
  inProgress: number;
  status: 'on-track' | 'at-risk' | 'delayed';
  progress: number; // 0-100
}

