"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const MOBILE_REF_KEY = "aerovia_mobile_ref";

/**
 * Wrapper component that hides its children when ?mobileref is present
 * Uses sessionStorage to persist the state across navigation within the same tab
 * State is cleared when the tab/browser is closed
 */
function MobileRefWrapperContent({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const hasMobileRef = searchParams.has("mobileref");
  const [isMobileRef, setIsMobileRef] = useState(hasMobileRef);

  useEffect(() => {
    // Check if we already stored this in sessionStorage
    const stored = sessionStorage.getItem(MOBILE_REF_KEY) === "true";

    // If parameter is present, store it for future navigation
    if (hasMobileRef && !stored) {
      sessionStorage.setItem(MOBILE_REF_KEY, "true");
      setIsMobileRef(true);
    } else if (stored) {
      // Use stored value even if parameter is not in current URL
      setIsMobileRef(true);
    } else {
      setIsMobileRef(false);
    }
  }, [searchParams]);

  if (isMobileRef) {
    return null;
  }

  return <>{children}</>;
}

export default function MobileRefWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <MobileRefWrapperContent>{children}</MobileRefWrapperContent>
    </Suspense>
  );
}
