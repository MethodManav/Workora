'use client';

import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { Issue } from '@/lib/demo-data';

interface IssueFiltersProps {
  issues: Issue[];
  onFilter: (filtered: Issue[]) => void;
}

export function IssueFilters({ issues, onFilter }: IssueFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: [] as string[],
    priority: [] as string[],
    type: [] as string[],
    assignee: [] as string[],
    label: [] as string[],
  });

  const statusOptions = ['Todo', 'In Progress', 'Review', 'Done'];
  const priorityOptions = ['Low', 'Medium', 'High', 'Critical'];
  const typeOptions = ['Epic', 'Story', 'Task', 'Bug', 'Sub-task'];
  const assigneeOptions = Array.from(new Set(issues.map((i) => i.assignee).filter(Boolean))) as string[];
  const labelOptions = Array.from(new Set(issues.flatMap((i) => i.labels)));

  const handleFilterChange = (category: keyof typeof filters, value: string) => {
    setFilters((prev) => {
      const updated = { ...prev };
      if (updated[category].includes(value)) {
        updated[category] = updated[category].filter((v) => v !== value);
      } else {
        updated[category] = [...updated[category], value];
      }
      return updated;
    });
  };

  const applyFilters = () => {
    let filtered = issues;

    if (filters.status.length > 0) {
      filtered = filtered.filter((i) => filters.status.includes(i.status));
    }
    if (filters.priority.length > 0) {
      filtered = filtered.filter((i) => filters.priority.includes(i.priority));
    }
    if (filters.type.length > 0) {
      filtered = filtered.filter((i) => filters.type.includes(i.type));
    }
    if (filters.assignee.length > 0) {
      filtered = filtered.filter((i) => filters.assignee.includes(i.assignee || ''));
    }
    if (filters.label.length > 0) {
      filtered = filtered.filter((i) =>
        filters.label.some((l) => i.labels.includes(l))
      );
    }

    onFilter(filtered);
    setIsOpen(false);
  };

  const clearFilters = () => {
    setFilters({
      status: [],
      priority: [],
      type: [],
      assignee: [],
      label: [],
    });
    onFilter(issues);
  };

  const hasActiveFilters = Object.values(filters).some((v) => v.length > 0);
  const totalFilters = Object.values(filters).reduce((sum, v) => sum + v.length, 0);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
          hasActiveFilters
            ? 'bg-primary/10 border-primary text-primary hover:bg-primary/20'
            : 'border-border text-foreground hover:bg-muted'
        }`}
      >
        <Filter size={18} />
        <span className="font-medium">Filters</span>
        {hasActiveFilters && (
          <span className="ml-1 px-2 py-0.5 rounded-full bg-primary text-white text-xs font-bold">
            {totalFilters}
          </span>
        )}
      </button>

      {/* Filter panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          {/* Panel */}
          <div className="absolute top-full left-0 mt-2 w-96 bg-white rounded-lg border border-border shadow-xl z-50 max-h-96 overflow-y-auto">
            <div className="p-4 space-y-4">
              {/* Status */}
              <div>
                <h4 className="font-semibold text-sm text-foreground mb-2">Status</h4>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((status) => (
                    <button
                      key={status}
                      onClick={() => handleFilterChange('status', status)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        filters.status.includes(status)
                          ? 'bg-primary text-white'
                          : 'bg-muted text-foreground hover:bg-secondary/20'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority */}
              <div className="border-t border-border pt-4">
                <h4 className="font-semibold text-sm text-foreground mb-2">Priority</h4>
                <div className="flex flex-wrap gap-2">
                  {priorityOptions.map((priority) => (
                    <button
                      key={priority}
                      onClick={() => handleFilterChange('priority', priority)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        filters.priority.includes(priority)
                          ? 'bg-primary text-white'
                          : 'bg-muted text-foreground hover:bg-secondary/20'
                      }`}
                    >
                      {priority}
                    </button>
                  ))}
                </div>
              </div>

              {/* Type */}
              <div className="border-t border-border pt-4">
                <h4 className="font-semibold text-sm text-foreground mb-2">Issue Type</h4>
                <div className="flex flex-wrap gap-2">
                  {typeOptions.map((type) => (
                    <button
                      key={type}
                      onClick={() => handleFilterChange('type', type)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        filters.type.includes(type)
                          ? 'bg-primary text-white'
                          : 'bg-muted text-foreground hover:bg-secondary/20'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Assignee */}
              {assigneeOptions.length > 0 && (
                <div className="border-t border-border pt-4">
                  <h4 className="font-semibold text-sm text-foreground mb-2">Assignee</h4>
                  <div className="flex flex-wrap gap-2">
                    {assigneeOptions.map((assignee) => (
                      <button
                        key={assignee}
                        onClick={() => handleFilterChange('assignee', assignee)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          filters.assignee.includes(assignee)
                            ? 'bg-primary text-white'
                            : 'bg-muted text-foreground hover:bg-secondary/20'
                        }`}
                      >
                        {assignee.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Labels */}
              {labelOptions.length > 0 && (
                <div className="border-t border-border pt-4">
                  <h4 className="font-semibold text-sm text-foreground mb-2">Labels</h4>
                  <div className="flex flex-wrap gap-2">
                    {labelOptions.slice(0, 8).map((label) => (
                      <button
                        key={label}
                        onClick={() => handleFilterChange('label', label)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          filters.label.includes(label)
                            ? 'bg-primary text-white'
                            : 'bg-muted text-foreground hover:bg-secondary/20'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="border-t border-border pt-4 flex gap-2">
                <button
                  onClick={applyFilters}
                  className="flex-1 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 font-medium transition-colors"
                >
                  Apply Filters
                </button>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="flex-1 px-4 py-2 rounded-lg border border-border text-foreground hover:bg-muted font-medium transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
