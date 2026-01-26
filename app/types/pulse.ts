export type Priority = "critical" | "high" | "medium" | "low";
export type Status = "new" | "in-progress" | "blocked" | "done";
export type ItemType = "bug" | "feature" | "improvement";

export interface PulseItem {
  id: string;
  title: string;
  description: string;
  type: ItemType;
  priority: Priority;
  status: Status;
  impact: number;
  effort: number;
  createdAt: string;
  submitter: string;
  tags: string[];
}
