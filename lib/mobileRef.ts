import { useState, useEffect } from "react";

const MOBILE_REF_KEY = "aerovia_mobile_ref";

/**
 * Check if the current page has a mobileref URL parameter
 * This indicates the page was opened from a mobile application
 * The state is persisted in sessionStorage to survive navigation
 */
export function hasMobileRef(): boolean {
  if (typeof window === "undefined") {
    // Server-side: default to false to avoid hydration issues
    return false;
  }

  // First check if we already have this stored in sessionStorage
  const stored = sessionStorage.getItem(MOBILE_REF_KEY);
  if (stored === "true") {
    return true;
  }

  // Check URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const hasParam = urlParams.has("mobileref");

  // Store the result in sessionStorage for future navigation
  if (hasParam) {
    sessionStorage.setItem(MOBILE_REF_KEY, "true");
  }

  return hasParam;
}

/**
 * React hook version that prevents flashing by checking state immediately
 * Use this in components that need to react to mobile ref state changes
 */
export function useMobileRef(): boolean {
  // Check immediately during render to prevent flashing
  const [isMobileRef, setIsMobileRef] = useState(() => hasMobileRef());

  useEffect(() => {
    const checkMobileRef = () => {
      const newValue = hasMobileRef();
      if (newValue !== isMobileRef) {
        setIsMobileRef(newValue);
      }
    };

    // Listen for storage changes (in case another tab/window changes it)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === MOBILE_REF_KEY) {
        checkMobileRef();
      }
    };

    // Clear mobile ref state when the page is unloaded
    const handleBeforeUnload = () => {
      clearMobileRef();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isMobileRef]);

  return isMobileRef;
}

/**
 * Clear the mobile ref state (useful for testing or when you want to reset)
 */
export function clearMobileRef(): void {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(MOBILE_REF_KEY);
  }
}

/**
 * Development utility: Set mobile ref state for testing
 * Only available in development mode
 */
export function setMobileRefForTesting(enabled: boolean = true): void {
  if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
    if (enabled) {
      sessionStorage.setItem(MOBILE_REF_KEY, "true");
    } else {
      sessionStorage.removeItem(MOBILE_REF_KEY);
    }
    // Trigger a storage event to update all components
    window.dispatchEvent(new StorageEvent("storage", { key: MOBILE_REF_KEY }));
  }
}
