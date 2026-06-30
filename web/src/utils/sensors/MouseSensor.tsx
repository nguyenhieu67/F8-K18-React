import { MouseSensor as LibMouseSensor } from "@dnd-kit/core";
import type { MouseEvent } from "react";

// Custom sensor class — chặn drag nếu pointerdown nằm trong vùng data-no-dnd
class MouseSensor extends LibMouseSensor {
  static activators = [
    {
      eventName: "onMouseDown" as const,
      handler: ({ nativeEvent: event }: MouseEvent) => {
        return shouldHandleEvent(event.target as HTMLElement);
      },
    },
  ];
}

function shouldHandleEvent(target: HTMLElement | null) {
  let current = target;

  while (current) {
    if (current.dataset?.noDnd === "true" || current.isContentEditable) {
      return false;
    }
    current = current.parentElement;
  }

  return true;
}

export { MouseSensor };