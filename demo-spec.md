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
- The mobile panel behavior is driven by the responsive layout breakpoint, not by pointer type. A narrow desktop browser window should use the same one-panel-per-page scroll logic as a mobile device.
- The current mobile breakpoint is the Tailwind `md` boundary: below `768px`.

## Mobile Scroll Anchoring

- Mobile scroll anchoring is handled explicitly because browsers differ in how they preserve or clamp `scrollLeft` when columns are added or removed, especially Safari.
- When a closed panel is opened from the sidebar, focus moves to that newly opened panel.
- The opened panel scroll target is computed from its position in the current visible panel list:
  - `scrollLeft = visibleIndex * scroller.clientWidth`
- When a visible panel is closed, the hook preserves the previously focused panel if it still exists.
- If the previously focused panel was the panel that closed, focus moves to the nearest remaining panel index.
- Previous focus is derived from the last known mobile scroll offset:
  - `previousFocusedIndex = round(lastScrollLeft / panelWidth)`
  - the index is clamped into the previous visible panel list to tolerate fractional offsets, resize, and stale browser scroll values.
- Scroll correction that writes `scrollLeft` must run in a layout effect so the browser does not paint an intermediate jump.
- Passive scroll tracking and updating the previous panel list can use normal effects because they do not need to block paint.

## Mobile Notes

- On touch devices, tapping the sidebar menu items must reliably toggle their corresponding panels.
- On touch devices, tapping the close button in a panel tab bar must reliably close that panel.
- Touch interactions for toggle, swipe, and close take priority over drag sensitivity on mobile.
- On touch devices, drag-and-drop uses a different interaction model than desktop:
  - The visible list stays visually static during drag.
  - The dragged panel is rendered in an overlay.
  - The original slot remains in place and is dimmed while dragging.
  - A full-height before/after indicator marks the current drop target.
  - Scroll snapping is disabled only while a drag is active.
- On touch devices, horizontal movement during drag uses controlled edge auto-pan instead of native momentum scrolling:
  - Auto-pan starts only after a deliberate horizontal drag.
  - Auto-pan speed is capped to keep scrolling readable and easier to stop.
- Mobile drag-and-drop is still best effort for this demo and may feel less smooth than desktop when combined with horizontal scrolling.

## Desktop Notes

- On fine-pointer devices, drag-and-drop keeps the default sortable behavior where sibling columns move live during drag.
- The actively dragged desktop column uses a stronger shadow and rounder corners.
- Each column renders both left and right borders so the adjacent column still shows a visible edge when another column is dragged away.

## Development Notes

- When testing the Next.js dev server from a different origin or LAN host, configure `allowedDevOrigins` in `next.config.ts`.
- Without that configuration, cross-origin access to Next.js development resources can be blocked, which can make taps and other client interactions appear broken during mobile testing.

## Current Simplifications

- Panel content is empty for this demo.
- Desktop drag-and-drop works.
- Mobile drag-and-drop uses a separate implementation path from desktop and still needs validation on real devices.

## Implementation Notes

- `app/page.tsx` is the client boundary for the interactive UI.
- Nested components and hooks do not declare `"use client"` unless they need to be imported directly from a server component entry.
- Page-level panel state lives in `usePanelLayout`, which owns:
  - panel order
  - open/closed panel state
  - panel toggle and close actions
  - drag-end reorder handling
  - the derived visible panel list
- `PanelArea` keeps drag lifecycle orchestration, while smaller extracted units own focused behavior:
  - `PanelColumnFrame` renders the shared panel shell and tab bar
  - `PanelColumnPreview` renders the drag overlay preview
  - `useMobileLayout` owns breakpoint detection for the mobile layout path
  - `useMobilePanelScrollAnchor` owns mobile panel scroll reconciliation for opening, closing, and cross-browser `scrollLeft` behavior
  - `useHorizontalAutoPan` owns mobile edge auto-pan
- `usePanelLayout` emits an `openFocusRequest` with a monotonically increasing `sequence` whenever a closed panel is opened. The sequence lets the scroll anchor hook handle repeated opens of the same panel id across time.
- `useMobilePanelScrollAnchor` intentionally separates its effects:
  - a normal effect tracks the latest `scrollLeft`
  - a layout effect performs pre-paint scroll correction after visible panels change
  - a normal effect records the current panel list for the next comparison
- Shared layout sizing is centralized in CSS custom properties in `app/globals.css`:
  - `--sidebar-width`
  - `--panel-mobile-width`
  - `--panel-desktop-width`
- Sidebar width, panel width, and panel-area offset should reference those variables instead of repeating hard-coded values.
