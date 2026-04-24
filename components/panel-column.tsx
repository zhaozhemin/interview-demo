"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Panel, PanelId } from "@/lib/panels";

type PanelColumnProps = {
  panel: Panel;
  onClose: (id: PanelId) => void;
};

export function PanelColumn({ panel, onClose }: PanelColumnProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: panel.id });

  return (
    <section
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={[
        "flex h-full min-w-[calc(100vw-7rem)] snap-start md:min-w-[320px] md:flex-1 flex-col border-l border-[var(--line)] bg-white",
        isDragging ? "z-10 opacity-85 shadow-xl" : "",
      ].join(" ")}
    >
      <header
        {...attributes}
        {...listeners}
        className="flex h-11 cursor-grab touch-none items-center justify-center border-b border-[var(--line)] bg-[var(--tab)] px-3 md:px-4 active:cursor-grabbing"
      >
        <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-2">
          <div />
          <span className="justify-self-center text-[18px] leading-none text-black">
            {panel.label}
          </span>
          <button
            type="button"
            aria-label={`Close ${panel.label}`}
            className="justify-self-end text-black"
            onTouchStart={(event) => {
              event.stopPropagation();
            }}
            onPointerDown={(event) => {
              event.stopPropagation();
            }}
            onClick={(event) => {
              event.stopPropagation();
              onClose(panel.id);
            }}
          >
            <XMarkIcon aria-hidden className="size-5" />
          </button>
        </div>
      </header>
      <div className="flex-1 bg-white" />
    </section>
  );
}
