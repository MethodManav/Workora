import { issues } from "@/data/mockData";
import { IssueStatus } from "@/types";

export function UpdateIssueStatus(key: string, status: IssueStatus) {
  const getIssueById = issues.find((issue) => issue.key == key);
  if (!getIssueById) {
    throw new Error(`Issue with ID ${key} not found`);
  }
  getIssueById.status = status;
  return `Issue ${key} status updated to ${status}`;
}
