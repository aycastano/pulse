import React, { useState,  useEffect, useCallback } from "react";
import { PulseItem, HistoryEntry } from "../domain/types";
import { MOCK_DATA } from "../data/mockPulseItems";

export function useItems() {
  const [items, setItems] = useState<PulseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {  
    const shouldError = Math.random() < 0.1;
    setTimeout(() => {
      if (shouldError) {
        setError("Failed to load items. Please try again.");
        setLoading(false);
      } else {
        setItems(MOCK_DATA);
        setLoading(false);
      }
    }, 800);
  }, []);

  const updateItem = useCallback((id: string, updates: Partial<PulseItem>) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        const historyEntry: HistoryEntry = {
          timestamp: new Date().toISOString(),
          action: "Updated",
          field: Object.keys(updates)[0],
          oldValue: String(item[Object.keys(updates)[0] as keyof PulseItem]),
          newValue: String(Object.values(updates)[0]),
        };

        return {
          ...item,
          ...updates,
          history: [...(item.history || []), historyEntry],
        };
      }),
    );
  }, []);

  const retryLoad = useCallback(() => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setItems(MOCK_DATA);
      setLoading(false);
    }, 800);
  }, []);

  return { items, loading, error, updateItem, retryLoad };
}
