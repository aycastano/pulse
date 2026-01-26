"use client";

import { Filter, Search, ArrowUpDown } from "lucide-react";
import { Priority, Status } from "../../domain/models/pulse-item";

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;

  statusFilter: Status | "all";
  setStatusFilter: (value: Status | "all") => void;

  priorityFilter: Priority | "all";
  setPriorityFilter: (value: Priority | "all") => void;

  sortBy: "score" | "impact" | "date";
  setSortBy: (value: "score" | "impact" | "date") => void;
}

export function FilterBar({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  sortBy,
  setSortBy,
}: FilterBarProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="search"
          placeholder="Buscar items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Status */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as Status | "all")}
            className="px-3 py-1.5 border rounded-lg text-sm"
          >
            <option value="all">Todos los estados</option>
            <option value="new">Nuevo</option>
            <option value="in-progress">En progreso</option>
            <option value="blocked">Bloqueado</option>
            <option value="done">Completado</option>
          </select>
        </div>

        {/* Priority */}
        <select
          value={priorityFilter}
          onChange={(e) =>
            setPriorityFilter(e.target.value as Priority | "all")
          }
          className="px-3 py-1.5 border rounded-lg text-sm"
        >
          <option value="all">Todas las prioridades</option>
          <option value="critical">Crítica</option>
          <option value="high">Alta</option>
          <option value="medium">Media</option>
          <option value="low">Baja</option>
        </select>

        {/* Sort */}
        <div className="flex items-center gap-2 ml-auto">
          <ArrowUpDown className="w-4 h-4 text-gray-500" />
          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "score" | "impact" | "date")
            }
            className="px-3 py-1.5 border rounded-lg text-sm"
          >
            <option value="score">Score (inteligente)</option>
            <option value="impact">Mayor impacto</option>
            <option value="date">Más reciente</option>
          </select>
        </div>
      </div>
    </div>
  );
}
