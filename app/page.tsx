"use client";

import React, { useState, useMemo } from "react";
import { PulseItem } from "./domain/types";
import { useTheme } from "./hooks/useTheme";
import { useItems } from "./hooks/useItems";
import { useFilters } from "./hooks/useFilters";
import { calculateScore } from "./domain/score";
import { PRIORITY_CONFIG } from "./domain/constants";
import { ThemeToggle } from "./components/common/ThemeToggle";
import { KPICard } from "./components/common/KPICard";
import { SimpleBarChart } from "./components/charts/SimpleBarChart";
import { FilterBar } from "./components/filters/FilterBar";
import { ItemCard } from "./components/items/ItemCard";
import { ItemDetail } from "./components/items/ItemDetail";
import { Pagination } from "./components/pagination/Pagination";
import { LoadingState } from "./components/common/LoadingState";
import { ErrorState } from "./components/common/ErrorState";
import { EmptyState } from "./components/common/EmptyState";
import {
  CheckCircle2,
  Clock,
  TrendingUp,
  Search,
  Activity,
  AlertTriangle,
} from "lucide-react";

export default function PulseDashboard() {
  const { theme, toggleTheme } = useTheme();
  const { items, loading, error, updateItem, retryLoad } = useItems();
  const { filters, updateFilters } = useFilters();
  const [selectedItem, setSelectedItem] = useState<PulseItem | null>(null);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    items.forEach((item) => item.tags.forEach((tag) => tags.add(tag)));
    return Array.from(tags).sort();
  }, [items]);

  const filteredItems = useMemo(() => {
    let result = [...items];

    if (filters.search) {
      const query = filters.search.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query),
      );
    }

    if (filters.status !== "all") {
      result = result.filter((item) => item.status === filters.status);
    }

    if (filters.priority !== "all") {
      result = result.filter((item) => item.priority === filters.priority);
    }

    if (filters.tags.length > 0) {
      result = result.filter((item) =>
        filters.tags.some((tag) => item.tags.includes(tag)),
      );
    }

    result.sort((a, b) => {
      switch (filters.sortBy) {
        case "score":
          return calculateScore(b) - calculateScore(a);
        case "impact":
          return b.impact - a.impact;
        case "createdAt":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        default:
          return 0;
      }
    });

    return result;
  }, [items, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / filters.pageSize);
  const paginatedItems = useMemo(() => {
    const start = (filters.page - 1) * filters.pageSize;
    const end = start + filters.pageSize;
    return filteredItems.slice(start, end);
  }, [filteredItems, filters.page, filters.pageSize]);

  const kpis = useMemo(() => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    return {
      total: items.length,
      critical: items.filter((i) => i.priority === "critical").length,
      inProgress: items.filter((i) => i.status === "in_progress").length,
      doneThisWeek: items.filter(
        (i) => i.status === "done" && new Date(i.createdAt) > weekAgo,
      ).length,
    };
  }, [items]);

  const topPriorities = useMemo(
    () =>
      [...items]
        .sort((a, b) => calculateScore(b) - calculateScore(a))
        .slice(0, 5),
    [items],
  );

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={retryLoad} />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        .dark {
          color-scheme: dark;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Activity className="w-7 h-7 text-white" aria-hidden="true" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Pulse
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Intelligent Prioritization Dashboard • {items.length} Total items
            </p>
          </div>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </header>

        {/* KPIs */}
        <section
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
          aria-label="Métricas clave"
        >
          <KPICard
            label="Total Items"
            value={kpis.total}
            icon={Activity}
            color="bg-blue-600"
          />
          <KPICard
            label="Critical"
            value={kpis.critical}
            icon={AlertTriangle}
            color="bg-red-600"
          />
          <KPICard
            label="In Progress"
            value={kpis.inProgress}
            icon={Clock}
            color="bg-yellow-600"
          />
          <KPICard
            label="Completed"
            value={kpis.doneThisWeek}
            icon={CheckCircle2}
            color="bg-green-600"
            trend={kpis.doneThisWeek > 0 ? `+${kpis.doneThisWeek}` : undefined}
          />
        </section>

        {/* Chart + Top Priorities */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <SimpleBarChart items={items} />

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Top 5 Priorities
              </h3>
            </div>
            <div className="space-y-3">
              {topPriorities.map((item, i) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 dark:text-white truncate group-hover:text-purple-600 dark:group-hover:text-purple-400">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Score: {calculateScore(item)} •{" "}
                        {PRIORITY_CONFIG[item.priority].label}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Filters */}
        <section className="mb-6" aria-label="Filtros y búsqueda">
          <FilterBar
            filters={filters}
            onUpdate={updateFilters}
            allTags={allTags}
          />
        </section>

        {/* Items List */}
        <section aria-label="Lista de items">
          {filteredItems.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <div className="space-y-3 mb-6">
                {paginatedItems.map((item, i) => (
                  <div key={item.id} className="relative">
                    {i === 0 && filters.page === 1 && (
                      <div
                        className="absolute -left-3 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-600 to-blue-600 rounded-full"
                        aria-hidden="true"
                      />
                    )}
                    <ItemCard
                      item={item}
                      onClick={() => setSelectedItem(item)}
                    />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={filters.page}
                totalPages={totalPages}
                totalItems={filteredItems.length}
                pageSize={filters.pageSize}
                onPageChange={(page) => updateFilters({ page })}
                onPageSizeChange={(pageSize) =>
                  updateFilters({ pageSize, page: 1 })
                }
              />
            </>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
          <p className="mb-2">
            💡 <strong>Metodología del Score:</strong> (Impacto × 2) + Peso de
            Prioridad - Esfuerzo
          </p>
          <p>
            Construido con React + TypeScript • Persistencia en URL •
            Accesibilidad WCAG 2.1
          </p>
        </footer>
      </div>

      {/* Item Detail Modal */}
      {selectedItem && (
        <ItemDetail
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onUpdate={updateItem}
        />
      )}
    </div>
  );
}
