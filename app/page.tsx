"use client";
import React, { useState, useMemo } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  TrendingUp,
  Filter,
  Search,
  ArrowUpDown,
} from "lucide-react";

// ============================================================================
// TYPES & CONSTANTS (Domain Model)
// ============================================================================

type Priority = "critical" | "high" | "medium" | "low";
type Status = "new" | "in-progress" | "blocked" | "done";
type ItemType = "bug" | "feature" | "improvement";

interface PulseItem {
  id: string;
  title: string;
  type: ItemType;
  priority: Priority;
  status: Status;
  impact: number; // 1-10
  effort: number; // 1-10 (story points)
  createdAt: Date;
  submitter: string;
}

const PRIORITY_CONFIG = {
  critical: {
    label: "Crítico",
    color: "bg-red-100 text-red-800 border-red-300",
    icon: AlertCircle,
  },
  high: {
    label: "Alto",
    color: "bg-orange-100 text-orange-800 border-orange-300",
    icon: TrendingUp,
  },
  medium: {
    label: "Medio",
    color: "bg-yellow-100 text-yellow-800 border-yellow-300",
    icon: Clock,
  },
  low: {
    label: "Bajo",
    color: "bg-gray-100 text-gray-800 border-gray-300",
    icon: CheckCircle2,
  },
} as const;

const STATUS_CONFIG = {
  new: { label: "Nuevo", color: "bg-blue-500", textColor: "text-blue-700" },
  "in-progress": {
    label: "En Progreso",
    color: "bg-purple-500",
    textColor: "text-purple-700",
  },
  blocked: {
    label: "Bloqueado",
    color: "bg-red-500",
    textColor: "text-red-700",
  },
  done: {
    label: "Completado",
    color: "bg-green-500",
    textColor: "text-green-700",
  },
} as const;

const TYPE_CONFIG = {
  bug: { label: "Bug", emoji: "🐛" },
  feature: { label: "Feature", emoji: "✨" },
  improvement: { label: "Mejora", emoji: "🔧" },
} as const;

// ============================================================================
// MOCK DATA (Simulación realista)
// ============================================================================

const MOCK_ITEMS: PulseItem[] = [
  {
    id: "1",
    title: "Login falla con usuarios de Google OAuth",
    type: "bug",
    priority: "critical",
    status: "new",
    impact: 10,
    effort: 3,
    createdAt: new Date("2025-01-25"),
    submitter: "María García",
  },
  {
    id: "2",
    title: "Agregar dark mode al dashboard",
    type: "feature",
    priority: "low",
    status: "new",
    impact: 4,
    effort: 8,
    createdAt: new Date("2025-01-20"),
    submitter: "Carlos Ruiz",
  },
  {
    id: "3",
    title: "Optimizar queries de búsqueda (timeout en prod)",
    type: "improvement",
    priority: "high",
    status: "in-progress",
    impact: 8,
    effort: 5,
    createdAt: new Date("2025-01-24"),
    submitter: "Ana López",
  },
  {
    id: "4",
    title: "Export a CSV roto en reportes",
    type: "bug",
    priority: "medium",
    status: "blocked",
    impact: 6,
    effort: 2,
    createdAt: new Date("2025-01-23"),
    submitter: "Pedro Sánchez",
  },
  {
    id: "5",
    title: "Integración con Slack para notificaciones",
    type: "feature",
    priority: "medium",
    status: "new",
    impact: 7,
    effort: 6,
    createdAt: new Date("2025-01-22"),
    submitter: "Laura Martín",
  },
  {
    id: "6",
    title: "Refactor del sistema de permisos",
    type: "improvement",
    priority: "high",
    status: "in-progress",
    impact: 9,
    effort: 10,
    createdAt: new Date("2025-01-21"),
    submitter: "Diego Torres",
  },
];

// ============================================================================
// BUSINESS LOGIC (Custom Hooks)
// ============================================================================

