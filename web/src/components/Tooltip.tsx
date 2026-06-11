import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface TooltipProps {
  title: string;
  name?: "list" | "card" | "board";
  isFirstList?: boolean;
}

export default function Tooltip({ title, name, isFirstList }: TooltipProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(
    null,
  );
  const [visible, setVisible] = useState(false);

  const getHoverClass = () => {
    if (name === "list") return "group-hover/list:opacity-100";
    if (name === "card") return "group-hover/card:opacity-100";
    if (name === "board") return "group-hover/board:opacity-100";
    return "group-hover:opacity-100";
  };

  useEffect(() => {
    const trigger = containerRef.current;
    if (!trigger) return;

    const parent = trigger.parentElement;
    if (!parent) return;

    const handleMouseEnter = () => {
      const rect = parent.getBoundingClientRect();
      const top = rect.bottom + window.scrollY + 6;

      // eslint-disable-next-line no-useless-assignment
      let left = 0;

      if (
        isFirstList &&
        (name === "card" || name === "list" || name === "board")
      ) {
        left = rect.left + window.scrollX;
      } else {
        left = rect.left + window.scrollX + rect.width / 2;
      }

      setCoords({ top, left });
      setVisible(true);
    };

    const handleMouseLeave = () => {
      setVisible(false);
    };

    parent.addEventListener("mouseenter", handleMouseEnter);
    parent.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      parent.removeEventListener("mouseenter", handleMouseEnter);
      parent.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isFirstList, name]);

  const isLeftPinned =
    isFirstList && (name === "card" || name === "list" || name === "board");

  return (
    <>
      <div
        ref={containerRef}
        className={`pointer-events-none absolute hidden ${getHoverClass()}`}
      />

      {visible &&
        coords &&
        createPortal(
          <div
            style={{
              position: "absolute",
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              transform: isLeftPinned ? "none" : "translateX(-50%)",
              zIndex: 9999,
            }}
            className="pointer-events-none rounded bg-gray-800 px-2 py-1 text-xs whitespace-nowrap text-white opacity-100 shadow-md transition-opacity duration-100 select-none"
          >
            {title}
          </div>,
          document.body,
        )}
    </>
  );
}
