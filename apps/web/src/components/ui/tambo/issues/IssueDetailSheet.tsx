import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Issue, IssueStatus, IssuePriority, IssueType } from '@/types';
import { teamMembers, currentUser } from '@/data/mockData';
import { 
  Zap, 
  BookOpen, 
  CheckSquare, 
  Bug, 
  Layers,
  Flag,
  Calendar,
  MessageSquare,
  Clock,
  User,
  Send,
  X,
  Edit2,
  Save
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface IssueDetailSheetProps {
  issue: Issue | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onIssueUpdate?: (issue: Issue) => void;
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

const statusOptions: { value: IssueStatus; label: string; color: string }[] = [
  { value: 'todo', label: 'To Do', color: 'status-todo' },
  { value: 'inprogress', label: 'In Progress', color: 'status-inprogress' },
  { value: 'review', label: 'In Review', color: 'status-review' },
  { value: 'done', label: 'Done', color: 'status-done' },
];

const priorityOptions: { value: IssuePriority; label: string }[] = [
  { value: 'critical', label: 'Critical' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

export function IssueDetailSheet({ issue, open, onOpenChange, onIssueUpdate }: IssueDetailSheetProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [newComment, setNewComment] = useState('');

  if (!issue) return null;

  const TypeIcon = typeIcons[issue.type];

  const handleStartEdit = () => {
    setEditedTitle(issue.title);
    setEditedDescription(issue.description || '');
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (editedTitle.trim()) {
      onIssueUpdate?.({
        ...issue,
        title: editedTitle.trim(),
        description: editedDescription.trim(),
        updatedAt: new Date().toISOString(),
      });
      toast.success('Issue updated');
    }
    setIsEditing(false);
  };

  const handleStatusChange = (status: IssueStatus) => {
    onIssueUpdate?.({
      ...issue,
      status,
      updatedAt: new Date().toISOString(),
    });
    toast.success(`Status changed to ${statusOptions.find(s => s.value === status)?.label}`);
  };

  const handlePriorityChange = (priority: IssuePriority) => {
    onIssueUpdate?.({
      ...issue,
      priority,
      updatedAt: new Date().toISOString(),
    });
    toast.success('Priority updated');
  };

  const handleAssigneeChange = (assigneeId: string) => {
    const assignee = assigneeId === 'unassigned' ? undefined : teamMembers.find(m => m.id === assigneeId);
    onIssueUpdate?.({
      ...issue,
      assignee,
      updatedAt: new Date().toISOString(),
    });
    toast.success(assignee ? `Assigned to ${assignee.name}` : 'Unassigned');
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: `comment-${Date.now()}`,
        content: newComment.trim(),
        author: currentUser,
        createdAt: new Date().toISOString(),
      };
      onIssueUpdate?.({
        ...issue,
        comments: [...issue.comments, comment],
        updatedAt: new Date().toISOString(),
      });
      setNewComment('');
      toast.success('Comment added');
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-lg", typeColors[issue.type])}>
              <TypeIcon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <span className="font-mono text-sm text-muted-foreground">{issue.key}</span>
              <SheetTitle className="text-xl font-heading mt-1">
                {isEditing ? (
                  <Input
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="text-xl font-semibold"
                    autoFocus
                  />
                ) : (
                  issue.title
                )}
              </SheetTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={isEditing ? handleSaveEdit : handleStartEdit}
            >
              {isEditing ? <Save className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
            </Button>
          </div>
        </SheetHeader>

        <div className="space-y-6">
          {/* Status Bar */}
          <div className="flex items-center gap-3">
            <Select value={issue.status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    <span className="flex items-center gap-2">
                      <span className={cn("w-2 h-2 rounded-full", status.color)} />
                      {status.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Description</h4>
            {isEditing ? (
              <Textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                placeholder="Add a description..."
                className="min-h-[100px]"
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                {issue.description || 'No description provided.'}
              </p>
            )}
          </div>

          <Separator />

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Priority */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Flag className="w-4 h-4 text-muted-foreground" />
                Priority
              </label>
              <Select value={issue.priority} onValueChange={handlePriorityChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      <span className="flex items-center gap-2">
                        <span className={cn("p-1 rounded", priorityColors[priority.value])}>
                          <Flag className="w-3 h-3" />
                        </span>
                        {priority.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Assignee */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                Assignee
              </label>
              <Select 
                value={issue.assignee?.id || 'unassigned'} 
                onValueChange={handleAssigneeChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">
                    <span className="text-muted-foreground">Unassigned</span>
                  </SelectItem>
                  {teamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      <span className="flex items-center gap-2">
                        <Avatar className="w-5 h-5">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback className="text-[10px]">{member.name[0]}</AvatarFallback>
                        </Avatar>
                        {member.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Story Points */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Story Points</label>
              <div className="text-sm text-muted-foreground">
                {issue.storyPoints ?? 'Not estimated'}
              </div>
            </div>

            {/* Reporter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Reporter</label>
              <div className="flex items-center gap-2">
                <Avatar className="w-5 h-5">
                  <AvatarImage src={issue.reporter.avatar} />
                  <AvatarFallback className="text-[10px]">{issue.reporter.name[0]}</AvatarFallback>
                </Avatar>
                <span className="text-sm">{issue.reporter.name}</span>
              </div>
            </div>
          </div>

          {/* Labels */}
          {issue.labels.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Labels</label>
              <div className="flex flex-wrap gap-2">
                {issue.labels.map((label) => (
                  <Badge key={label} variant="secondary">
                    {label}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Dates */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Created {format(new Date(issue.createdAt), 'MMM d, yyyy')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Updated {format(new Date(issue.updatedAt), 'MMM d, yyyy')}</span>
            </div>
          </div>

          <Separator />

          {/* Comments */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Comments ({issue.comments.length})
            </h4>

            {/* Comment Input */}
            <div className="flex gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={currentUser.avatar} />
                <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 flex gap-2">
                <Input
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAddComment();
                    }
                  }}
                />
                <Button size="icon" onClick={handleAddComment} disabled={!newComment.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Comments List */}
            <AnimatePresence>
              <div className="space-y-4">
                {issue.comments.map((comment) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3"
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={comment.author.avatar} />
                      <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{comment.author.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(comment.createdAt), 'MMM d, h:mm a')}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{comment.content}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>

            {issue.comments.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No comments yet. Be the first to comment!
              </p>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
