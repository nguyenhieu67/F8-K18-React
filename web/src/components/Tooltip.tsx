interface TooltipProps {
  title: string;
  name?: "list" | "card" | "board";
  isFirstList?: boolean;
}

export default function Tooltip({ title, name, isFirstList }: TooltipProps) {
  const getHoverClass = () => {
    if (name === "list") return "group-hover/list:opacity-100";
    if (name === "card") return "group-hover/card:opacity-100";
    if (name === "board") return "group-hover/board:opacity-100";
    return "group-hover:opacity-100";
  };

  const positionClass =
    (name === "card" || name === "list" || name === "board") && isFirstList
      ? "left-0 translate-x-0"
      : "left-1/2 -translate-x-1/2";

  return (
    <span
      className={`pointer-events-none absolute top-full z-10 mt-1 rounded bg-gray-800 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 shadow-md transition-opacity duration-100 select-none ${positionClass} ${getHoverClass()}`}
    >
      {title}
    </span>
  );
}
