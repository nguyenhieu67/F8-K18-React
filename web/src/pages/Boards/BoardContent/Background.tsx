import { CheckIcon } from "@/components/Icons";

interface Item {
  id: number | string;
  value: string;
}

interface Props {
  items: Item[];
  type: "image" | "color";
  imgClass: string;
  selectedId: string | number | null;
  onSelect: (id: string | number) => void;
}

export default function Background({
  items,
  type,
  imgClass,
  selectedId,
  onSelect,
}: Props) {
  return (
    <>
      {items.map((item) => (
        <li key={item.id} className={`${imgClass}`}>
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
                <CheckIcon size="12" />
              </span>
            )}
          </button>
        </li>
      ))}
    </>
  );
}
