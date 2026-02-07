import { useCallback } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { Column, Issue, IssueStatus } from "@/types";
import { getColumns } from "@/data/mockData";
import { IssueDetailSheet } from "@/components/ui/tambo/issues/IssueDetailSheet";
import { useTamboComponentState } from "@tambo-ai/react";
import InteractableKandanColumn, { KanbanColumn } from "./KanbanColumn";

const statusColors = {
  todo: "bg-status-todo/20 text-status-todo",
  inprogress: "bg-status-inprogress/20 text-status-inprogress",
  review: "bg-status-review/20 text-status-review",
  done: "bg-status-done/20 text-status-done",
};

export function KanbanBoard() {
  const [columns, setColumns] = useTamboComponentState<Column[]>(
    "kanbanColumns",
    getColumns(),
  );
  const [selectedIssue, setSelectedIssue] =
    useTamboComponentState<Issue | null>("selectedIssue", null);
  const [detailOpen, setDetailOpen] = useTamboComponentState<boolean>(
    "kanbanDetailOpen",
    false,
  );

  const handleDragEnd = useCallback(
    (result: DropResult) => {
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
      const updatedIssue: Issue = {
        ...issue,
        status: destination.droppableId as IssueStatus,
      };

      if (sourceCol === destCol) {
        // Same column reorder
        const newIssues = [...sourceCol.issues];
        newIssues.splice(source.index, 1);
        newIssues.splice(destination.index, 0, updatedIssue);

        setColumns(
          columns.map((col) =>
            col.id === sourceCol.id ? { ...col, issues: newIssues } : col,
          ),
        );
      } else {
        // Move between columns
        const sourceIssues = [...sourceCol.issues];
        sourceIssues.splice(source.index, 1);

        const destIssues = [...destCol.issues];
        destIssues.splice(destination.index, 0, updatedIssue);

        setColumns(
          columns.map((col) => {
            if (col.id === sourceCol.id)
              return { ...col, issues: sourceIssues };
            if (col.id === destCol.id) return { ...col, issues: destIssues };
            return col;
          }),
        );
      }
    },
    [columns],
  );

  const handleIssueClick = (issue: Issue) => {
    setSelectedIssue(issue);
    setDetailOpen(true);
  };

  const handleIssueUpdate = (updatedIssue: Issue) => {
    setColumns(
      columns.map((col) => ({
        ...col,
        issues: col.issues
          .map((issue) => (issue.id === updatedIssue.id ? updatedIssue : issue))
          .filter((issue) => issue.status === col.id),
      })),
    );

    // If status changed, move to new column
    const currentCol = columns.find((col) =>
      col.issues.some((i) => i.id === updatedIssue.id),
    );
    if (currentCol && currentCol.id !== updatedIssue.status) {
      setColumns(
        columns.map((col) => {
          if (col.id === currentCol.id) {
            return {
              ...col,
              issues: col.issues.filter((i) => i.id !== updatedIssue.id),
            };
          }
          if (col.id === updatedIssue.status) {
            return { ...col, issues: [...col.issues, updatedIssue] };
          }
          return col;
        }),
      );
    }

    setSelectedIssue(updatedIssue);
  };

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 p-6 overflow-x-auto min-h-[calc(100vh-64px)]">
          {columns.map((column, index) => (
            <InteractableKandanColumn
              key={column.id}
              column={column}
              columnIndex={index}
              statusColor={statusColors[column.id]}
              onIssueClick={handleIssueClick}
              onAddIssue={(columnId) => {
                console.log("Add issue to column:", columnId);
                // later: open create issue modal / tambo command
              }}
            />
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
