"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface Cache<T> {
  [key: string]: {
    data: T;
    timestamp: number;
  };
}

interface SWROptions {
  /** Revalidation interval in milliseconds */
  refreshInterval?: number;
  /** Whether to fetch on mount */
  revalidateOnMount?: boolean;
  /** Whether to fetch on window focus */
  revalidateOnFocus?: boolean;
  /** Cache time in milliseconds */
  cacheTime?: number;
  /** Dedupe requests during a time window */
  dedupingInterval?: number;
}

interface SWRResponse<T> {
  /** The data returned from the fetcher */
  data: T | undefined;
  /** Whether the request is loading */
  isLoading: boolean;
  /** Error thrown by the fetcher */
  error: Error | undefined;
  /** Function to manually revalidate the data */
  mutate: (data?: T) => Promise<void>;
}

// Global cache
const globalCache: Cache<any> = {};

// Global deduping
const dedupeMap = new Map<string, Promise<any>>();

/**
 * A simplified implementation of SWR (stale-while-revalidate)
 *
 * @param key Unique key for the request
 * @param fetcher Function to fetch the data
 * @param options Configuration options
 * @returns Object containing data, loading state, error, and mutate function
 *
 * @example
 * ```tsx
 * const { data, isLoading, error, mutate } = useSWR(
 *   '/api/user',
 *   () => fetch('/api/user').then(res => res.json()),
 *   { refreshInterval: 3000 }
 * );
 *
 * if (isLoading) return <div>Loading...</div>;
 * if (error) return <div>Error: {error.message}</div>;
 * return (
 *   <div>
 *     <h1>User: {data.name}</h1>
 *     <button onClick={() => mutate()}>Refresh</button>
 *   </div>
 * );
 * ```
 */
export function useSWR<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: SWROptions = {}
): SWRResponse<T> {
  const {
    refreshInterval,
    revalidateOnMount = true,
    revalidateOnFocus = true,
    cacheTime = 5 * 60 * 1000, // 5 minutes
    dedupingInterval = 2000, // 2 seconds
  } = options;

  const [data, setData] = useState<T | undefined>(() => {
    // Initialize from cache if available and not expired
    const cached = globalCache[key];
    if (cached && Date.now() - cached.timestamp < cacheTime) {
      return cached.data;
    }
    return undefined;
  });

  const [isLoading, setIsLoading] = useState<boolean>(!data);
  const [error, setError] = useState<Error | undefined>(undefined);

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  // Keep track of component mount state
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const fetchData = useCallback(async () => {
    if (!key) return;

    setIsLoading(true);
    setError(undefined);

    try {
      // Check if there's already a request in progress for this key
      let promise = dedupeMap.get(key);

      if (!promise) {
        promise = fetcherRef.current();
        dedupeMap.set(key, promise);

        // Remove from deduping map after the dedupingInterval
        setTimeout(() => {
          dedupeMap.delete(key);
        }, dedupingInterval);
      }

      const newData = await promise;

      if (isMounted.current) {
        setData(newData);
        setIsLoading(false);
      }

      // Update cache
      globalCache[key] = {
        data: newData,
        timestamp: Date.now(),
      };

      return newData;
    } catch (err) {
      if (isMounted.current) {
        setError(err instanceof Error ? err : new Error(String(err)));
        setIsLoading(false);
      }
    }
  }, [key, dedupingInterval]);

  // Revalidate on mount
  useEffect(() => {
    if (revalidateOnMount) {
      fetchData();
    }
  }, [fetchData, revalidateOnMount]);

  // Set up refresh interval
  useEffect(() => {
    if (!refreshInterval) return;

    const intervalId = setInterval(fetchData, refreshInterval);

    return () => {
      clearInterval(intervalId);
    };
  }, [fetchData, refreshInterval]);

  // Revalidate on focus
  useEffect(() => {
    if (!revalidateOnFocus) return;

    const onFocus = () => {
      fetchData();
    };

    window.addEventListener("focus", onFocus);

    return () => {
      window.removeEventListener("focus", onFocus);
    };
  }, [fetchData, revalidateOnFocus]);

  // Mutate function
  const mutate = useCallback(
    async (newData?: T) => {
      if (newData) {
        setData(newData);

        // Update cache
        globalCache[key] = {
          data: newData,
          timestamp: Date.now(),
        };
      } else {
        // Revalidate
        await fetchData();
      }
    },
    [key, fetchData]
  );

  return { data, isLoading, error, mutate };
}
