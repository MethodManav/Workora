import { useState } from 'react';
import { motion } from 'framer-motion';
import { AppSidebar } from './AppSidebar';
import { TamboChatbot } from '@/components/ui/tambo/chatbot/TamboChatbot';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      <motion.main
        initial={false}
        animate={{ marginLeft: sidebarCollapsed ? 64 : 260 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="min-h-screen"
      >
        {children}
      </motion.main>

      <TamboChatbot />
    </div>
  );
}
