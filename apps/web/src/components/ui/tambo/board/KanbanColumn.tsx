import { motion } from "framer-motion";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { Plus, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { IssueCard } from "./IssueCard";
import type { Issue, Column } from "@/types";
import { useTamboComponentState, withInteractable } from "@tambo-ai/react";
import { z } from "zod";
import { useEffect } from "react";

interface KanbanColumnProps {
  column: Column;
  columnIndex: number;
  statusColor: string;
  onIssueClick: (issue: Issue) => void;
  onAddIssue?: (columnId: string) => void;
}

export function KanbanColumn({
  column,
  columnIndex,
  statusColor,
  onIssueClick,
  onAddIssue,
}: KanbanColumnProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: columnIndex * 0.1 }}
      className="kanban-column w-80 shrink-0"
    >
      {/* Column Header */}
      <div className="kanban-column-header">
        <div className="flex items-center gap-2">
          <span
            className={cn("w-2 h-2 rounded-full", statusColor.split(" ")[0])}
          />
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
              snapshot.isDraggingOver && "bg-primary/5 ring-2 ring-primary/20",
            )}
          >
            {column.issues.map((issue, index) => (
              <Draggable key={issue.id} draggableId={issue.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <IssueCard
                      issue={issue}
                      isDragging={snapshot.isDragging}
                      onClick={onIssueClick}
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
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 gap-1"
                  onClick={() => onAddIssue?.(column.id)}
                >
                  <Plus className="w-3 h-3" />
                  Add issue
                </Button>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </motion.div>
  );
}

export const InteractableKandanColumn = withInteractable(KanbanColumn, {
  componentName: "KanbanColumn",
  description: "A column in a Kanban board that holds issues.",
  propsSchema: z.object({
    column: z.object({
      id: z.string(),
      title: z.string(),
      issues: z.array(
        z.object({
          id: z.string(),
          title: z.string(),
          description: z.string().optional(),
          status: z.string(),
          assignee: z.string().optional(),
          priority: z.enum(["Low", "Medium", "High"]).optional(),
        }),
      ),
    }),
    columnIndex: z.number(),
    statusColor: z.string(),
  }),
});

export default InteractableKandanColumn;
