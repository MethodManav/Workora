import { useState } from 'react';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/ui/tambo/layout/AppLayout';
import { TopBar } from '@/components/ui/tambo/layout/TopBar';
import { issues, sprints } from '@/data/mockData';
import { IssueCard } from '@/components/ui/tambo/board/IssueCard';
import { IssueDetailSheet } from '@/components/ui/tambo/issues/IssueDetailSheet';
import { CreateSprintDialog } from '@/components/ui/tambo/sprints/CreateSprintDialog';
import { ChevronRight, Calendar, Target, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Issue } from '@/types';

export function BacklogPage() {
  const [allIssues, setAllIssues] = useState(issues);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [createSprintOpen, setCreateSprintOpen] = useState(false);
  
  const backlogIssues = allIssues.filter(i => !i.sprintId);
  const sprintIssues = allIssues.filter(i => i.sprintId);
  const activeSprint = sprints[0];

  const handleIssueClick = (issue: Issue) => {
    setSelectedIssue(issue);
    setDetailOpen(true);
  };

  const handleIssueUpdate = (updatedIssue: Issue) => {
    setAllIssues(prev => prev.map(issue => 
      issue.id === updatedIssue.id ? updatedIssue : issue
    ));
    setSelectedIssue(updatedIssue);
  };

  return (
    <AppLayout>
      <TopBar 
        title="Backlog" 
        subtitle="Tambo Platform"
        showFilters
      />

      <div className="p-6 space-y-6">
        {/* Active Sprint Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-elevated overflow-hidden"
        >
          <div className="p-4 bg-gradient-warm border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                  <Target className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-heading font-semibold text-foreground">
                      {activeSprint.name}
                    </h2>
                    <Badge className="bg-status-inprogress/20 text-status-inprogress border-0">
                      Active
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {activeSprint.goal}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(activeSprint.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    {' - '}
                    {new Date(activeSprint.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <div className="w-32">
                  <Progress 
                    value={
                      (sprintIssues.filter(i => i.status === 'done').length / sprintIssues.length) * 100
                    } 
                    className="h-2" 
                  />
                </div>
                <span className="text-foreground font-medium">
                  {sprintIssues.filter(i => i.status === 'done').length}/{sprintIssues.length}
                </span>
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>
          </div>
          
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {sprintIssues.map((issue, index) => (
              <motion.div
                key={issue.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <IssueCard issue={issue} onClick={handleIssueClick} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Product Backlog */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-elevated"
        >
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading font-semibold text-foreground">
                  Product Backlog
                </h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {backlogIssues.length} issues not in a sprint
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={() => setCreateSprintOpen(true)}
              >
                <Plus className="w-4 h-4" />
                Create Sprint
              </Button>
            </div>
          </div>
          
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {backlogIssues.length > 0 ? (
              backlogIssues.map((issue, index) => (
                <motion.div
                  key={issue.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <IssueCard issue={issue} onClick={handleIssueClick} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-muted-foreground">
                <p>No issues in the backlog</p>
                <p className="text-sm mt-1">All issues are assigned to sprints</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <IssueDetailSheet
        issue={selectedIssue}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onIssueUpdate={handleIssueUpdate}
      />

      <CreateSprintDialog
        open={createSprintOpen}
        onOpenChange={setCreateSprintOpen}
        sprintNumber={sprints.length + 1}
        onSprintCreated={(data) => {
          console.log('Sprint created:', data);
        }}
      />
    </AppLayout>
  );
}
