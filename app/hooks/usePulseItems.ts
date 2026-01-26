"use client";

import { useMemo, useState } from "react";
import { PulseItem, Priority, Status } from "../types/pulse";
import { calculateScore } from "../lib/scoring";

export function usePulseItems(items: PulseItem[]) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<Status | "all">("all");
  const [priority, setPriority] = useState<Priority | "all">("all");

  const filtered = useMemo(() => {
    return items
      .filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase())
      )
      .filter((item) => (status === "all" ? true : item.status === status))
      .filter((item) =>
        priority === "all" ? true : item.priority === priority
      )
      .sort((a, b) => calculateScore(b) - calculateScore(a));
  }, [items, search, status, priority]);

  return {
    items: filtered,
    search,
    setSearch,
    status,
    setStatus,
    priority,
    setPriority,
    calculateScore,
  };
}
