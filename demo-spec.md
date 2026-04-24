# Demo Spec

## Goal

Implement a React demo based on `s.png`.

## Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- dnd-kit

## Layout

- The page has a fixed sidebar on the left side of the screen.
- The sidebar contains three vertically stacked menu items:
  - Map with `MapIcon`
  - Music with `MusicalNoteIcon`
  - Chat with `ChatBubbleBottomCenterIcon`
- Each menu item displays its icon above its label.
- The sidebar is intentionally narrow.
- The rest of the page is a panel area.
- Each visible panel is rendered as a vertical column.
- Each column corresponds to one menu item.
- Each column has a compact tab bar at the top and an otherwise empty content area.

## Interactions

- Clicking a menu item toggles its corresponding column on and off.
- Clicking the close button with `XMarkIcon` in a column tab bar closes that column.
- When a column is closed, the corresponding menu item is shown in gray.
- The tab bars are draggable.
- Dragging a tab bar reorders the columns.
- The sidebar menu order reflects the same order as the columns.

## Responsive Behavior

- The left sidebar remains fixed.
- On small screens, the panel area scrolls horizontally from left to right.
- On small screens, each visible panel column fills the available panel viewport width rather than staying at a narrow fixed width.
- On small screens, horizontal scrolling snaps by panel column.

## Mobile Notes

- On touch devices, tapping the sidebar menu items must reliably toggle their corresponding panels.
- On touch devices, tapping the close button in a panel tab bar must reliably close that panel.
- Touch interactions for toggle, swipe, and close take priority over drag sensitivity on mobile.
- Mobile drag-and-drop is best effort for this demo and may feel less smooth than desktop when combined with horizontal scrolling.

## Development Notes

- When testing the Next.js dev server from a different origin or LAN host, configure `allowedDevOrigins` in `next.config.ts`.
- Without that configuration, cross-origin access to Next.js development resources can be blocked, which can make taps and other client interactions appear broken during mobile testing.

## Current Simplifications

- Panel content is empty for this demo.
- Desktop drag-and-drop works.
- Mobile drag-and-drop is still under investigation on real devices.
