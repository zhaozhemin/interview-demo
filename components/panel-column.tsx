import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Panel, PanelId } from "@/lib/panels";
import { PanelColumnFrame, type DropIndicator } from "@/components/panel-column-frame";

type PanelColumnProps = {
  panel: Panel;
  onClose: (id: PanelId) => void;
  staticDuringDrag?: boolean;
  dropIndicator?: DropIndicator;
  activeId?: PanelId | null;
};

export function PanelColumn({
  panel,
  onClose,
  staticDuringDrag = false,
  dropIndicator = null,
  activeId = null,
}: PanelColumnProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: panel.id });

  const style = staticDuringDrag
    ? undefined
    : {
        transform: CSS.Transform.toString(transform),
        transition,
      };

  const className = [
    "flex h-full min-w-[var(--panel-mobile-width)] snap-start md:min-w-[var(--panel-desktop-width)] md:flex-1",
    staticDuringDrag
      ? ""
      : isDragging
        ? "z-10 overflow-hidden opacity-85 shadow-xl md:rounded-3xl"
        : "",
  ].join(" ");

  return (
    <div ref={setNodeRef} style={style} className={className}>
      <PanelColumnFrame
        panel={panel}
        onClose={onClose}
        headerProps={{ ...attributes, ...listeners }}
        dropIndicator={dropIndicator}
        sourceVisible={!staticDuringDrag || activeId !== panel.id}
        isDragging={!staticDuringDrag && isDragging}
      />
    </div>
  );
}
