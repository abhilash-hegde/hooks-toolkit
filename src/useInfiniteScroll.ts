"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface UseInfiniteScrollOptions {
  /** Distance from the bottom of the page to trigger the next fetch (in pixels) */
  threshold?: number;
  /** Initial loading state */
  initialLoading?: boolean;
  /** Whether to enable the infinite scroll */
  enabled?: boolean;
}

interface UseInfiniteScrollReturn {
  /** Whether data is currently being loaded */
  isLoading: boolean;
  /** Function to set the loading state */
  setIsLoading: (isLoading: boolean) => void;
  /** Function to manually trigger the next fetch */
  loadMore: () => void;
  /** Whether the end of the data has been reached */
  hasMore: boolean;
  /** Function to set whether there is more data to load */
  setHasMore: (hasMore: boolean) => void;
}

/**
 * Hook for implementing infinite scrolling
 *
 * @param fetchCallback Function to call when more data should be loaded
 * @param options Configuration options
 * @returns Object containing loading state and control functions
 *
 * @example
 * ```tsx
 * const { isLoading, hasMore } = useInfiniteScroll(async () => {
 *   const newData = await fetchMoreData(page);
 *   setData([...data, ...newData]);
 *   setPage(page + 1);
 *   return newData.length > 0;
 * });
 * ```
 */
export function useInfiniteScroll(
  fetchCallback: () => Promise<boolean>,
  options: UseInfiniteScrollOptions = {}
): UseInfiniteScrollReturn {
  const { threshold = 200, initialLoading = false, enabled = true } = options;

  const [isLoading, setIsLoading] = useState<boolean>(initialLoading);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // Use a ref to track if a fetch is in progress to prevent multiple simultaneous fetches
  const isFetchingRef = useRef<boolean>(false);

  const loadMore = useCallback(async () => {
    // Don't fetch if already loading, no more data, or disabled
    if (isFetchingRef.current || isLoading || !hasMore || !enabled) return;

    isFetchingRef.current = true;
    setIsLoading(true);

    try {
      // The fetchCallback should return a boolean indicating if there's more data
      const hasMoreData = await fetchCallback();
      setHasMore(hasMoreData);
    } catch (error) {
      console.error("Error fetching more data:", error);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [fetchCallback, hasMore, isLoading, enabled]);

  useEffect(() => {
    if (!enabled) return;

    const handleScroll = () => {
      // Check if we're near the bottom of the page
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - threshold
      ) {
        loadMore();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loadMore, threshold, enabled]);

  return {
    isLoading,
    setIsLoading,
    loadMore,
    hasMore,
    setHasMore,
  };
}
