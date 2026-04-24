import type { Panel, PanelId } from "@/lib/panels";
import { PanelColumnFrame } from "@/components/panel-column-frame";

type PanelColumnPreviewProps = {
  panel: Panel;
  onClose: (id: PanelId) => void;
};

export function PanelColumnPreview({
  panel,
  onClose,
}: PanelColumnPreviewProps) {
  return <PanelColumnFrame panel={panel} onClose={onClose} isOverlay />;
}
