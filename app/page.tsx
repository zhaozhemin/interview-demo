"use client";

import { PanelArea } from "@/components/panel-area";
import { Sidebar } from "@/components/sidebar";
import { usePanelLayout } from "@/lib/use-panel-layout";

export default function Home() {
  const {
    orderedPanels,
    openIds,
    visiblePanels,
    panelFocusRequest,
    togglePanel,
    closePanel,
    reorderPanels,
  } = usePanelLayout();

  return (
    <main className="h-screen overflow-hidden bg-white text-black">
      <div className="flex h-full">
        <Sidebar panels={orderedPanels} openIds={openIds} onToggle={togglePanel} />
        <PanelArea
          panels={visiblePanels}
          panelFocusRequest={panelFocusRequest}
          onReorder={reorderPanels}
          onClose={closePanel}
        />
      </div>
    </main>
  );
}
