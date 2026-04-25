import { useEffect, useState } from "react";

export function useMobileLayout() {
  const [mobileLayout, setMobileLayout] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767.98px)");

    const updateLayout = () => {
      setMobileLayout(mediaQuery.matches);
    };

    updateLayout();
    mediaQuery.addEventListener("change", updateLayout);

    return () => {
      mediaQuery.removeEventListener("change", updateLayout);
    };
  }, []);

  return mobileLayout;
}
