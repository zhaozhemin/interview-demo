"use client";

import { useEffect, useRef, useState } from "react";
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragMoveEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Panel, PanelId } from "@/lib/panels";
import { PanelColumn, PanelColumnPreview } from "@/components/panel-column";

type PanelAreaProps = {
  panels: Panel[];
  onReorder: (event: DragEndEvent) => void;
  onClose: (id: PanelId) => void;
};

export function PanelArea({ panels, onReorder, onClose }: PanelAreaProps) {
  const [activeId, setActiveId] = useState<PanelId | null>(null);
  const [overId, setOverId] = useState<PanelId | null>(null);
  const [coarsePointer, setCoarsePointer] = useState(false);
  const scrollerRef = useRef<HTMLElement | null>(null);
  const scrollVelocityRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);

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

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 120,
        tolerance: 8,
      },
    }),
  );

  const activePanel = activeId
    ? panels.find((panel) => panel.id === activeId) ?? null
    : null;
  const activeIndex = activeId
    ? panels.findIndex((panel) => panel.id === activeId)
    : -1;
  const overIndex = overId ? panels.findIndex((panel) => panel.id === overId) : -1;

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

  const resetDragState = () => {
    stopAutoPan();
    setActiveId(null);
    setOverId(null);
  };

  const handleDragStart = ({ active }: DragStartEvent) => {
    const nextActiveId = active.id as PanelId;
    setActiveId(nextActiveId);
    setOverId(nextActiveId);
  };

  const handleDragOver = ({ over }: DragOverEvent) => {
    setOverId((over?.id as PanelId | null) ?? null);
  };

  const handleDragMove = ({ active, delta }: DragMoveEvent) => {
    if (!coarsePointer || !activeId) {
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
    const startThreshold = 56;
    const stopThreshold = 120;
    const dragThreshold = 28;
    const maxVelocity = 7;
    let nextVelocity = 0;

    if (horizontalDelta < dragThreshold) {
      stopAutoPan();
      return;
    }

    if (centerX > rect.right - startThreshold) {
      const distanceIntoEdge = centerX - (rect.right - startThreshold);
      nextVelocity = Math.min(maxVelocity, (distanceIntoEdge / startThreshold) * maxVelocity);
    } else if (centerX < rect.left + startThreshold) {
      const distanceIntoEdge = rect.left + startThreshold - centerX;
      nextVelocity = -Math.min(maxVelocity, (distanceIntoEdge / startThreshold) * maxVelocity);
    } else if (
      centerX > rect.left + stopThreshold &&
      centerX < rect.right - stopThreshold
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
    return () => {
      stopAutoPan();
    };
  }, []);

  const getDropIndicator = (panelId: PanelId) => {
    if (!coarsePointer || !activeId || !overId || panelId !== overId || activeId === overId) {
      return null;
    }

    return overIndex > activeIndex ? "after" : "before";
  };

  return (
    <section
      ref={scrollerRef}
      className={[
        "ml-28 h-full min-w-0 flex-1 overscroll-x-contain scrollbar-none",
        coarsePointer && activeId ? "overflow-x-hidden touch-none" : "overflow-x-auto",
        activeId ? "" : "snap-x snap-mandatory",
      ].join(" ")}
    >
      <DndContext
        id="panel-area-dnd"
        sensors={sensors}
        autoScroll={false}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragOver={handleDragOver}
        onDragCancel={resetDragState}
        onDragEnd={(event) => {
          resetDragState();
          onReorder(event);
        }}
      >
        <SortableContext
          items={panels.map((panel) => panel.id)}
          strategy={horizontalListSortingStrategy}
        >
          <div className="flex h-full min-w-full w-max">
            {panels.map((panel) => (
              <PanelColumn
                key={panel.id}
                panel={panel}
                onClose={onClose}
                staticDuringDrag={coarsePointer && activeId !== null}
                dropIndicator={getDropIndicator(panel.id)}
                activeId={activeId}
              />
            ))}
          </div>
        </SortableContext>
        {coarsePointer ? (
          <DragOverlay>
            {activePanel ? (
              <div className="w-[calc(100vw-7rem)] md:w-[320px]">
                <PanelColumnPreview panel={activePanel} onClose={onClose} />
              </div>
            ) : null}
          </DragOverlay>
        ) : null}
      </DndContext>
    </section>
  );
}
