import {
  ChatBubbleBottomCenterIcon,
  MapIcon,
  MusicalNoteIcon,
} from "@heroicons/react/24/outline";
import type { Panel, PanelId } from "@/lib/panels";

type SidebarProps = {
  panels: Panel[];
  openIds: PanelId[];
  onToggle: (id: PanelId) => void;
};

export function Sidebar({ panels, openIds, onToggle }: SidebarProps) {
  const icons = {
    map: MapIcon,
    music: MusicalNoteIcon,
    chat: ChatBubbleBottomCenterIcon,
  } as const;

  return (
    <aside className="fixed left-0 top-0 flex h-screen w-[var(--sidebar-width)] flex-col border-r border-[var(--line)] bg-white px-2 py-8">
      <nav className="flex flex-col gap-6">
        {panels.map((panel) => {
          const isOpen = openIds.includes(panel.id);
          const Icon = icons[panel.id];

          return (
            <button
              key={panel.id}
              type="button"
              onClick={() => onToggle(panel.id)}
              className={[
                "flex flex-col items-center gap-1 text-center text-[15px] leading-none transition-colors",
                isOpen ? "text-black" : "text-[var(--muted)]",
              ].join(" ")}
            >
              <Icon aria-hidden className="size-6 shrink-0" />
              <span>{panel.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
