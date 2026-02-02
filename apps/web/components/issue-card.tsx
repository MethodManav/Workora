'use client';

import { Issue } from '@/lib/demo-data';
import { AlertCircle, CheckCircle2, Clock, Flag } from 'lucide-react';

interface IssueCardProps {
  issue: Issue;
  onClick?: () => void;
}

export function IssueCard({ issue, onClick }: IssueCardProps) {
  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      Epic: 'bg-purple-100 text-purple-700',
      Story: 'bg-blue-100 text-blue-700',
      Task: 'bg-green-100 text-green-700',
      Bug: 'bg-red-100 text-red-700',
      'Sub-task': 'bg-gray-100 text-gray-700',
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  const getStatusIcon = () => {
    if (issue.status === 'Done') return <CheckCircle2 size={16} className="text-green-600" />;
    if (issue.status === 'In Progress') return <Clock size={16} className="text-amber-600" />;
    if (issue.status === 'Review') return <AlertCircle size={16} className="text-blue-600" />;
    return null;
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      Critical: 'text-red-600',
      High: 'text-orange-600',
      Medium: 'text-yellow-600',
      Low: 'text-green-600',
    };
    return colors[priority] || 'text-gray-600';
  };

  return (
    <div
      onClick={onClick}
      className="bg-white p-4 rounded-xl border border-border hover:shadow-md transition-all cursor-pointer group hover:border-primary/50"
    >
      <div className="flex items-start justify-between mb-2">
        <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${getTypeColor(issue.type)}`}>
          {issue.type}
        </span>
        {getStatusIcon()}
      </div>

      <h3 className="font-semibold text-sm text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-2">
        {issue.key}: {issue.title}
      </h3>

      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{issue.description}</p>

      <div className="flex flex-wrap gap-1 mb-3">
        {issue.labels.slice(0, 2).map((label) => (
          <span
            key={label}
            className="text-xs px-2 py-1 rounded-full bg-secondary/20 text-secondary-foreground"
          >
            {label}
          </span>
        ))}
        {issue.labels.length > 2 && (
          <span className="text-xs px-2 py-1 text-muted-foreground">+{issue.labels.length - 2}</span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {issue.assignee && (
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent text-white text-xs font-bold flex items-center justify-center">
              {issue.assignee.split(' ')[0][0]}
            </div>
          )}
          {issue.storyPoints && (
            <span className="text-xs font-semibold px-2 py-1 rounded-md bg-muted text-foreground">
              {issue.storyPoints} pts
            </span>
          )}
        </div>
        <Flag size={14} className={`${getPriorityColor(issue.priority)}`} />
      </div>
    </div>
  );
}
