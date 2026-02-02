import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderKanban, 
  ListTodo, 
  BarChart3, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Layers,
  LogOut
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { projects, workspace } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CreateProjectDialog } from '@/components/ui/tambo/projects/CreateProjectDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AppSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: FolderKanban, label: 'Board', path: '/board' },
  { icon: ListTodo, label: 'Backlog', path: '/backlog' },
  { icon: Layers, label: 'Sprints', path: '/sprints' },
  { icon: BarChart3, label: 'Reports', path: '/reports' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function AppSidebar({ isCollapsed, onToggle }: AppSidebarProps) {
  const [activeProject, setActiveProject] = useState(projects[0]);
  const [createProjectOpen, setCreateProjectOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 64 : 260 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="fixed left-0 top-0 h-screen bg-gradient-sidebar flex flex-col z-40 border-r border-sidebar-border"
      >
        {/* Logo & Workspace */}
        <div className="p-4 flex items-center justify-between">
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                  <span className="text-sidebar-primary-foreground font-heading font-bold text-sm">T</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-heading font-semibold text-sidebar-foreground text-sm">
                    {workspace.name}
                  </span>
                  <span className="text-xs text-sidebar-foreground/60">Pro Plan</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {isCollapsed && (
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center mx-auto">
              <span className="text-sidebar-primary-foreground font-heading font-bold text-sm">T</span>
            </div>
          )}

          {!isCollapsed && (
            <button
              onClick={onToggle}
              className="p-1.5 rounded-md hover:bg-sidebar-accent text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Search */}
        {!isCollapsed && (
          <div className="px-3 mb-2">
            <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-sidebar-accent/50 text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors text-sm">
              <Search className="w-4 h-4" />
              <span>Search...</span>
              <kbd className="ml-auto text-xs bg-sidebar-accent px-1.5 py-0.5 rounded">⌘K</kbd>
            </button>
          </div>
        )}

        {/* Project Selector */}
        <div className="px-3 mb-4">
          <motion.div
            layout
            className={cn(
              "flex items-center gap-2 p-2 rounded-lg bg-sidebar-accent/50 cursor-pointer hover:bg-sidebar-accent transition-colors",
              isCollapsed && "justify-center p-2"
            )}
          >
            <div className="w-6 h-6 rounded bg-issue-task/20 flex items-center justify-center shrink-0">
              <span className="text-xs font-mono font-medium text-sidebar-foreground">
                {activeProject.key[0]}
              </span>
            </div>
            {!isCollapsed && (
              <>
                <span className="text-sm font-medium text-sidebar-foreground truncate">
                  {activeProject.name}
                </span>
                <button 
                  onClick={() => setCreateProjectOpen(true)}
                  className="ml-auto p-1 rounded hover:bg-sidebar-border transition-colors"
                >
                  <Plus className="w-4 h-4 text-sidebar-foreground/60" />
                </button>
              </>
            )}
          </motion.div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-all duration-200",
                isCollapsed && "justify-center px-2"
              )}
              activeClassName="bg-sidebar-accent text-sidebar-foreground"
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <AnimatePresence mode="wait">
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm font-medium whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          ))}
        </nav>

        {/* Collapse Toggle (when collapsed) */}
        {isCollapsed && (
          <div className="px-3 mb-2">
            <button
              onClick={onToggle}
              className="w-full p-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors flex justify-center"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* User Profile */}
        <div className="p-3 border-t border-sidebar-border">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.div
                layout
                className={cn(
                  "flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-accent cursor-pointer transition-colors",
                  isCollapsed && "justify-center"
                )}
              >
                <Avatar className="w-8 h-8 shrink-0">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" />
                  <AvatarFallback>AC</AvatarFallback>
                </Avatar>
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-sidebar-foreground truncate">Alex Chen</p>
                    <p className="text-xs text-sidebar-foreground/60 truncate">alex@tambo.dev</p>
                  </div>
                )}
              </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/login')} className="text-destructive">
                <LogOut className="w-4 h-4 mr-2" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.aside>

      <CreateProjectDialog
        open={createProjectOpen}
        onOpenChange={setCreateProjectOpen}
        onProjectCreated={(data) => {
          console.log('Project created:', data);
        }}
      />
    </>
  );
}
