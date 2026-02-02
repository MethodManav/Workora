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
  FormDescription,
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
import { Kanban, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100, 'Name must be less than 100 characters'),
  key: z.string()
    .min(2, 'Key must be at least 2 characters')
    .max(10, 'Key must be 10 characters or less')
    .regex(/^[A-Z]+$/, 'Key must be uppercase letters only'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  type: z.enum(['scrum', 'kanban']),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectCreated?: (project: ProjectFormData) => void;
}

export function CreateProjectDialog({ open, onOpenChange, onProjectCreated }: CreateProjectDialogProps) {
  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      key: '',
      description: '',
      type: 'scrum',
    },
  });

  const handleNameChange = (value: string) => {
    form.setValue('name', value);
    // Auto-generate key from name
    const key = value
      .toUpperCase()
      .replace(/[^A-Z]/g, '')
      .slice(0, 4);
    if (key.length >= 2) {
      form.setValue('key', key);
    }
  };

  const onSubmit = (data: ProjectFormData) => {
    onProjectCreated?.(data);
    toast.success('Project created successfully!');
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">Create Project</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Project Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="My Awesome Project"
                      {...field}
                      onChange={(e) => handleNameChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Project Key */}
            <FormField
              control={form.control}
              name="key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Key</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="PROJ"
                      className="font-mono uppercase"
                      maxLength={10}
                      {...field}
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                    />
                  </FormControl>
                  <FormDescription>
                    This will be used as a prefix for issue IDs (e.g., PROJ-1)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Project Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="scrum">
                        <span className="flex items-center gap-2">
                          <RotateCcw className="w-4 h-4 text-primary" />
                          <div>
                            <div className="font-medium">Scrum</div>
                            <div className="text-xs text-muted-foreground">Sprint-based workflow</div>
                          </div>
                        </span>
                      </SelectItem>
                      <SelectItem value="kanban">
                        <span className="flex items-center gap-2">
                          <Kanban className="w-4 h-4 text-primary" />
                          <div>
                            <div className="font-medium">Kanban</div>
                            <div className="text-xs text-muted-foreground">Continuous flow</div>
                          </div>
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
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
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="What's this project about?"
                      className="resize-none"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-primary hover:opacity-90">
                Create Project
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
