import { useLayoutEffect, useRef, type RefObject } from "react";
import type { Panel } from "@/lib/panels";

type UsePanelViewportAnchorOptions = {
  enabled: boolean;
  panels: Panel[];
  scrollerRef: RefObject<HTMLElement | null>;
};

export function usePanelViewportAnchor({
  enabled,
  panels,
  scrollerRef,
}: UsePanelViewportAnchorOptions) {
  const previousPanelsRef = useRef(panels);
  const currentPanelIdRef = useRef(panels[0]?.id ?? null);

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;

    if (!enabled || !scroller || panels.length === 0) {
      currentPanelIdRef.current = panels[0]?.id ?? null;
      return;
    }

    const updateCurrentPanel = () => {
      const panelWidth = scroller.clientWidth;

      if (panelWidth === 0) {
        return;
      }

      const currentIndex = Math.max(
        0,
        Math.min(panels.length - 1, Math.round(scroller.scrollLeft / panelWidth)),
      );

      currentPanelIdRef.current = panels[currentIndex]?.id ?? null;
    };

    updateCurrentPanel();
    scroller.addEventListener("scroll", updateCurrentPanel, { passive: true });

    return () => {
      scroller.removeEventListener("scroll", updateCurrentPanel);
    };
  }, [enabled, panels, scrollerRef]);

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    const previousPanels = previousPanelsRef.current;

    if (!enabled || !scroller || previousPanels === panels) {
      previousPanelsRef.current = panels;
      return;
    }

    const panelWidth = scroller.clientWidth;

    if (panelWidth === 0 || previousPanels.length === 0) {
      previousPanelsRef.current = panels;
      return;
    }

    const nextIndex = currentPanelIdRef.current
      ? panels.findIndex((panel) => panel.id === currentPanelIdRef.current)
      : -1;

    if (nextIndex >= 0) {
      scroller.scrollLeft = nextIndex * panelWidth;
      currentPanelIdRef.current = panels[nextIndex]?.id ?? null;
    } else {
      scroller.scrollLeft = Math.min(scroller.scrollLeft, scroller.scrollWidth - panelWidth);
      const clampedIndex = Math.max(
        0,
        Math.min(panels.length - 1, Math.round(scroller.scrollLeft / panelWidth)),
      );
      currentPanelIdRef.current = panels[clampedIndex]?.id ?? null;
    }

    previousPanelsRef.current = panels;
  }, [enabled, panels, scrollerRef]);
}
