import { UpdateIssueStatus } from "@/lib/Issue";
import { IssueStatus } from "@/types";
import { TamboTool } from "@tambo-ai/react";
import z from "zod";
export const UpdateIssueStatusTool: TamboTool = {
  name: "updateIssueStatus",
  description:
    "A tool to update the status of an issue and make it reflect on the Kanban board.(Re renders the board with the updated status)",
  tool: async (input: { key: string; status: IssueStatus }) => {
    const { key, status } = input;
    try {
      const result = UpdateIssueStatus(key, status);
      return result;
    } catch (error) {
      return `Error: ${error instanceof Error ? error.message : "Unknown error"}`;
    }
  },
  inputSchema: z
    .object({
      key: z.string(),
      status: z.enum(["todo", "inprogress", "review", "done"]),
    })
    .describe("The input for updating an issue status"),
  outputSchema: z
    .string()
    .describe("A message confirming the issue status update"),
};

export const tools = [UpdateIssueStatusTool];
