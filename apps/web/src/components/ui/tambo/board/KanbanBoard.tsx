import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Column, Issue, IssueStatus } from '@/types';
import { getColumns } from '@/data/mockData';
import { IssueCard } from './IssueCard';
import { IssueDetailSheet } from '@/components/ui/tambo/issues/IssueDetailSheet';
import { Plus, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const statusColors = {
  todo: 'bg-status-todo/20 text-status-todo',
  inprogress: 'bg-status-inprogress/20 text-status-inprogress',
  review: 'bg-status-review/20 text-status-review',
  done: 'bg-status-done/20 text-status-done',
};

export function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>(getColumns());
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const handleDragEnd = useCallback((result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceCol = columns.find((col) => col.id === source.droppableId);
    const destCol = columns.find((col) => col.id === destination.droppableId);

    if (!sourceCol || !destCol) return;

    // Find the issue being dragged
    const issue = sourceCol.issues.find((i) => i.id === draggableId);
    if (!issue) return;

    // Update issue status
    const updatedIssue: Issue = { ...issue, status: destination.droppableId as IssueStatus };

    if (sourceCol === destCol) {
      // Same column reorder
      const newIssues = [...sourceCol.issues];
      newIssues.splice(source.index, 1);
      newIssues.splice(destination.index, 0, updatedIssue);

      setColumns(
        columns.map((col) =>
          col.id === sourceCol.id ? { ...col, issues: newIssues } : col
        )
      );
    } else {
      // Move between columns
      const sourceIssues = [...sourceCol.issues];
      sourceIssues.splice(source.index, 1);

      const destIssues = [...destCol.issues];
      destIssues.splice(destination.index, 0, updatedIssue);

      setColumns(
        columns.map((col) => {
          if (col.id === sourceCol.id) return { ...col, issues: sourceIssues };
          if (col.id === destCol.id) return { ...col, issues: destIssues };
          return col;
        })
      );
    }
  }, [columns]);

  const handleIssueClick = (issue: Issue) => {
    setSelectedIssue(issue);
    setDetailOpen(true);
  };

  const handleIssueUpdate = (updatedIssue: Issue) => {
    setColumns(columns.map(col => ({
      ...col,
      issues: col.issues.map(issue => 
        issue.id === updatedIssue.id ? updatedIssue : issue
      ).filter(issue => issue.status === col.id)
    })));
    
    // If status changed, move to new column
    const currentCol = columns.find(col => col.issues.some(i => i.id === updatedIssue.id));
    if (currentCol && currentCol.id !== updatedIssue.status) {
      setColumns(prev => prev.map(col => {
        if (col.id === currentCol.id) {
          return { ...col, issues: col.issues.filter(i => i.id !== updatedIssue.id) };
        }
        if (col.id === updatedIssue.status) {
          return { ...col, issues: [...col.issues, updatedIssue] };
        }
        return col;
      }));
    }
    
    setSelectedIssue(updatedIssue);
  };

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 p-6 overflow-x-auto min-h-[calc(100vh-64px)]">
          {columns.map((column, columnIndex) => (
            <motion.div
              key={column.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: columnIndex * 0.1 }}
              className="kanban-column w-80 shrink-0"
            >
              {/* Column Header */}
              <div className="kanban-column-header">
                <div className="flex items-center gap-2">
                  <span className={cn("w-2 h-2 rounded-full", statusColors[column.id].split(' ')[0])} />
                  <h3 className="font-heading font-medium text-foreground text-sm">
                    {column.title}
                  </h3>
                  <span className="text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5">
                    {column.issues.length}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-1 rounded hover:bg-muted transition-colors">
                    <Plus className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button className="p-1 rounded hover:bg-muted transition-colors">
                    <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>

              {/* Droppable Area */}
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn(
                      "space-y-3 min-h-[200px] rounded-lg transition-colors p-1",
                      snapshot.isDraggingOver && "bg-primary/5 ring-2 ring-primary/20"
                    )}
                  >
                    {column.issues.map((issue, index) => (
                      <Draggable
                        key={issue.id}
                        draggableId={issue.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <IssueCard
                              issue={issue}
                              isDragging={snapshot.isDragging}
                              onClick={handleIssueClick}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    
                    {/* Empty State */}
                    {column.issues.length === 0 && !snapshot.isDraggingOver && (
                      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                        <p className="text-sm">No issues</p>
                        <Button variant="ghost" size="sm" className="mt-2 gap-1">
                          <Plus className="w-3 h-3" />
                          Add issue
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </motion.div>
          ))}
        </div>
      </DragDropContext>

      <IssueDetailSheet
        issue={selectedIssue}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onIssueUpdate={handleIssueUpdate}
      />
    </>
  );
}
