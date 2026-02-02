export interface Issue {
  id: string;
  key: string;
  title: string;
  description: string;
  type: 'Epic' | 'Story' | 'Task' | 'Bug' | 'Sub-task';
  status: 'Todo' | 'In Progress' | 'Review' | 'Done';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  assignee?: string;
  reporter: string;
  labels: string[];
  dueDate?: string;
  storyPoints?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  key: string;
  name: string;
  description: string;
  type: 'Scrum' | 'Kanban';
  lead: string;
  icon: string;
}

export interface Sprint {
  id: string;
  name: string;
  status: 'Active' | 'Upcoming' | 'Completed';
  startDate: string;
  endDate: string;
  goal: string;
  issues: string[];
}

export const projects: Project[] = [
  {
    id: '1',
    key: 'DEV',
    name: 'Development',
    description: 'Main product development',
    type: 'Scrum',
    lead: 'Sarah Chen',
    icon: '💻',
  },
  {
    id: '2',
    key: 'DESIGN',
    name: 'Design System',
    description: 'UI/UX component library',
    type: 'Kanban',
    lead: 'Alex Rivera',
    icon: '🎨',
  },
  {
    id: '3',
    key: 'OPS',
    name: 'Operations',
    description: 'Infrastructure and DevOps',
    type: 'Kanban',
    lead: 'Jordan Park',
    icon: '⚙️',
  },
];

export const issues: Issue[] = [
  {
    id: '1',
    key: 'DEV-1',
    title: 'Implement user authentication',
    description: 'Set up OAuth2 authentication with Google and GitHub providers',
    type: 'Story',
    status: 'In Progress',
    priority: 'High',
    assignee: 'Sarah Chen',
    reporter: 'Mike Johnson',
    labels: ['auth', 'backend'],
    dueDate: '2026-02-14',
    storyPoints: 8,
    createdAt: '2026-01-15',
    updatedAt: '2026-02-02',
  },
  {
    id: '2',
    key: 'DEV-2',
    title: 'Fix login bug on mobile',
    description: 'Users unable to login on iOS devices',
    type: 'Bug',
    status: 'Todo',
    priority: 'Critical',
    assignee: 'Alex Kim',
    reporter: 'Sarah Chen',
    labels: ['bug', 'mobile', 'urgent'],
    dueDate: '2026-02-05',
    storyPoints: 3,
    createdAt: '2026-02-01',
    updatedAt: '2026-02-02',
  },
  {
    id: '3',
    key: 'DEV-3',
    title: 'Dashboard redesign',
    description: 'Modernize dashboard UI with new design system',
    type: 'Story',
    status: 'Review',
    priority: 'Medium',
    assignee: 'Emma Wilson',
    reporter: 'Product Team',
    labels: ['ui', 'frontend'],
    dueDate: '2026-02-20',
    storyPoints: 13,
    createdAt: '2026-01-20',
    updatedAt: '2026-02-02',
  },
  {
    id: '4',
    key: 'DEV-4',
    title: 'Setup CI/CD pipeline',
    description: 'Implement GitHub Actions for automated testing and deployment',
    type: 'Task',
    status: 'Done',
    priority: 'High',
    assignee: 'Jordan Park',
    reporter: 'DevOps Team',
    labels: ['devops', 'infrastructure'],
    dueDate: '2026-01-31',
    storyPoints: 5,
    createdAt: '2026-01-10',
    updatedAt: '2026-02-01',
  },
  {
    id: '5',
    key: 'DESIGN-1',
    title: 'Create button component variants',
    description: 'Design primary, secondary, and ghost button states',
    type: 'Task',
    status: 'In Progress',
    priority: 'Medium',
    assignee: 'Alex Rivera',
    reporter: 'Design Lead',
    labels: ['design', 'components'],
    dueDate: '2026-02-10',
    storyPoints: 3,
    createdAt: '2026-02-01',
    updatedAt: '2026-02-02',
  },
  {
    id: '6',
    key: 'DESIGN-2',
    title: 'Icon set completion',
    description: 'Complete 200+ icon set for all use cases',
    type: 'Epic',
    status: 'In Progress',
    priority: 'High',
    assignee: 'Casey Lee',
    reporter: 'Design Lead',
    labels: ['design', 'assets'],
    dueDate: '2026-02-28',
    storyPoints: 21,
    createdAt: '2026-01-15',
    updatedAt: '2026-02-02',
  },
  {
    id: '7',
    key: 'OPS-1',
    title: 'Database migration to PostgreSQL',
    description: 'Migrate from MongoDB to PostgreSQL',
    type: 'Story',
    status: 'Todo',
    priority: 'High',
    assignee: 'Jordan Park',
    reporter: 'Tech Lead',
    labels: ['database', 'infrastructure'],
    dueDate: '2026-03-01',
    storyPoints: 13,
    createdAt: '2026-01-25',
    updatedAt: '2026-02-02',
  },
  {
    id: '8',
    key: 'OPS-2',
    title: 'Setup monitoring and alerts',
    description: 'Implement DataDog monitoring and PagerDuty alerts',
    type: 'Task',
    status: 'Done',
    priority: 'Medium',
    assignee: 'Taylor Brown',
    reporter: 'Operations',
    labels: ['monitoring', 'infrastructure'],
    dueDate: '2026-01-28',
    storyPoints: 5,
    createdAt: '2026-01-20',
    updatedAt: '2026-02-01',
  },
  {
    id: '9',
    key: 'DEV-5',
    title: 'Add dark mode support',
    description: 'Implement system-wide dark mode with user preference storage',
    type: 'Story',
    status: 'Todo',
    priority: 'Low',
    assignee: 'Emma Wilson',
    reporter: 'Community Feedback',
    labels: ['ui', 'frontend', 'enhancement'],
    dueDate: '2026-03-15',
    storyPoints: 5,
    createdAt: '2026-02-01',
    updatedAt: '2026-02-02',
  },
  {
    id: '10',
    key: 'DEV-6',
    title: 'API rate limiting',
    description: 'Implement rate limiting for API endpoints',
    type: 'Task',
    status: 'Review',
    priority: 'High',
    assignee: 'Alex Kim',
    reporter: 'Security Team',
    labels: ['backend', 'security'],
    dueDate: '2026-02-08',
    storyPoints: 3,
    createdAt: '2026-01-28',
    updatedAt: '2026-02-02',
  },
];

export const sprints: Sprint[] = [
  {
    id: '1',
    name: 'Sprint 1',
    status: 'Active',
    startDate: '2026-01-27',
    endDate: '2026-02-10',
    goal: 'Core authentication and dashboard foundation',
    issues: ['1', '3', '5'],
  },
  {
    id: '2',
    name: 'Sprint 2',
    status: 'Upcoming',
    startDate: '2026-02-11',
    endDate: '2026-02-24',
    goal: 'Mobile optimization and performance',
    issues: ['2', '9'],
  },
];

export const teamMembers = [
  'Sarah Chen',
  'Alex Rivera',
  'Jordan Park',
  'Alex Kim',
  'Emma Wilson',
  'Mike Johnson',
  'Casey Lee',
  'Taylor Brown',
];