function usePulseItems(items: PulseItem[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all");
  const [sortBy, setSortBy] = useState<"priority" | "impact" | "date">(
    "priority",
  );

  // Scoring algorithm: Decisión de producto clave
  const calculateScore = (item: PulseItem): number => {
    const priorityWeight = { critical: 100, high: 50, medium: 25, low: 10 };
    const effortPenalty = item.effort / 10; // Más esfuerzo = menos score
    const impactBonus = item.impact * 5;

    return (priorityWeight[item.priority] + impactBonus) / (1 + effortPenalty);
  };

  const filteredAndSorted = useMemo(() => {
    let result = [...items];

    // Filters
    if (searchQuery) {
      result = result.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((item) => item.status === statusFilter);
    }

    if (priorityFilter !== "all") {
      result = result.filter((item) => item.priority === priorityFilter);
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "priority":
          return calculateScore(b) - calculateScore(a);
        case "impact":
          return b.impact - a.impact;
        case "date":
          return b.createdAt.getTime() - a.createdAt.getTime();
        default:
          return 0;
      }
    });

    return result;
  }, [items, searchQuery, statusFilter, priorityFilter, sortBy]);

  return {
    items: filteredAndSorted,
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

// ============================================================================
// UI COMPONENTS (Presentational)
// ============================================================================

interface ItemCardProps {
  item: PulseItem;
  score: number;
}

function ItemCard({ item, score }: ItemCardProps) {
  const PriorityIcon = PRIORITY_CONFIG[item.priority].icon;
  const efficiency = (item.impact / item.effort).toFixed(1);

  return (
    <article
      className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-shadow duration-200"
      aria-label={`${item.type} - ${item.title}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-xl"
              role="img"
              aria-label={TYPE_CONFIG[item.type].label}
            >
              {TYPE_CONFIG[item.type].emoji}
            </span>
            <h3 className="text-base font-semibold text-gray-900 leading-tight">
              {item.title}
            </h3>
          </div>

          <p className="text-xs text-gray-500">
            Por {item.submitter} •{" "}
            {item.createdAt.toLocaleDateString("es-ES", {
              day: "numeric",
              month: "short",
            })}
          </p>
        </div>

        {/* Priority Badge */}
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${PRIORITY_CONFIG[item.priority].color}`}
          aria-label={`Prioridad: ${PRIORITY_CONFIG[item.priority].label}`}
        >
          <PriorityIcon className="w-3.5 h-3.5" aria-hidden="true" />
          {PRIORITY_CONFIG[item.priority].label}
        </span>
      </div>

      {/* Metrics Row */}
      <div className="flex items-center gap-4 mb-3">
        {/* Status */}
        <div className="flex items-center gap-2">
          <div
            className={`w-2.5 h-2.5 rounded-full ${STATUS_CONFIG[item.status].color}`}
            aria-hidden="true"
          />
          <span
            className={`text-sm font-medium ${STATUS_CONFIG[item.status].textColor}`}
          >
            {STATUS_CONFIG[item.status].label}
          </span>
        </div>

        {/* Divider */}
        <div className="h-4 w-px bg-gray-300" aria-hidden="true" />

        {/* Impact/Effort */}
        <div className="flex items-center gap-3 text-sm">
          <span className="text-gray-600">
            Impacto: <strong className="text-gray-900">{item.impact}/10</strong>
          </span>
          <span className="text-gray-600">
            Esfuerzo:{" "}
            <strong className="text-gray-900">{item.effort} pts</strong>
          </span>
        </div>
      </div>

      {/* Footer: Why this matters */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="text-xs text-gray-600">
          <strong className="text-gray-900">Eficiencia:</strong> {efficiency}{" "}
          impacto/esfuerzo
        </div>
        <div className="text-xs font-semibold text-purple-600">
          Score: {Math.round(score)}
        </div>
      </div>
    </article>
  );
}

function FilterBar({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  sortBy,
  setSortBy,
}: ReturnType<typeof usePulseItems>) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
      {/* Search */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          aria-hidden="true"
        />
        <input
          type="search"
          placeholder="Buscar items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          aria-label="Buscar items"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" aria-hidden="true" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as Status | "all")}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            aria-label="Filtrar por estado"
          >
            <option value="all">Todos los estados</option>
            {Object.entries(STATUS_CONFIG).map(([key, config]) => (
              <option key={key} value={key}>
                {config.label}
              </option>
            ))}
          </select>
        </div>

        {/* Priority Filter */}
        <select
          value={priorityFilter}
          onChange={(e) =>
            setPriorityFilter(e.target.value as Priority | "all")
          }
          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          aria-label="Filtrar por prioridad"
        >
          <option value="all">Todas las prioridades</option>
          {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
            <option key={key} value={key}>
              {config.label}
            </option>
          ))}
        </select>

        {/* Sort */}
        <div className="flex items-center gap-2 ml-auto">
          <ArrowUpDown className="w-4 h-4 text-gray-500" aria-hidden="true" />
          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "priority" | "impact" | "date")
            }
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            aria-label="Ordenar por"
          >
            <option value="priority">Score (Prioridad inteligente)</option>
            <option value="impact">Mayor impacto</option>
            <option value="date">Más reciente</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function StatsSummary({ items }: { items: PulseItem[] }) {
  const stats = useMemo(() => {
    const critical = items.filter((i) => i.priority === "critical").length;
    const blocked = items.filter((i) => i.status === "blocked").length;
    const inProgress = items.filter((i) => i.status === "in-progress").length;
    const avgImpact =
      items.length > 0
        ? (items.reduce((sum, i) => sum + i.impact, 0) / items.length).toFixed(
            1,
          )
        : "0";

    return { critical, blocked, inProgress, avgImpact };
  }, [items]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard
        label="Críticos"
        value={stats.critical}
        color="text-red-600"
        bgColor="bg-red-50"
      />
      <StatCard
        label="Bloqueados"
        value={stats.blocked}
        color="text-orange-600"
        bgColor="bg-orange-50"
      />
      <StatCard
        label="En Progreso"
        value={stats.inProgress}
        color="text-purple-600"
        bgColor="bg-purple-50"
      />
      <StatCard
        label="Impacto Promedio"
        value={stats.avgImpact}
        color="text-blue-600"
        bgColor="bg-blue-50"
        suffix="/10"
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
  bgColor,
  suffix = "",
}: {
  label: string;
  value: number | string;
  color: string;
  bgColor: string;
  suffix?: string;
}) {
  return (
    <div className={`${bgColor} rounded-lg p-4`}>
      <p className="text-xs font-medium text-gray-600 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>
        {value}
        {suffix}
      </p>
    </div>
  );
}

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

