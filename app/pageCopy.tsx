"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  TrendingUp,
  Filter,
  Search,
  ArrowUpDown,
  Moon,
  Sun,
  X,
  ChevronRight,
  BarChart3,
  Activity,
  AlertTriangle,
  Zap,
  Target,
  Calendar,
  Tag,
  User,
  Info,
  History,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

// ============================================================================
// TYPES & DOMAIN MODEL
// ============================================================================

type Status = "new" | "triaged" | "in_progress" | "done";
type Priority = "low" | "medium" | "high" | "critical";

interface PulseItem {
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

interface HistoryEntry {
  timestamp: string;
  action: string;
  field: string;
  oldValue: string;
  newValue: string;
}

interface FilterState {
  search: string;
  status: Status | "all";
  priority: Priority | "all";
  tags: string[];
  sortBy: "score" | "impact" | "createdAt";
  page: number;
  pageSize: number;
}

// ============================================================================
// MOCK DATA (30+ items realistas)
// ============================================================================

const MOCK_DATA: PulseItem[] = [
  {
    id: "PULSE-001",
    title: "Critical: Payment gateway timeout on checkout",
    description:
      "Users report payment failures during checkout. Stripe webhook not responding within 30s timeout. Affecting ~15% of transactions.",
    status: "in_progress",
    priority: "critical",
    impact: 5,
    effort: 3,
    owner: "Sarah Chen",
    tags: ["backend", "payments", "bug"],
    createdAt: "2025-01-26T08:30:00Z",
  },
  {
    id: "PULSE-002",
    title: "Add dark mode to entire application",
    description:
      "Users requesting dark mode for better night-time usability. Should persist preference across sessions.",
    status: "triaged",
    priority: "medium",
    impact: 3,
    effort: 4,
    owner: "Marcus Rodriguez",
    tags: ["frontend", "ux", "feature"],
    createdAt: "2025-01-25T14:20:00Z",
  },
  {
    id: "PULSE-003",
    title: "Database query optimization for user search",
    description:
      "Search queries taking 5-8s on production. Need to add proper indexes and implement caching layer.",
    status: "triaged",
    priority: "high",
    impact: 4,
    effort: 2,
    owner: "Li Wei",
    tags: ["backend", "performance", "database"],
    createdAt: "2025-01-24T11:15:00Z",
  },
  {
    id: "PULSE-004",
    title: "CSV export broken for large datasets",
    description:
      "Export fails with timeout error when dataset >10k rows. Memory leak suspected.",
    status: "new",
    priority: "medium",
    impact: 3,
    effort: 2,
    tags: ["backend", "bug", "export"],
    createdAt: "2025-01-23T16:45:00Z",
  },
  {
    id: "PULSE-005",
    title: "Implement SSO with Google Workspace",
    description:
      "Enterprise clients requesting SSO integration. Would unlock 3 pending contracts worth $180k ARR.",
    status: "new",
    priority: "critical",
    impact: 5,
    effort: 5,
    owner: "Emma Thompson",
    tags: ["auth", "enterprise", "feature"],
    createdAt: "2025-01-22T09:00:00Z",
  },
  {
    id: "PULSE-006",
    title: "Mobile app crashes on iOS 17.2",
    description:
      "App crashes immediately on launch for iOS 17.2 users. Affects 22% of user base.",
    status: "in_progress",
    priority: "critical",
    impact: 5,
    effort: 2,
    owner: "Sarah Chen",
    tags: ["mobile", "ios", "bug"],
    createdAt: "2025-01-26T07:00:00Z",
  },
  {
    id: "PULSE-007",
    title: "Add real-time collaboration to documents",
    description:
      "Users want Google Docs-style collaboration. WebSocket infrastructure needed.",
    status: "new",
    priority: "low",
    impact: 4,
    effort: 5,
    tags: ["feature", "realtime", "frontend"],
    createdAt: "2025-01-20T13:30:00Z",
  },
  {
    id: "PULSE-008",
    title: "Refactor authentication middleware",
    description:
      "Current auth code is spaghetti. Hard to test, prone to bugs. Tech debt cleanup.",
    status: "triaged",
    priority: "medium",
    impact: 2,
    effort: 3,
    owner: "Marcus Rodriguez",
    tags: ["backend", "refactor", "tech-debt"],
    createdAt: "2025-01-19T10:20:00Z",
  },
  {
    id: "PULSE-009",
    title: "Email notifications not being sent",
    description:
      "SendGrid integration broken. Users not receiving password reset emails.",
    status: "done",
    priority: "high",
    impact: 4,
    effort: 1,
    owner: "Li Wei",
    tags: ["email", "bug", "backend"],
    createdAt: "2025-01-18T15:45:00Z",
  },
  {
    id: "PULSE-010",
    title: "Add A/B testing framework",
    description:
      "Product needs experimentation platform. LaunchDarkly integration or build custom.",
    status: "new",
    priority: "low",
    impact: 3,
    effort: 4,
    tags: ["infrastructure", "analytics", "feature"],
    createdAt: "2025-01-17T11:00:00Z",
  },
  {
    id: "PULSE-011",
    title: "Redesign onboarding flow",
    description:
      "Current onboarding has 65% drop-off. Need progressive disclosure and better UX.",
    status: "in_progress",
    priority: "high",
    impact: 5,
    effort: 4,
    owner: "Emma Thompson",
    tags: ["ux", "frontend", "growth"],
    createdAt: "2025-01-25T08:00:00Z",
  },
  {
    id: "PULSE-012",
    title: "API rate limiting not enforced",
    description:
      "Users can spam API without limits. Need Redis-based rate limiter.",
    status: "triaged",
    priority: "high",
    impact: 3,
    effort: 2,
    owner: "Li Wei",
    tags: ["backend", "security", "api"],
    createdAt: "2025-01-24T14:30:00Z",
  },
  {
    id: "PULSE-013",
    title: "Add Stripe payment methods support",
    description:
      "Support Apple Pay, Google Pay, SEPA. Currently only credit cards.",
    status: "new",
    priority: "medium",
    impact: 4,
    effort: 3,
    tags: ["payments", "feature", "frontend"],
    createdAt: "2025-01-23T09:15:00Z",
  },
  {
    id: "PULSE-014",
    title: "Accessibility audit and fixes",
    description:
      "Screen reader support broken. Keyboard navigation incomplete. WCAG 2.1 compliance needed.",
    status: "new",
    priority: "medium",
    impact: 3,
    effort: 3,
    tags: ["a11y", "frontend", "compliance"],
    createdAt: "2025-01-22T16:00:00Z",
  },
  {
    id: "PULSE-015",
    title: "Implement CDN for static assets",
    description:
      "Images loading slowly from origin. CloudFlare or Fastly integration.",
    status: "done",
    priority: "low",
    impact: 2,
    effort: 2,
    owner: "Marcus Rodriguez",
    tags: ["performance", "infrastructure"],
    createdAt: "2025-01-15T12:00:00Z",
  },
  {
    id: "PULSE-016",
    title: "Add bulk actions to admin panel",
    description:
      "Admins need to update/delete multiple items at once. Current UI is tedious.",
    status: "triaged",
    priority: "low",
    impact: 2,
    effort: 2,
    tags: ["admin", "ux", "feature"],
    createdAt: "2025-01-21T10:45:00Z",
  },
  {
    id: "PULSE-017",
    title: "Critical: Data breach in user profiles",
    description:
      "PII exposed through unsanitized API response. URGENT security fix needed.",
    status: "done",
    priority: "critical",
    impact: 5,
    effort: 1,
    owner: "Sarah Chen",
    tags: ["security", "bug", "backend"],
    createdAt: "2025-01-26T06:00:00Z",
  },
  {
    id: "PULSE-018",
    title: "Upgrade to React 19",
    description:
      "Unlock new features like Server Components. Migration guide needed.",
    status: "new",
    priority: "low",
    impact: 2,
    effort: 5,
    tags: ["frontend", "upgrade", "tech-debt"],
    createdAt: "2025-01-20T08:30:00Z",
  },
  {
    id: "PULSE-019",
    title: "Add webhook support for integrations",
    description:
      "Partners need webhooks for real-time data sync. Build webhook delivery system.",
    status: "triaged",
    priority: "medium",
    impact: 4,
    effort: 3,
    owner: "Li Wei",
    tags: ["api", "integrations", "feature"],
    createdAt: "2025-01-19T13:20:00Z",
  },
  {
    id: "PULSE-020",
    title: "Localization for Spanish and French",
    description:
      "Support ES and FR markets. i18n infrastructure + translations.",
    status: "new",
    priority: "low",
    impact: 3,
    effort: 4,
    tags: ["i18n", "frontend", "growth"],
    createdAt: "2025-01-18T11:00:00Z",
  },
  {
    id: "PULSE-021",
    title: "Add GraphQL endpoint",
    description:
      "Mobile team wants GraphQL instead of REST. Build Apollo Server.",
    status: "new",
    priority: "low",
    impact: 2,
    effort: 5,
    tags: ["api", "backend", "feature"],
    createdAt: "2025-01-17T15:30:00Z",
  },
  {
    id: "PULSE-022",
    title: "Analytics dashboard page load time optimization",
    description:
      "Dashboard takes 12s to load. Need lazy loading and code splitting.",
    status: "in_progress",
    priority: "high",
    impact: 4,
    effort: 3,
    owner: "Emma Thompson",
    tags: ["performance", "frontend", "analytics"],
    createdAt: "2025-01-25T10:15:00Z",
  },
  {
    id: "PULSE-023",
    title: "Implement automated backups",
    description: "No backup strategy currently. Need daily snapshots to S3.",
    status: "triaged",
    priority: "high",
    impact: 5,
    effort: 2,
    owner: "Marcus Rodriguez",
    tags: ["infrastructure", "database", "ops"],
    createdAt: "2025-01-24T09:00:00Z",
  },
  {
    id: "PULSE-024",
    title: "Add comment/mention system",
    description:
      "Users want to collaborate via comments. @mentions with notifications.",
    status: "new",
    priority: "medium",
    impact: 3,
    effort: 4,
    tags: ["feature", "collaboration", "frontend"],
    createdAt: "2025-01-23T14:20:00Z",
  },
  {
    id: "PULSE-025",
    title: "Memory leak in WebSocket connections",
    description:
      "Server memory grows unbounded. WebSocket cleanup not happening.",
    status: "in_progress",
    priority: "critical",
    impact: 5,
    effort: 3,
    owner: "Li Wei",
    tags: ["backend", "bug", "performance"],
    createdAt: "2025-01-26T09:45:00Z",
  },
  {
    id: "PULSE-026",
    title: "Add advanced search filters",
    description:
      "Users need date ranges, complex boolean queries. Current search too basic.",
    status: "new",
    priority: "low",
    impact: 2,
    effort: 3,
    tags: ["search", "feature", "frontend"],
    createdAt: "2025-01-22T11:30:00Z",
  },
  {
    id: "PULSE-027",
    title: "Improve error messages",
    description:
      "Generic 'Something went wrong' messages everywhere. Need specific, actionable errors.",
    status: "triaged",
    priority: "medium",
    impact: 3,
    effort: 2,
    owner: "Emma Thompson",
    tags: ["ux", "frontend", "improvement"],
    createdAt: "2025-01-21T16:00:00Z",
  },
  {
    id: "PULSE-028",
    title: "Add CSV import functionality",
    description:
      "Users want to bulk import data via CSV. Need parser + validation.",
    status: "new",
    priority: "low",
    impact: 2,
    effort: 3,
    tags: ["import", "feature", "backend"],
    createdAt: "2025-01-20T10:00:00Z",
  },
  {
    id: "PULSE-029",
    title: "Setup monitoring and alerts",
    description: "No observability currently. Add Sentry, Datadog or similar.",
    status: "triaged",
    priority: "high",
    impact: 4,
    effort: 2,
    owner: "Marcus Rodriguez",
    tags: ["ops", "monitoring", "infrastructure"],
    createdAt: "2025-01-24T15:45:00Z",
  },
  {
    id: "PULSE-030",
    title: "Build public API documentation",
    description: "API docs are outdated. Need OpenAPI/Swagger with examples.",
    status: "new",
    priority: "medium",
    impact: 3,
    effort: 3,
    tags: ["docs", "api", "dx"],
    createdAt: "2025-01-19T09:30:00Z",
  },
  {
    id: "PULSE-031",
    title: "Add team permissions and roles",
    description: "Need admin/editor/viewer roles. RBAC system required.",
    status: "in_progress",
    priority: "high",
    impact: 5,
    effort: 5,
    owner: "Sarah Chen",
    tags: ["auth", "feature", "enterprise"],
    createdAt: "2025-01-25T13:00:00Z",
  },
  {
    id: "PULSE-032",
    title: "Fix broken image uploads",
    description: "Image upload fails silently. No error message shown to user.",
    status: "new",
    priority: "medium",
    impact: 3,
    effort: 1,
    tags: ["bug", "upload", "frontend"],
    createdAt: "2025-01-23T12:15:00Z",
  },
];

// ============================================================================
// CONFIGURATION & CONSTANTS
// ============================================================================

const STATUS_CONFIG = {
  new: {
    label: "Nuevo",
    color: "bg-blue-500",
    textColor: "text-blue-700",
    bgLight: "bg-blue-50",
  },
  triaged: {
    label: "Triaged",
    color: "bg-purple-500",
    textColor: "text-purple-700",
    bgLight: "bg-purple-50",
  },
  in_progress: {
    label: "En Progreso",
    color: "bg-yellow-500",
    textColor: "text-yellow-700",
    bgLight: "bg-yellow-50",
  },
  done: {
    label: "Completado",
    color: "bg-green-500",
    textColor: "text-green-700",
    bgLight: "bg-green-50",
  },
} as const;

const PRIORITY_CONFIG = {
  low: {
    label: "Bajo",
    weight: 0,
    color: "bg-gray-100 text-gray-700 border-gray-300",
    icon: Clock,
  },
  medium: {
    label: "Medio",
    weight: 2,
    color: "bg-yellow-100 text-yellow-800 border-yellow-300",
    icon: AlertCircle,
  },
  high: {
    label: "Alto",
    weight: 4,
    color: "bg-orange-100 text-orange-800 border-orange-300",
    icon: TrendingUp,
  },
  critical: {
    label: "Crítico",
    weight: 6,
    color: "bg-red-100 text-red-800 border-red-300",
    icon: AlertTriangle,
  },
} as const;

// ============================================================================
// BUSINESS LOGIC - SCORING ALGORITHM
// ============================================================================

function calculateScore(item: PulseItem): number {
  const priorityWeight = PRIORITY_CONFIG[item.priority].weight;
  return item.impact * 2 + priorityWeight - item.effort;
}

// ============================================================================
// HOOKS
// ============================================================================

function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stored = localStorage.getItem("pulse-theme") as
      | "light"
      | "dark"
      | null;
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const initialTheme = stored || (prefersDark ? "dark" : "light");
    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem("pulse-theme", next);
      document.documentElement.classList.toggle("dark", next === "dark");
      return next;
    });
  }, []);

  return { theme, toggleTheme };
}

