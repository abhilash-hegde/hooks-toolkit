"use client";

import { useState, useEffect, useCallback } from "react";

interface FetchState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

interface FetchOptions extends RequestInit {
  autoFetch?: boolean;
}

/**
 * Hook that handles data fetching
 * @param url URL to fetch
 * @param options Fetch options
 * @returns Fetch state and refetch function
 */
export function useFetch<T = unknown>(
  url: string,
  options: FetchOptions = {}
): FetchState<T> & { refetch: () => Promise<void> } {
  const { autoFetch = true, ...fetchOptions } = options;

  const [state, setState] = useState<FetchState<T>>({
    data: null,
    isLoading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      setState({
        data,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState({
        data: null,
        isLoading: false,
        error: error instanceof Error ? error : new Error(String(error)),
      });
    }
  }, [url, fetchOptions]);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    } else {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [autoFetch, fetchData]);

  return {
    ...state,
    refetch: fetchData,
  };
}
