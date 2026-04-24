import type { HTMLAttributes } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import type { Panel, PanelId } from "@/lib/panels";

export type DropIndicator = "before" | "after" | null;

type PanelColumnFrameProps = {
  panel: Panel;
  onClose: (id: PanelId) => void;
  headerProps?: HTMLAttributes<HTMLElement>;
  dropIndicator?: DropIndicator;
  sourceVisible?: boolean;
  isOverlay?: boolean;
  isDragging?: boolean;
};

export function PanelColumnFrame({
  panel,
  onClose,
  headerProps,
  dropIndicator = null,
  sourceVisible = true,
  isOverlay = false,
  isDragging = false,
}: PanelColumnFrameProps) {
  return (
    <section
      className={[
        "relative flex h-full min-w-[var(--panel-mobile-width)] snap-start flex-col border-l border-r border-[var(--line)] bg-white first:border-l md:-mr-px md:min-w-[var(--panel-desktop-width)] md:flex-1",
        dropIndicator === "before"
          ? "before:absolute before:inset-y-0 before:left-0 before:w-1 before:-translate-x-1/2 before:bg-black"
          : "",
        dropIndicator === "after"
          ? "after:absolute after:inset-y-0 after:right-0 after:w-1 after:translate-x-1/2 after:bg-black"
          : "",
        sourceVisible ? "" : "opacity-30",
        isOverlay
          ? "shadow-2xl ring-1 ring-black/10 [backface-visibility:hidden]"
          : "",
        isDragging ? "md:overflow-hidden md:rounded-3xl" : "",
      ].join(" ")}
    >
      <header
        {...headerProps}
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
