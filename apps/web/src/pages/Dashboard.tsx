import { motion } from 'framer-motion';
import { AppLayout } from '@/components/ui/tambo/layout/AppLayout';
import { TopBar } from '@/components/ui/tambo/layout/TopBar';
import { 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3
} from 'lucide-react';
import { issues, projects, sprints, teamMembers } from '@/data/mockData';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';

const stats = [
  {
    label: 'Total Issues',
    value: issues.length,
    change: '+12%',
    trend: 'up',
    icon: BarChart3,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    label: 'Completed',
    value: issues.filter(i => i.status === 'done').length,
    change: '+8%',
    trend: 'up',
    icon: CheckCircle2,
    color: 'text-status-done',
    bgColor: 'bg-status-done/10',
  },
  {
    label: 'In Progress',
    value: issues.filter(i => i.status === 'inprogress').length,
    change: '-3%',
    trend: 'down',
    icon: Clock,
    color: 'text-status-inprogress',
    bgColor: 'bg-status-inprogress/10',
  },
  {
    label: 'Critical',
    value: issues.filter(i => i.priority === 'critical').length,
    change: '0%',
    trend: 'neutral',
    icon: AlertCircle,
    color: 'text-priority-critical',
    bgColor: 'bg-priority-critical/10',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function Dashboard() {
  const activeSprint = sprints[0];
  const sprintProgress = Math.round(
    (issues.filter(i => i.status === 'done' && i.sprintId === activeSprint.id).length /
      issues.filter(i => i.sprintId === activeSprint.id).length) * 100
  );

  return (
    <AppLayout>
      <TopBar 
        title="Dashboard" 
        subtitle={`Welcome back, ${teamMembers[0].name.split(' ')[0]}!`}
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="p-6 space-y-6"
      >
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={item}
              className="card-elevated p-5"
            >
              <div className="flex items-start justify-between">
                <div className={`p-2.5 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium ${
                  stat.trend === 'up' ? 'text-status-done' : 
                  stat.trend === 'down' ? 'text-priority-critical' : 
                  'text-muted-foreground'
                }`}>
                  {stat.change}
                  {stat.trend === 'up' && <ArrowUpRight className="w-3 h-3" />}
                  {stat.trend === 'down' && <ArrowDownRight className="w-3 h-3" />}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-heading font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sprint Progress */}
          <motion.div variants={item} className="lg:col-span-2 card-elevated p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-heading font-semibold text-foreground text-lg">
                  Current Sprint
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {activeSprint.name} · {activeSprint.goal}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-heading font-bold text-foreground">
                  {sprintProgress}%
                </p>
                <p className="text-xs text-muted-foreground">Complete</p>
              </div>
            </div>

            <Progress value={sprintProgress} className="h-3 mb-6" />

            <div className="grid grid-cols-4 gap-4">
              {['todo', 'inprogress', 'review', 'done'].map((status) => {
                const count = issues.filter(
                  i => i.status === status && i.sprintId === activeSprint.id
                ).length;
                const labels: Record<string, string> = {
                  todo: 'To Do',
                  inprogress: 'In Progress',
                  review: 'Review',
                  done: 'Done',
                };
                return (
                  <div key={status} className="text-center p-3 rounded-xl bg-muted/50">
                    <p className="text-2xl font-heading font-bold text-foreground">
                      {count}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {labels[status]}
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Team Activity */}
          <motion.div variants={item} className="card-elevated p-6">
            <h2 className="font-heading font-semibold text-foreground text-lg mb-4">
              Team Activity
            </h2>
            <div className="space-y-4">
              {teamMembers.slice(0, 4).map((member) => {
                const memberIssues = issues.filter(
                  i => i.assignee?.id === member.id
                );
                const completed = memberIssues.filter(
                  i => i.status === 'done'
                ).length;
                const total = memberIssues.length;
                const progress = total > 0 ? (completed / total) * 100 : 0;

                return (
                  <div key={member.id} className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 border-2 border-background shadow-sm">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{member.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {member.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress 
                          value={progress} 
                          className="h-1.5 flex-1" 
                        />
                        <span className="text-xs text-muted-foreground shrink-0">
                          {completed}/{total}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Recent Issues */}
        <motion.div variants={item} className="card-elevated p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-semibold text-foreground text-lg">
              Recent Issues
            </h2>
            <button className="text-sm text-primary hover:underline">
              View all
            </button>
          </div>
          <div className="space-y-3">
            {issues.slice(0, 5).map((issue) => (
              <div
                key={issue.id}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className={`px-2 py-0.5 rounded text-xs font-mono issue-${issue.type}`}>
                  {issue.key}
                </div>
                <p className="flex-1 text-sm text-foreground truncate">
                  {issue.title}
                </p>
                <span className={`status-badge status-${issue.status}`}>
                  {issue.status === 'inprogress' ? 'In Progress' : 
                   issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
                </span>
                {issue.assignee && (
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={issue.assignee.avatar} />
                    <AvatarFallback>{issue.assignee.name[0]}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}
