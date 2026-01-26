"use client";

import { useMemo, useState } from "react";
import { PulseItem, Priority, Status } from "../domain/models/pulse-item";
import { calculateScore } from "../domain/services/scoring.service";

export function usePulseItems(items: PulseItem[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all");
  const [sortBy, setSortBy] = useState<"score" | "impact" | "date">("score");

  const filteredItems = useMemo(() => {
    let result = [...items];

    if (searchQuery) {
      result = result.filter((i) =>
        i.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((i) => i.status === statusFilter);
    }

    if (priorityFilter !== "all") {
      result = result.filter((i) => i.priority === priorityFilter);
    }

    result.sort((a, b) => {
      if (sortBy === "impact") return b.impact - a.impact;
      if (sortBy === "date")
        return b.createdAt.getTime() - a.createdAt.getTime();
      return calculateScore(b) - calculateScore(a);
    });

    return result;
  }, [items, searchQuery, statusFilter, priorityFilter, sortBy]);

  return {
    items: filteredItems,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    sortBy,
    setSortBy,
    calculateScore,
  };
}
