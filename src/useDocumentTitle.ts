"use client";

import { useEffect } from "react";

/**
 * Hook that updates the document title
 * @param title New document title
 * @param restoreOnUnmount Whether to restore the original title on unmount
 */
export function useDocumentTitle(
  title: string,
  restoreOnUnmount = false
): void {
  useEffect(() => {
    const originalTitle = document.title;
    document.title = title;

    return () => {
      if (restoreOnUnmount) {
        document.title = originalTitle;
      }
    };
  }, [title, restoreOnUnmount]);
}
