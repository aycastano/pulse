import React, { useMemo } from "react";
import { PulseItem, Status } from "../../domain/types";
import { STATUS_CONFIG } from "../../domain/constants";
import { BarChart3 } from "lucide-react";

export function SimpleBarChart({ items }: { items: PulseItem[] }) {
  const statusCounts = useMemo(() => {
    const counts = { new: 0, triaged: 0, in_progress: 0, done: 0 };
    items.forEach((item) => counts[item.status]++);
    const max = Math.max(...Object.values(counts));
    return Object.entries(counts).map(([status, count]) => ({
      status: status as Status,
      count,
      percentage: max > 0 ? (count / max) * 100 : 0,
    }));
  }, [items]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        <h3 className="font-semibold text-gray-900 dark:text-white">
          Items by Status
        </h3>
      </div>

      <div className="space-y-4">
        {statusCounts.map(({ status, count, percentage }) => (
          <div key={status}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {STATUS_CONFIG[status].label}
              </span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {count}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full ${STATUS_CONFIG[status].color} transition-all duration-500`}
                style={{ width: `${percentage}%` }}
                role="progressbar"
                aria-valuenow={count}
                aria-valuemin={0}
                aria-valuemax={Math.max(...statusCounts.map((s) => s.count))}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
