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
import type { PanelFocusRequest } from "@/lib/use-panel-layout";
import { PanelColumn } from "@/components/panel-column";
import { PanelColumnPreview } from "@/components/panel-column-preview";
import { useHorizontalAutoPan } from "@/lib/use-horizontal-auto-pan";
import { useMobilePanelScrollAnchor } from "@/lib/use-mobile-panel-scroll-anchor";
import { useMobileLayout } from "@/lib/use-mobile-layout";

type PanelAreaProps = {
  panels: Panel[];
  panelFocusRequest: PanelFocusRequest | null;
  onReorder: (event: DragEndEvent) => void;
  onClose: (id: PanelId) => void;
};

export function PanelArea({
  panels,
  panelFocusRequest,
  onReorder,
  onClose,
}: PanelAreaProps) {
  const [activeId, setActiveId] = useState<PanelId | null>(null);
  const [overId, setOverId] = useState<PanelId | null>(null);
  const mobileLayout = useMobileLayout();
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
    enabled: mobileLayout && activeId !== null,
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
    if (!mobileLayout || !activeId || !overId || panelId !== overId || activeId === overId) {
      return null;
    }

    return overIndex > activeIndex ? "after" : "before";
  };

  useMobilePanelScrollAnchor({
    enabled: mobileLayout && activeId === null,
    panels,
    panelFocusRequest,
    scrollerRef,
  });

  return (
    <section
      ref={scrollerRef}
      className={[
        "ml-[var(--sidebar-width)] h-full min-w-0 flex-1 overscroll-x-contain scrollbar-none",
        mobileLayout && activeId ? "overflow-x-hidden touch-none" : "overflow-x-auto",
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
                staticDuringDrag={mobileLayout && activeId !== null}
                dropIndicator={getDropIndicator(panel.id)}
                activeId={activeId}
              />
            ))}
          </div>
        </SortableContext>
        {mobileLayout ? (
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
