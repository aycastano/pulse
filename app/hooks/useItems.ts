import { useState, useEffect, useCallback } from "react";
import { PulseItem, HistoryEntry } from "../domain/types";
import { MOCK_DATA } from "../data/mockPulseItems";

const STORAGE_KEY = "pulse_items";

export function useItems() {
  const [items, setItems] = useState<PulseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1️⃣ Load items (localStorage → fallback MOCK)
  useEffect(() => {
    const shouldError = Math.random() < 0.1;

    setTimeout(() => {
      if (shouldError) {
        setError("Failed to load items. Please try again.");
        setLoading(false);
        return;
      }

      try {
        const stored = localStorage.getItem(STORAGE_KEY);

        if (stored) {
          setItems(JSON.parse(stored));
        } else {
          setItems(MOCK_DATA);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_DATA));
        }
      } catch {
        setError("Corrupted local data. Resetting items.");
        setItems(MOCK_DATA);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_DATA));
      } finally {
        setLoading(false);
      }
    }, 800);
  }, []);

  // 2️⃣ Persist on every change
  useEffect(() => {
    if (!loading && items.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, loading]);

  // 3️⃣ Update item + history
  const updateItem = useCallback(
    (id: string, updates: Partial<PulseItem>) => {
      setItems((prev) =>
        prev.map((item) => {
          if (item.id !== id) return item;

          const field = Object.keys(updates)[0] as keyof PulseItem;
          const newValue = updates[field];

          const historyEntry: HistoryEntry = {
            timestamp: new Date().toISOString(),
            action: "Updated",
            field,
            oldValue: String(item[field]),
            newValue: String(newValue),
          };

          return {
            ...item,
            ...updates,
            history: [...(item.history || []), historyEntry],
          };
        })
      );
    },
    []
  );

  // 4️⃣ Retry load (resets error but keeps storage)
  const retryLoad = useCallback(() => {
    setLoading(true);
    setError(null);

    setTimeout(() => {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (stored) {
        setItems(JSON.parse(stored));
      } else {
        setItems(MOCK_DATA);
      }

      setLoading(false);
    }, 800);
  }, []);

  return { items, loading, error, updateItem, retryLoad };
}
