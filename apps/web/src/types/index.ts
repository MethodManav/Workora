export type IssueType = 'epic' | 'story' | 'task' | 'bug' | 'subtask';
export type IssuePriority = 'critical' | 'high' | 'medium' | 'low';
export type IssueStatus = 'todo' | 'inprogress' | 'review' | 'done';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Issue {
  id: string;
  key: string;
  title: string;
  description?: string;
  type: IssueType;
  status: IssueStatus;
  priority: IssuePriority;
  assignee?: User;
  reporter: User;
  labels: string[];
  dueDate?: string;
  storyPoints?: number;
  createdAt: string;
  updatedAt: string;
  projectId: string;
  epicId?: string;
  sprintId?: string;
  comments: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  createdAt: string;
}

export interface Sprint {
  id: string;
  name: string;
  goal?: string;
  startDate: string;
  endDate: string;
  status: 'planning' | 'active' | 'completed';
  projectId: string;
}

export interface Project {
  id: string;
  name: string;
  key: string;
  description?: string;
  type: 'scrum' | 'kanban';
  workspaceId: string;
  createdAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  logo?: string;
  members: WorkspaceMember[];
}

export interface WorkspaceMember {
  user: User;
  role: 'admin' | 'member' | 'viewer';
}

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
}

export interface Column {
  id: IssueStatus;
  title: string;
  issues: Issue[];
}
