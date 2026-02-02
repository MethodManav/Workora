import { AppLayout } from '@/components/ui/tambo/layout/AppLayout';
import { TopBar } from '@/components/ui/tambo/layout/TopBar';
import { KanbanBoard } from '@/components/ui/tambo/board/KanbanBoard';

export function BoardPage() {
  return (
    <AppLayout>
      <TopBar 
        title="Board" 
        subtitle="Tambo Platform · Sprint 24"
        showFilters
      />
      <KanbanBoard />
    </AppLayout>
  );
}
