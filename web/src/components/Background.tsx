import { CheckIcon } from "./Icons";

interface Item {
  id: number | string;
  value: string;
}

interface Props {
  items: Item[];
  type: "image" | "color";
  imgWidth?: string;
  imgHeight?: string;
  selectedId: string | number | null;
  onSelect: (id: string | number) => void;
}

export default function Background({
  items,
  type,
  imgWidth = "16",
  imgHeight = "10",
  selectedId,
  onSelect,
}: Props) {
  return (
    <>
      {items.map((item) => (
        <li key={item.id} className={`h-${imgHeight} w-${imgWidth}`}>
          <button
            onClick={() => onSelect(item.id)}
            style={{
              backgroundImage:
                type === "image" ? `url(${item.value})` : undefined,
            }}
            className={`relative flex h-full w-full cursor-pointer items-center justify-center rounded-lg shadow transition-transform hover:scale-105 ${
              type === "color" ? item.value : "bg-cover bg-center"
            }`}
          >
            {selectedId === item.id && (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/30 backdrop-blur-sm">
                <CheckIcon width="12" height="12" />
              </span>
            )}
          </button>
        </li>
      ))}
    </>
  );
}
