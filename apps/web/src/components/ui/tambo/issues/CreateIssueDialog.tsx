import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
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
import { teamMembers, projects } from '@/data/mockData';
import { IssueType, IssuePriority } from '@/types';
import { 
  Zap, 
  BookOpen, 
  CheckSquare, 
  Bug, 
  Layers,
  Flag,
  X,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const issueSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().max(5000, 'Description must be less than 5000 characters').optional(),
  type: z.enum(['epic', 'story', 'task', 'bug', 'subtask']),
  priority: z.enum(['critical', 'high', 'medium', 'low']),
  assigneeId: z.string().optional(),
  projectId: z.string().min(1, 'Project is required'),
  storyPoints: z.number().min(0).max(100).optional(),
  labels: z.array(z.string()).default([]),
});

type IssueFormData = z.infer<typeof issueSchema>;

interface CreateIssueDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onIssueCreated?: (issue: IssueFormData) => void;
}

const typeOptions: { value: IssueType; label: string; icon: React.ElementType; color: string }[] = [
  { value: 'epic', label: 'Epic', icon: Zap, color: 'issue-epic' },
  { value: 'story', label: 'Story', icon: BookOpen, color: 'issue-story' },
  { value: 'task', label: 'Task', icon: CheckSquare, color: 'issue-task' },
  { value: 'bug', label: 'Bug', icon: Bug, color: 'issue-bug' },
  { value: 'subtask', label: 'Sub-task', icon: Layers, color: 'issue-subtask' },
];

const priorityOptions: { value: IssuePriority; label: string; color: string }[] = [
  { value: 'critical', label: 'Critical', color: 'priority-critical' },
  { value: 'high', label: 'High', color: 'priority-high' },
  { value: 'medium', label: 'Medium', color: 'priority-medium' },
  { value: 'low', label: 'Low', color: 'priority-low' },
];

export function CreateIssueDialog({ open, onOpenChange, onIssueCreated }: CreateIssueDialogProps) {
  const [labelInput, setLabelInput] = useState('');
  
  const form = useForm<IssueFormData>({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      title: '',
      description: '',
      type: 'task',
      priority: 'medium',
      projectId: projects[0]?.id || '',
      labels: [],
    },
  });

  const labels = form.watch('labels');

  const handleAddLabel = () => {
    if (labelInput.trim() && !labels.includes(labelInput.trim())) {
      form.setValue('labels', [...labels, labelInput.trim()]);
      setLabelInput('');
    }
  };

  const handleRemoveLabel = (label: string) => {
    form.setValue('labels', labels.filter(l => l !== label));
  };

  const onSubmit = (data: IssueFormData) => {
    onIssueCreated?.(data);
    toast.success('Issue created successfully!');
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">Create Issue</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Project & Type Row */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select project" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {projects.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            <span className="flex items-center gap-2">
                              <span className="font-mono text-xs text-muted-foreground">{project.key}</span>
                              {project.name}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issue Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {typeOptions.map((type) => {
                          const Icon = type.icon;
                          return (
                            <SelectItem key={type.value} value={type.value}>
                              <span className="flex items-center gap-2">
                                <span className={cn("p-1 rounded", type.color)}>
                                  <Icon className="w-3 h-3" />
                                </span>
                                {type.label}
                              </span>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="What needs to be done?" 
                      className="text-lg"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add a detailed description..."
                      className="min-h-[120px] resize-none"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Priority & Assignee Row */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {priorityOptions.map((priority) => (
                          <SelectItem key={priority.value} value={priority.value}>
                            <span className="flex items-center gap-2">
                              <span className={cn("p-1 rounded", priority.color)}>
                                <Flag className="w-3 h-3" />
                              </span>
                              {priority.label}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="assigneeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assignee</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Unassigned" />
                        </SelectTrigger>
                      </FormControl>
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Story Points */}
            <FormField
              control={form.control}
              name="storyPoints"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Story Points</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      placeholder="Estimate effort"
                      min={0}
                      max={100}
                      className="w-32"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Labels */}
            <div className="space-y-2">
              <FormLabel>Labels</FormLabel>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Add a label..."
                  value={labelInput}
                  onChange={(e) => setLabelInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddLabel();
                    }
                  }}
                  className="flex-1"
                />
                <Button type="button" variant="outline" size="sm" onClick={handleAddLabel}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <AnimatePresence>
                {labels.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-wrap gap-2 pt-2"
                  >
                    {labels.map((label) => (
                      <motion.div
                        key={label}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                      >
                        <Badge variant="secondary" className="gap-1">
                          {label}
                          <button
                            type="button"
                            onClick={() => handleRemoveLabel(label)}
                            className="hover:bg-muted rounded-full p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-primary hover:opacity-90">
                Create Issue
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
