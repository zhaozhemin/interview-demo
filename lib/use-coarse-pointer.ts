import { useEffect, useState } from "react";

export function useCoarsePointer() {
  const [coarsePointer, setCoarsePointer] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(pointer: coarse)");

    const updatePointerType = () => {
      setCoarsePointer(mediaQuery.matches);
    };

    updatePointerType();
    mediaQuery.addEventListener("change", updatePointerType);

    return () => {
      mediaQuery.removeEventListener("change", updatePointerType);
    };
  }, []);

  return coarsePointer;
}
