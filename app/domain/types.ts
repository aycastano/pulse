export type Status = "new" | "triaged" | "in_progress" | "done";
export type Priority = "low" | "medium" | "high" | "critical";

export interface PulseItem {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  impact: 1 | 2 | 3 | 4 | 5;
  effort: 1 | 2 | 3 | 4 | 5;
  owner?: string;
  tags: string[];
  createdAt: string;
  history?: HistoryEntry[];
}

export interface HistoryEntry {
  timestamp: string;
  action: string;
  field: string;
  oldValue: string;
  newValue: string;
}

export interface FilterState {
  search: string;
  status: Status | "all";
  priority: Priority | "all";
  tags: string[];
  sortBy: "score" | "impact" | "createdAt";
  page: number;
  pageSize: number;
}