function useItems() {
  const [items, setItems] = useState<PulseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simular carga de datos con 10% chance de error
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

function useFilters() {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    status: "all",
    priority: "all",
    tags: [],
    sortBy: "score",
    page: 1,
    pageSize: 10,
  });

  // Initialize from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlFilters: Partial<FilterState> = {};

    if (params.get("search")) urlFilters.search = params.get("search")!;
    if (params.get("status"))
      urlFilters.status = params.get("status") as Status | "all";
    if (params.get("priority"))
      urlFilters.priority = params.get("priority") as Priority | "all";
    if (params.get("sortBy"))
      urlFilters.sortBy = params.get("sortBy") as FilterState["sortBy"];
    if (params.get("page")) urlFilters.page = parseInt(params.get("page")!);
    if (params.get("pageSize"))
      urlFilters.pageSize = parseInt(params.get("pageSize")!);

    if (Object.keys(urlFilters).length > 0) {
      setFilters((prev) => ({ ...prev, ...urlFilters }));
    }
  }, []);

  // Sync filters to URL whenever they change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.status !== "all") params.set("status", filters.status);
    if (filters.priority !== "all") params.set("priority", filters.priority);
    if (filters.sortBy !== "score") params.set("sortBy", filters.sortBy);
    if (filters.page > 1) params.set("page", filters.page.toString());
    if (filters.pageSize !== 10)
      params.set("pageSize", filters.pageSize.toString());

    const newUrl = params.toString()
      ? `?${params.toString()}`
      : window.location.pathname;
    window.history.replaceState({}, "", newUrl);
  }, [filters]);

  const updateFilters = useCallback((updates: Partial<FilterState>) => {
    setFilters((prev) => {
      // Si cambian los filtros (no la página), resetear a página 1
      const shouldResetPage =
        updates.search !== undefined ||
        updates.status !== undefined ||
        updates.priority !== undefined ||
        updates.tags !== undefined ||
        updates.sortBy !== undefined;

      return {
        ...prev,
        ...updates,
        ...(shouldResetPage && updates.page === undefined ? { page: 1 } : {}),
      };
    });
  }, []);

  return { filters, updateFilters };
}

