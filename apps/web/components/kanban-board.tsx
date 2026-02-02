'use client';

import { useState } from 'react';
import { Issue, issues } from '@/lib/demo-data';
import { IssueCard } from './issue-card';
import { Plus } from 'lucide-react';

interface KanbanBoardProps {
  projectKey: string;
}

export function KanbanBoard({ projectKey }: KanbanBoardProps) {
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  const columns = ['Todo', 'In Progress', 'Review', 'Done'];

  // Group issues by status, filtered by project
  const getIssuesByStatus = (status: string) => {
    return issues.filter((i) => i.status === status && i.key.startsWith(projectKey));
  };

  return (
    <div className="space-y-6">
      {/* Board Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Kanban Board</h1>
          <p className="text-muted-foreground">Drag and drop issues to update their status</p>
        </div>
        <button className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors flex items-center gap-2 font-medium">
          <Plus size={18} />
          New Issue
        </button>
      </div>

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-8">
        {columns.map((status) => (
          <div
            key={status}
            className="bg-muted rounded-xl p-4 min-h-[600px] flex flex-col border border-border"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
              <div>
                <h2 className="font-semibold text-foreground">{status}</h2>
                <p className="text-xs text-muted-foreground">
                  {getIssuesByStatus(status).length} issues
                </p>
              </div>
              <button className="p-1.5 hover:bg-background rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                <Plus size={16} />
              </button>
            </div>

            {/* Issues */}
            <div className="flex-1 space-y-2 overflow-y-auto">
              {getIssuesByStatus(status).length > 0 ? (
                getIssuesByStatus(status).map((issue) => (
                  <div
                    key={issue.id}
                    onClick={() => setSelectedIssue(issue)}
                    className="transition-transform hover:scale-105"
                  >
                    <IssueCard issue={issue} />
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-20 text-muted-foreground text-sm">
                  No issues
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Issue Detail Modal */}
      {selectedIssue && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom-5 sm:animate-in sm:zoom-in-95">
            {/* Close button */}
            <div className="sticky top-0 flex justify-end p-4 bg-white border-b border-border">
              <button
                onClick={() => setSelectedIssue(null)}
                className="text-2xl hover:text-muted-foreground transition-colors"
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              <div>
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-blue-100 text-blue-700">
                    {selectedIssue.type}
                  </span>
                  <span className="text-lg font-bold text-muted-foreground">{selectedIssue.key}</span>
                </div>
                <h1 className="text-2xl font-bold text-foreground">{selectedIssue.title}</h1>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase">Status</p>
                  <p className="font-medium text-foreground">{selectedIssue.status}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase">Priority</p>
                  <p className="font-medium text-foreground">{selectedIssue.priority}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase">Assignee</p>
                  <p className="font-medium text-foreground">{selectedIssue.assignee || 'Unassigned'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase">Due Date</p>
                  <p className="font-medium text-foreground">{selectedIssue.dueDate || 'No date'}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase">Description</p>
                <p className="text-sm text-foreground">{selectedIssue.description}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase">Labels</p>
                <div className="flex flex-wrap gap-2">
                  {selectedIssue.labels.map((label) => (
                    <span
                      key={label}
                      className="text-xs px-3 py-1 rounded-full bg-secondary/20 text-secondary-foreground"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
