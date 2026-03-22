"use client";

import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "@/utils/api";
import { notify } from "@/utils/notifications";

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export function useList<T>(
  endpoint: string,
  {
    defaultLimit = 10,
    defaultPage = 1,
    autoFetch = true,
    initialFilters = {},
  }: {
    defaultLimit?: number;
    defaultPage?: number;
    autoFetch?: boolean;
    initialFilters?: Record<string, any>;
  } = {}
) {
  const [data, setData] = useState<T[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: defaultPage,
    limit: defaultLimit,
    total: 0,
    pages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, any>>(initialFilters);

  const fetchData = useCallback(
    async (page: number = 1) => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        params.set("page", page.toString());
        params.set("limit", pagination.limit.toString());

        if (search) params.set("search", search);

        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            params.set(key, value);
          }
        });

        const response = await apiRequest("GET", `${endpoint}?${params}`, undefined, {
          showError: false,
        });

        setData(response.data || []);

        if (response.pagination) {
          setPagination(response.pagination);
        } else {
          // If no pagination info, assume single page
          setPagination({
            page: 1,
            limit: pagination.limit,
            total: response.data?.length || 0,
            pages: 1,
          });
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch data";
        setError(errorMessage);
        setData([]);
      } finally {
        setLoading(false);
      }
    },
    [endpoint, pagination.limit, search, filters]
  );

  useEffect(() => {
    if (autoFetch) {
      fetchData(1);
    }
  }, [fetchData, autoFetch]);

  const goToPage = useCallback(
    (page: number) => {
      setPagination((prev) => ({ ...prev, page }));
      fetchData(page);
    },
    [fetchData]
  );

  const refetch = useCallback(() => {
    fetchData(pagination.page);
  }, [fetchData, pagination.page]);

  const handleSearchChange = useCallback((newSearch: string) => {
    setSearch(newSearch);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const handleFilterChange = useCallback((newFilters: Record<string, any>) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const updateFilters = useCallback(
    (filterUpdates: Record<string, any>) => {
      setFilters((prev) => ({ ...prev, ...filterUpdates }));
      setPagination((prev) => ({ ...prev, page: 1 }));
    },
    []
  );

  return {
    data,
    loading,
    error,
    pagination,
    search,
    setSearch: handleSearchChange,
    filters,
    setFilters: handleFilterChange,
    updateFilters,
    goToPage,
    refetch,
  };
}
