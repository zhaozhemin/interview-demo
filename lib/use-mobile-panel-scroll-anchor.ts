import { useEffect, useLayoutEffect, useRef, type RefObject } from "react";
import type { Panel } from "@/lib/panels";
import type { PanelFocusRequest } from "@/lib/use-panel-layout";

type UseMobilePanelScrollAnchorOptions = {
  enabled: boolean;
  panels: Panel[];
  panelFocusRequest: PanelFocusRequest | null;
  scrollerRef: RefObject<HTMLElement | null>;
};

export function useMobilePanelScrollAnchor({
  enabled,
  panels,
  panelFocusRequest,
  scrollerRef,
}: UseMobilePanelScrollAnchorOptions) {
  const previousPanelsRef = useRef(panels);
  const lastScrollLeftRef = useRef(0);
  const handledFocusSequenceRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const scroller = scrollerRef.current;

    if (!scroller) {
      return;
    }

    const updateScrollLeft = () => {
      lastScrollLeftRef.current = scroller.scrollLeft;
    };

    updateScrollLeft();
    scroller.addEventListener("scroll", updateScrollLeft, { passive: true });

    return () => {
      scroller.removeEventListener("scroll", updateScrollLeft);
    };
  }, [enabled, scrollerRef]);

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    const previousPanels = previousPanelsRef.current;

    if (!enabled || !scroller) {
      return;
    }

    const panelWidth = scroller.clientWidth;

    if (panelWidth === 0) {
      return;
    }

    const scrollToIndex = (index: number) => {
      const nextScrollLeft = index * panelWidth;
      scroller.scrollLeft = nextScrollLeft;
      lastScrollLeftRef.current = nextScrollLeft;
    };

    if (
      panelFocusRequest &&
      handledFocusSequenceRef.current !== panelFocusRequest.sequence
    ) {
      handledFocusSequenceRef.current = panelFocusRequest.sequence;

      const focusedIndex = panels.findIndex(
        (panel) => panel.id === panelFocusRequest.id,
      );

      if (focusedIndex !== -1) {
        scrollToIndex(focusedIndex);
      }

      return;
    }

    if (panels.length < previousPanels.length && panels.length > 0) {
      const previousFocusedIndex = Math.max(
        0,
        Math.min(
          previousPanels.length - 1,
          Math.round(lastScrollLeftRef.current / panelWidth),
        ),
      );
      const previousFocusedId = previousPanels[previousFocusedIndex]?.id;
      const preservedIndex = previousFocusedId
        ? panels.findIndex((panel) => panel.id === previousFocusedId)
        : -1;
      const fallbackIndex = Math.min(previousFocusedIndex, panels.length - 1);

      scrollToIndex(preservedIndex === -1 ? fallbackIndex : preservedIndex);
    }
  }, [enabled, panelFocusRequest, panels, scrollerRef]);

  useEffect(() => {
    previousPanelsRef.current = panels;
  }, [panels]);
}
