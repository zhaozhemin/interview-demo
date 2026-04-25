import { useState } from "react";
import type { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { panels, type Panel, type PanelId } from "@/lib/panels";

export type PanelFocusRequest = {
  id: PanelId;
  sequence: number;
};

export function usePanelLayout() {
  const [orderedPanels, setOrderedPanels] = useState(panels);
  const [openIds, setOpenIds] = useState<PanelId[]>(panels.map((panel) => panel.id));
  const [panelFocusRequest, setPanelFocusRequest] =
    useState<PanelFocusRequest | null>(null);

  const requestPanelFocus = (id: PanelId) => {
    setPanelFocusRequest((request) => ({
      id,
      sequence: (request?.sequence ?? 0) + 1,
    }));
  };

  const togglePanel = (id: PanelId) => {
    if (openIds.includes(id)) {
      setOpenIds((current) => current.filter((panelId) => panelId !== id));
    } else {
      requestPanelFocus(id);
      setOpenIds((current) => [...current, id]);
    }
  };

  const closePanel = (id: PanelId) => {
    setOpenIds((current) => current.filter((panelId) => panelId !== id));
  };

  const reorderPanels = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) {
      return;
    }

    const activePanelId = active.id as PanelId;
    const overPanelId = over.id as PanelId;
    const currentVisiblePanels = orderedPanels.filter((panel) =>
      openIds.includes(panel.id),
    );
    const oldIndex = currentVisiblePanels.findIndex(
      (panel) => panel.id === activePanelId,
    );
    const newIndex = currentVisiblePanels.findIndex(
      (panel) => panel.id === overPanelId,
    );

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    requestPanelFocus(activePanelId);

    setOrderedPanels((current) => {
      const reorderedVisiblePanels = arrayMove(
        currentVisiblePanels,
        oldIndex,
        newIndex,
      );
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
    panelFocusRequest,
    togglePanel,
    closePanel,
    reorderPanels,
  };
}
