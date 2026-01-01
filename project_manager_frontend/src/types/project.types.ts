export interface Project {
  id: string;
  name: string;
  description: string;
  status: "active" | "paused" | "completed";
}

export interface TimelineEvent {
  id: string;
  projectId: string;
  name: string;
  start: string;
  end: string;
  progress: number;
}
