export interface Milestone {
  id?: number | string; // Backend returns Long (number), but keeping flexible for string IDs
  name: string;
  startDate: string; // ISO date string (YYYY-MM-DD)
  endDate: string; // ISO date string (YYYY-MM-DD)
  description: string;
  status?: 'on-track' | 'at-risk' | 'delayed'; // Calculated on frontend, not from backend
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

