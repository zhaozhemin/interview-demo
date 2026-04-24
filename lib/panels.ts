export type PanelId = "map" | "music" | "chat";

export type Panel = {
  id: PanelId;
  label: string;
};

export const panels: Panel[] = [
  { id: "map", label: "Map" },
  { id: "music", label: "Music" },
  { id: "chat", label: "Chat" },
];
