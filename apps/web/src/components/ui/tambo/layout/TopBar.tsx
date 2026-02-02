import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, Plus, Filter, ChevronDown, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { teamMembers } from '@/data/mockData';
import { useTheme } from '@/components/ui/tambo/theme/ThemeProvider';
import { CreateIssueDialog } from '@/components/ui/tambo/issues/CreateIssueDialog';

interface TopBarProps {
  title: string;
  subtitle?: string;
  showFilters?: boolean;
}

export function TopBar({ title, subtitle, showFilters = false }: TopBarProps) {
  const [notificationCount] = useState(3);
  const [createIssueOpen, setCreateIssueOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <header className="h-16 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="h-full px-6 flex items-center justify-between gap-4">
          {/* Left: Title & Breadcrumb */}
          <div className="flex items-center gap-4">
            <div>
              <h1 className="font-heading text-lg font-semibold text-foreground">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm text-muted-foreground">{subtitle}</p>
              )}
            </div>
          </div>

          {/* Center: Search */}
          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search issues, projects..."
                className="pl-9 pr-4 bg-muted/50 border-transparent focus:border-primary/20 focus:bg-background transition-all"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-xs bg-background border px-1.5 py-0.5 rounded text-muted-foreground">
                ⌘K
              </kbd>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            {showFilters && (
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="w-4 h-4" />
                Filter
                <ChevronDown className="w-3 h-3" />
              </Button>
            )}

            <Button 
              size="sm" 
              className="gap-2 bg-gradient-primary hover:opacity-90 transition-opacity"
              onClick={() => setCreateIssueOpen(true)}
            >
              <Plus className="w-4 h-4" />
              New Issue
            </Button>

            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              className="relative p-2 rounded-lg hover:bg-muted transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {theme === 'light' ? (
                  <motion.div
                    key="sun"
                    initial={{ opacity: 0, rotate: -90, scale: 0 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 90, scale: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className="w-5 h-5 text-muted-foreground" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ opacity: 0, rotate: 90, scale: 0 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: -90, scale: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className="w-5 h-5 text-muted-foreground" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              {notificationCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-medium rounded-full flex items-center justify-center"
                >
                  {notificationCount}
                </motion.span>
              )}
            </button>

            {/* Team Avatars */}
            <div className="flex items-center -space-x-2 ml-2">
              {teamMembers.slice(0, 3).map((member, index) => (
                <Avatar 
                  key={member.id} 
                  className="w-8 h-8 border-2 border-background hover:z-10 transition-transform hover:scale-110 cursor-pointer"
                >
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback>{member.name[0]}</AvatarFallback>
                </Avatar>
              ))}
              {teamMembers.length > 3 && (
                <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium text-muted-foreground cursor-pointer hover:bg-muted/80 transition-colors">
                  +{teamMembers.length - 3}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <CreateIssueDialog 
        open={createIssueOpen} 
        onOpenChange={setCreateIssueOpen}
        onIssueCreated={(data) => {
          console.log('Issue created:', data);
        }}
      />
    </>
  );
}
