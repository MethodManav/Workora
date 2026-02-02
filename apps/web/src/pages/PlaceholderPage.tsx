import { motion } from 'framer-motion';
import { AppLayout } from '@/components/ui/tambo/layout/AppLayout';
import { TopBar } from '@/components/ui/tambo/layout/TopBar';
import { Construction } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  subtitle?: string;
}

export function PlaceholderPage({ title, subtitle }: PlaceholderPageProps) {
  return (
    <AppLayout>
      <TopBar title={title} subtitle={subtitle} />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6"
      >
        <div className="w-20 h-20 rounded-2xl bg-gradient-warm flex items-center justify-center mb-6">
          <Construction className="w-10 h-10 text-primary" />
        </div>
        <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
          Coming Soon
        </h2>
        <p className="text-muted-foreground max-w-md">
          We're working hard to bring you this feature. Check back soon or try the Board 
          to see our Kanban view in action!
        </p>
      </motion.div>
    </AppLayout>
  );
}