// ============================================================================
// COMPONENTS
// ============================================================================

function ThemeToggle({
  theme,
  onToggle,
}: {
  theme: "light" | "dark";
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <Moon className="w-5 h-5" />
      ) : (
        <Sun className="w-5 h-5" />
      )}
    </button>
  );
}

function KPICard({
  label,
  value,
  icon: Icon,
  trend,
  color,
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  trend?: string;
  color: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="w-5 h-5 text-white" aria-hidden="true" />
        </div>
        {trend && (
          <span className="text-xs font-medium text-green-600 dark:text-green-400">
            {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
        {value}
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
    </div>
  );
}

function SimpleBarChart({ items }: { items: PulseItem[] }) {
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
          Items por Estado
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

function ScoreTooltip() {
  const [show, setShow] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Información sobre el cálculo del score"
      >
        <Info className="w-4 h-4 text-gray-500" />
      </button>

      {show && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-4 bg-gray-900 text-white text-xs rounded-lg shadow-xl">
          <div className="font-semibold mb-2">Fórmula del Score:</div>
          <code className="block bg-gray-800 p-2 rounded mb-2">
            score = (impact × 2) + priorityWeight - effort
          </code>
          <ul className="space-y-1 text-gray-300">
            <li>• Critical: +6 pts</li>
            <li>• High: +4 pts</li>
            <li>• Medium: +2 pts</li>
            <li>• Low: +0 pts</li>
          </ul>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900" />
        </div>
      )}
    </div>
  );
}

function FilterBar({
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
            <option value="all">Todos los estados</option>
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
          <option value="all">Todas las prioridades</option>
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
            <option value="score">Score (Prioridad inteligente)</option>
            <option value="impact">Mayor impacto</option>
            <option value="createdAt">Más reciente</option>
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

function ItemCard({ item, onClick }: { item: PulseItem; onClick: () => void }) {
  const PriorityIcon = PRIORITY_CONFIG[item.priority].icon;
  const score = calculateScore(item);

  return (
    <article
      onClick={onClick}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:shadow-lg hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-200 cursor-pointer group"
      tabIndex={0}
      role="button"
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      aria-label={`Ver detalles de ${item.title}`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
              {item.id}
            </span>
            {item.owner && (
              <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                <User className="w-3 h-3" />
                <span>{item.owner}</span>
              </div>
            )}
          </div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white leading-tight mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            {item.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {item.description}
          </p>
        </div>

        <span
          className={`flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${PRIORITY_CONFIG[item.priority].color}`}
        >
          <PriorityIcon className="w-3.5 h-3.5" aria-hidden="true" />
          {PRIORITY_CONFIG[item.priority].label}
        </span>
      </div>

      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-center gap-2">
          <div
            className={`w-2.5 h-2.5 rounded-full ${STATUS_CONFIG[item.status].color}`}
            aria-hidden="true"
          />
          <span
            className={`text-sm font-medium ${STATUS_CONFIG[item.status].textColor} dark:text-opacity-90`}
          >
            {STATUS_CONFIG[item.status].label}
          </span>
        </div>

        <div
          className="h-4 w-px bg-gray-300 dark:bg-gray-600"
          aria-hidden="true"
        />

        <div className="flex items-center gap-3 text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            <Zap className="inline w-3.5 h-3.5 mr-1" />
            Impacto:{" "}
            <strong className="text-gray-900 dark:text-white">
              {item.impact}/5
            </strong>
          </span>
          <span className="text-gray-600 dark:text-gray-400">
            <Target className="inline w-3.5 h-3.5 mr-1" />
            Esfuerzo:{" "}
            <strong className="text-gray-900 dark:text-white">
              {item.effort}/5
            </strong>
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
        <div className="flex flex-wrap gap-1.5">
          {item.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <ScoreTooltip />
          <div className="text-sm font-bold text-purple-600 dark:text-purple-400">
            Score: {score}
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
        </div>
      </div>
    </article>
  );
}

function ItemDetail({
  item,
  onClose,
  onUpdate,
}: {
  item: PulseItem;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<PulseItem>) => void;
}) {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-start justify-between">
          <div className="flex-1">
            <span className="text-sm font-mono text-gray-500 dark:text-gray-400">
              {item.id}
            </span>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {item.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Cerrar detalle"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Descripción
            </h3>
            <p className="text-gray-900 dark:text-white">{item.description}</p>
          </div>

          {/* Status & Priority Controls */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Estado
              </label>
              <select
                value={item.status}
                onChange={(e) =>
                  onUpdate(item.id, { status: e.target.value as Status })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
              >
                {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                  <option key={key} value={key}>
                    {config.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Prioridad
              </label>
              <select
                value={item.priority}
                onChange={(e) =>
                  onUpdate(item.id, { priority: e.target.value as Priority })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
              >
                {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
                  <option key={key} value={key}>
                    {config.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Score
              </p>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {calculateScore(item)}
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Impacto
              </p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {item.impact}/5
              </p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Esfuerzo
              </p>
              <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                {item.effort}/5
              </p>
            </div>
          </div>

          {/* Metadata */}
          <div className="space-y-3">
            {item.owner && (
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600 dark:text-gray-400">Owner:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {item.owner}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600 dark:text-gray-400">Creado:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {new Date(item.createdAt).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Tags:
              </span>
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 rounded text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* History */}
          {item.history && item.history.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <History className="w-4 h-4 text-gray-500" />
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Historial
                </h3>
              </div>
              <div className="space-y-2">
                {item.history.map((entry, i) => (
                  <div
                    key={i}
                    className="text-sm p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
                  >
                    <span className="text-gray-600 dark:text-gray-400">
                      {entry.field} cambiado de{" "}
                      <strong className="text-gray-900 dark:text-white">
                        {entry.oldValue}
                      </strong>{" "}
                      a{" "}
                      <strong className="text-gray-900 dark:text-white">
                        {entry.newValue}
                      </strong>
                    </span>
                    <span className="block text-xs text-gray-500 mt-1">
                      {new Date(entry.timestamp).toLocaleString("es-ES")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600 mb-4" />
      <p className="text-gray-600 dark:text-gray-400">Cargando items...</p>
    </div>
  );
}

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Error al cargar
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
      <button
        onClick={onRetry}
        className="px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
      >
        Reintentar
      </button>
    </div>
  );
}

function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}) {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showPages = 5; // Mostrar 5 números de página

    if (totalPages <= showPages) {
      // Mostrar todas las páginas si son pocas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Lógica para páginas con ellipsis
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Items info */}
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Mostrando{" "}
          <span className="font-medium text-gray-900 dark:text-white">
            {startItem}
          </span>{" "}
          a{" "}
          <span className="font-medium text-gray-900 dark:text-white">
            {endItem}
          </span>{" "}
          de{" "}
          <span className="font-medium text-gray-900 dark:text-white">
            {totalItems}
          </span>{" "}
          items
        </div>

        {/* Page size selector */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="pageSize"
            className="text-sm text-gray-600 dark:text-gray-400"
          >
            Items por página:
          </label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={(e) => onPageSizeChange(parseInt(e.target.value))}
            className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 transition-colors"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>

        {/* Page controls */}
        <div className="flex items-center gap-1">
          {/* First page */}
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Primera página"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>

          {/* Previous page */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Página anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Page numbers */}
          <div className="hidden sm:flex items-center gap-1">
            {getPageNumbers().map((page, idx) =>
              page === "..." ? (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-3 py-2 text-gray-500"
                >
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => onPageChange(page as number)}
                  className={`min-w-[2.5rem] px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === page
                      ? "bg-purple-600 text-white"
                      : "border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
                  }`}
                  aria-label={`Página ${page}`}
                  aria-current={currentPage === page ? "page" : undefined}
                >
                  {page}
                </button>
              ),
            )}
          </div>

          {/* Mobile: current page indicator */}
          <div className="sm:hidden px-3 py-2 text-sm font-medium text-gray-900 dark:text-white">
            {currentPage} / {totalPages}
          </div>

          {/* Next page */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Página siguiente"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Last page */}
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Última página"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
        <Search className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        No se encontraron resultados
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Intenta ajustar los filtros de búsqueda
      </p>
    </div>
  );
}

// ============================================================================
// MAIN APP
// ============================================================================

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
              Dashboard de priorización inteligente • {items.length} items
              totales
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
            label="Críticos"
            value={kpis.critical}
            icon={AlertTriangle}
            color="bg-red-600"
          />
          <KPICard
            label="En Progreso"
            value={kpis.inProgress}
            icon={Clock}
            color="bg-yellow-600"
          />
          <KPICard
            label="Completados (7d)"
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
                Top 5 Prioridades
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
