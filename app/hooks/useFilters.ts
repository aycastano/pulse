import React, { useState, useEffect, useCallback } from "react";
import { FilterState, Status, Priority } from "../domain/types";
export function useFilters() {
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