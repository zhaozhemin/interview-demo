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
- The sidebar contains three text-only menu items:
  - Map
  - Music
  - Chat
- The rest of the page is a panel area.
- Each visible panel is rendered as a vertical column.
- Each column corresponds to one menu item.
- Each column has a tab bar at the top and an otherwise empty content area.

## Interactions

- Clicking a menu item toggles its corresponding column on and off.
- Clicking the `x` button in a column tab bar closes that column.
- When a column is closed, the corresponding menu item is shown in gray.
- The tab bars are draggable.
- Dragging a tab bar reorders the columns.
- The sidebar menu order reflects the same order as the columns.

## Responsive Behavior

- The left sidebar remains fixed.
- On small screens, the panel area scrolls horizontally from left to right.

## Current Simplifications

- Menu item icons are omitted for now.
- Panel content is empty for this demo.
