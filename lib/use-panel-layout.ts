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
      const visiblePanels = current.filter((panel) => openIds.includes(panel.id));
      const oldIndex = visiblePanels.findIndex((panel) => panel.id === active.id);
      const newIndex = visiblePanels.findIndex((panel) => panel.id === over.id);

      if (oldIndex === -1 || newIndex === -1) {
        return current;
      }

      const reorderedVisiblePanels = arrayMove(visiblePanels, oldIndex, newIndex);
      let nextVisibleIndex = 0;

      return current.map((panel) =>
        openIds.includes(panel.id) ? reorderedVisiblePanels[nextVisibleIndex++] : panel,
      );
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
