export interface JiraProject {
id: string;
key: string;
name: string;
}


export interface JiraIssue {
id: string;
key: string;
fields: {
  summary: string;
  status: {
    name: string;
  };
  assignee?: {
    accountId: string;
    displayName: string;
    emailAddress?: string;
  } | null;
};
}