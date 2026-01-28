import React from "react";
import { FilterState, Status, Priority } from "../../domain/types";
import { STATUS_CONFIG, PRIORITY_CONFIG } from "../../domain/constants";
import { Search, Filter, ArrowUpDown } from "lucide-react";

export function FilterBar({
  filters,
  onUpdate,
  allTags,
}: {
  filters: FilterState;
  onUpdate: (updates: Partial<FilterState>) => void;
  allTags: string[];
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 space-y-3">
      {/* Search */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          aria-hidden="true"
        />
        <input
          type="search"
          placeholder="Buscar por título o descripción..."
          value={filters.search}
          onChange={(e) => onUpdate({ search: e.target.value })}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
          aria-label="Buscar items"
        />
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Filter
            className="w-4 h-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
          />
          <select
            value={filters.status}
            onChange={(e) =>
              onUpdate({ status: e.target.value as Status | "all" })
            }
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 transition-colors"
            aria-label="Filtrar por estado"
          >
            <option value="all">All states</option>
            {Object.entries(STATUS_CONFIG).map(([key, config]) => (
              <option key={key} value={key}>
                {config.label}
              </option>
            ))}
          </select>
        </div>

        <select
          value={filters.priority}
          onChange={(e) =>
            onUpdate({ priority: e.target.value as Priority | "all" })
          }
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 transition-colors"
          aria-label="Filtrar por prioridad"
        >
          <option value="all">All priorities</option>
          {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
            <option key={key} value={key}>
              {config.label}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2 ml-auto">
          <ArrowUpDown
            className="w-4 h-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
          />
          <select
            value={filters.sortBy}
            onChange={(e) =>
              onUpdate({ sortBy: e.target.value as FilterState["sortBy"] })
            }
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 transition-colors"
            aria-label="Ordenar por"
          >
            <option value="score">Score (Smart priority)</option>
            <option value="impact">Greater impact</option>
            <option value="createdAt">Latest</option>
          </select>
        </div>
      </div>

      {/* Tags Filter */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {allTags.slice(0, 10).map((tag) => (
            <button
              key={tag}
              onClick={() => {
                const newTags = filters.tags.includes(tag)
                  ? filters.tags.filter((t) => t !== tag)
                  : [...filters.tags, tag];
                onUpdate({ tags: newTags });
              }}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                filters.tags.includes(tag)
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
