import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Issue } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  BookOpen, 
  CheckSquare, 
  Bug, 
  Layers,
  Flag,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface IssueCardProps {
  issue: Issue;
  isDragging?: boolean;
  onClick?: (issue: Issue) => void;
}

const typeIcons = {
  epic: Zap,
  story: BookOpen,
  task: CheckSquare,
  bug: Bug,
  subtask: Layers,
};

const typeColors = {
  epic: 'issue-epic',
  story: 'issue-story',
  task: 'issue-task',
  bug: 'issue-bug',
  subtask: 'issue-subtask',
};

const priorityColors = {
  critical: 'priority-critical',
  high: 'priority-high',
  medium: 'priority-medium',
  low: 'priority-low',
};

export const IssueCard = forwardRef<HTMLDivElement, IssueCardProps>(
  ({ issue, isDragging = false, onClick }, ref) => {
    const TypeIcon = typeIcons[issue.type];

    const handleClick = (e: React.MouseEvent) => {
      // Don't trigger click when dragging
      if (!isDragging) {
        onClick?.(issue);
      }
    };

    return (
      <motion.div
        ref={ref}
        layout
        layoutId={issue.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        whileHover={{ y: -2 }}
        onClick={handleClick}
        className={cn(
          "issue-card",
          isDragging && "dragging"
        )}
      >
        {/* Header: Type & Key */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className={cn("p-1 rounded", typeColors[issue.type])}>
              <TypeIcon className="w-3 h-3" />
            </div>
            <span className="font-mono text-xs text-muted-foreground">
              {issue.key}
            </span>
          </div>
          {issue.storyPoints && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5">
              {issue.storyPoints} pts
            </Badge>
          )}
        </div>

        {/* Title */}
        <h4 className="text-sm font-medium text-foreground mb-2 truncate-2">
          {issue.title}
        </h4>

        {/* Labels */}
        {issue.labels.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {issue.labels.slice(0, 2).map((label) => (
              <Badge 
                key={label} 
                variant="secondary" 
                className="text-[10px] px-1.5 py-0"
              >
                {label}
              </Badge>
            ))}
            {issue.labels.length > 2 && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                +{issue.labels.length - 2}
              </Badge>
            )}
          </div>
        )}

        {/* Footer: Priority, Due Date, Assignee */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/50">
          <div className="flex items-center gap-2">
            {/* Priority */}
            <div className={cn("p-1 rounded", priorityColors[issue.priority])}>
              <Flag className="w-3 h-3" />
            </div>

            {/* Due Date */}
            {issue.dueDate && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="w-3 h-3" />
                <span className="text-[10px]">
                  {new Date(issue.dueDate).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
            )}

            {/* Comments */}
            {issue.comments.length > 0 && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <MessageSquare className="w-3 h-3" />
                <span className="text-[10px]">{issue.comments.length}</span>
              </div>
            )}
          </div>

          {/* Assignee */}
          {issue.assignee && (
            <Avatar className="w-6 h-6 border border-border">
              <AvatarImage src={issue.assignee.avatar} />
              <AvatarFallback className="text-[10px]">
                {issue.assignee.name[0]}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </motion.div>
    );
  }
);

IssueCard.displayName = 'IssueCard';
