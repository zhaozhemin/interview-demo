import { useEffect, useRef, type RefObject } from "react";
import type { DragMoveEvent } from "@dnd-kit/core";

const START_THRESHOLD = 56;
const STOP_THRESHOLD = 120;
const DRAG_THRESHOLD = 28;
const MAX_VELOCITY = 7;

type UseHorizontalAutoPanOptions = {
  enabled: boolean;
  scrollerRef: RefObject<HTMLElement | null>;
};

export function useHorizontalAutoPan({
  enabled,
  scrollerRef,
}: UseHorizontalAutoPanOptions) {
  const scrollVelocityRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);

  const stopAutoPan = () => {
    scrollVelocityRef.current = 0;

    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };

  const startAutoPan = () => {
    if (animationFrameRef.current !== null) {
      return;
    }

    const tick = () => {
      const scroller = scrollerRef.current;
      const velocity = scrollVelocityRef.current;

      if (!scroller || velocity === 0) {
        animationFrameRef.current = null;
        return;
      }

      scroller.scrollLeft += velocity;
      animationFrameRef.current = requestAnimationFrame(tick);
    };

    animationFrameRef.current = requestAnimationFrame(tick);
  };

  const handleDragMove = ({ active, delta }: DragMoveEvent) => {
    if (!enabled) {
      return;
    }

    const scroller = scrollerRef.current;
    const translated = active.rect.current.translated;
    const horizontalDelta = Math.abs(delta.x);

    if (!scroller || !translated) {
      return;
    }

    const rect = scroller.getBoundingClientRect();
    const centerX = translated.left + translated.width / 2;
    let nextVelocity = 0;

    if (horizontalDelta < DRAG_THRESHOLD) {
      stopAutoPan();
      return;
    }

    if (centerX > rect.right - START_THRESHOLD) {
      const distanceIntoEdge = centerX - (rect.right - START_THRESHOLD);
      nextVelocity = Math.min(
        MAX_VELOCITY,
        (distanceIntoEdge / START_THRESHOLD) * MAX_VELOCITY,
      );
    } else if (centerX < rect.left + START_THRESHOLD) {
      const distanceIntoEdge = rect.left + START_THRESHOLD - centerX;
      nextVelocity = -Math.min(
        MAX_VELOCITY,
        (distanceIntoEdge / START_THRESHOLD) * MAX_VELOCITY,
      );
    } else if (
      centerX > rect.left + STOP_THRESHOLD &&
      centerX < rect.right - STOP_THRESHOLD
    ) {
      nextVelocity = 0;
    }

    scrollVelocityRef.current = nextVelocity;

    if (nextVelocity === 0) {
      stopAutoPan();
      return;
    }

    startAutoPan();
  };

  useEffect(() => {
    return stopAutoPan;
  }, []);

  return {
    handleDragMove,
    stopAutoPan,
  };
}
