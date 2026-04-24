"use client";

import {
  DndContext,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Panel, PanelId } from "@/lib/panels";
import { PanelColumn } from "@/components/panel-column";

type PanelAreaProps = {
  panels: Panel[];
  onReorder: (event: DragEndEvent) => void;
  onClose: (id: PanelId) => void;
};

export function PanelArea({ panels, onReorder, onClose }: PanelAreaProps) {
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 120,
        tolerance: 12,
      },
    }),
  );

  return (
    <section className="ml-28 h-full min-w-0 flex-1 overflow-x-auto scrollbar-none">
      <DndContext
        id="panel-area-dnd"
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onReorder}
      >
        <SortableContext
          items={panels.map((panel) => panel.id)}
          strategy={horizontalListSortingStrategy}
        >
          <div className="flex h-full min-w-full w-max">
            {panels.map((panel) => (
              <PanelColumn key={panel.id} panel={panel} onClose={onClose} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </section>
  );
}
