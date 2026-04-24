"use client";

import { useState } from "react";
import type { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { PanelArea } from "@/components/panel-area";
import { Sidebar } from "@/components/sidebar";
import { panels, type PanelId } from "@/lib/panels";

export default function Home() {
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

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) {
      return;
    }

    setOrderedPanels((current) => {
      const oldIndex = current.findIndex((panel) => panel.id === active.id);
      const newIndex = current.findIndex((panel) => panel.id === over.id);

      return arrayMove(current, oldIndex, newIndex);
    });
  };

  const visiblePanels = orderedPanels.filter((panel) => openIds.includes(panel.id));

  return (
    <main className="h-screen overflow-hidden bg-white text-black">
      <div className="flex h-full">
        <Sidebar panels={orderedPanels} openIds={openIds} onToggle={togglePanel} />
        <PanelArea
          panels={visiblePanels}
          onReorder={handleDragEnd}
          onClose={closePanel}
        />
      </div>
    </main>
  );
}
