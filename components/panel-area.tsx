import { useMemo, useRef, useState } from "react";
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Panel, PanelId } from "@/lib/panels";
import { PanelColumn } from "@/components/panel-column";
import { PanelColumnPreview } from "@/components/panel-column-preview";
import { useCoarsePointer } from "@/lib/use-coarse-pointer";
import { useHorizontalAutoPan } from "@/lib/use-horizontal-auto-pan";
import { usePanelViewportAnchor } from "@/lib/use-panel-viewport-anchor";

type PanelAreaProps = {
  panels: Panel[];
  onReorder: (event: DragEndEvent) => void;
  onClose: (id: PanelId) => void;
};

export function PanelArea({ panels, onReorder, onClose }: PanelAreaProps) {
  const [activeId, setActiveId] = useState<PanelId | null>(null);
  const [overId, setOverId] = useState<PanelId | null>(null);
  const coarsePointer = useCoarsePointer();
  const scrollerRef = useRef<HTMLElement | null>(null);

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
  const sortableItems = useMemo(() => panels.map((panel) => panel.id), [panels]);
  const activeIndex = activeId
    ? panels.findIndex((panel) => panel.id === activeId)
    : -1;
  const overIndex = overId ? panels.findIndex((panel) => panel.id === overId) : -1;
  const { handleDragMove, stopAutoPan } = useHorizontalAutoPan({
    enabled: coarsePointer && activeId !== null,
    scrollerRef,
  });

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

  const getDropIndicator = (panelId: PanelId) => {
    if (!coarsePointer || !activeId || !overId || panelId !== overId || activeId === overId) {
      return null;
    }

    return overIndex > activeIndex ? "after" : "before";
  };

  usePanelViewportAnchor({
    enabled: coarsePointer && activeId === null,
    panels,
    scrollerRef,
  });

  return (
    <section
      ref={scrollerRef}
      className={[
        "ml-[var(--sidebar-width)] h-full min-w-0 flex-1 overscroll-x-contain scrollbar-none",
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
          items={sortableItems}
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
              <div className="w-[var(--panel-mobile-width)] md:w-[var(--panel-desktop-width)]">
                <PanelColumnPreview panel={activePanel} onClose={onClose} />
              </div>
            ) : null}
          </DragOverlay>
        ) : null}
      </DndContext>
    </section>
  );
}