export default function PulseDashboard() {
  const pulseState = usePulseItems(MOCK_ITEMS);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Pulse</h1>
          </div>
          <p className="text-gray-600">
            Dashboard de priorización inteligente • {MOCK_ITEMS.length} items
            totales
          </p>
        </header>

        {/* Stats */}
        <section className="mb-6" aria-label="Estadísticas del dashboard">
          <StatsSummary items={MOCK_ITEMS} />
        </section>

        {/* Filters */}
        <section className="mb-6" aria-label="Filtros y búsqueda">
          <FilterBar {...pulseState} />
        </section>

        {/* Items List */}
        <section aria-label="Lista de items priorizados">
          {pulseState.items.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
              <p className="text-gray-500">
                No se encontraron items con los filtros aplicados.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {pulseState.items.map((item, index) => (
                <div key={item.id} className="relative">
                  {index === 0 && (
                    <div
                      className="absolute -left-3 top-0 bottom-0 w-1 bg-purple-600 rounded-full"
                      aria-hidden="true"
                    />
                  )}
                  <ItemCard
                    item={item}
                    score={pulseState.calculateScore(item)}
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Footer Note */}
        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>
            💡 <strong>Metodología:</strong> Los items se ordenan por score
            combinando prioridad, impacto y esfuerzo estimado.
          </p>
        </footer>
      </div>
    </div>
  );
}
