import { useState } from "react";
import type { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { panels, type Panel, type PanelId } from "@/lib/panels";

export function usePanelLayout() {
  const [orderedPanels, setOrderedPanels] = useState(panels);
  const [openIds, setOpenIds] = useState<PanelId[]>(panels.map((panel) => panel.id));

  const togglePanel = (id: PanelId) => {
    setOpenIds((current) =>
      current.includes(id)
        ? current.filter((panelId) => panelId !== id)
        : [...current, id],
    );
  };

  const closePanel = (id: PanelId) => {
    setOpenIds((current) => current.filter((panelId) => panelId !== id));
  };

  const reorderPanels = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) {
      return;
    }

    setOrderedPanels((current) => {
      const oldIndex = current.findIndex((panel) => panel.id === active.id);
      const newIndex = current.findIndex((panel) => panel.id === over.id);

      return arrayMove(current, oldIndex, newIndex);
    });
  };

  const visiblePanels: Panel[] = orderedPanels.filter((panel) => openIds.includes(panel.id));

  return {
    orderedPanels,
    openIds,
    visiblePanels,
    togglePanel,
    closePanel,
    reorderPanels,
  };
}
