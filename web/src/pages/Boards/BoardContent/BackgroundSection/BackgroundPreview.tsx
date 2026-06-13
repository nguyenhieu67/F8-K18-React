import { CheckIcon } from "@/components/Icons";

interface Item {
  id: number | string;
  value: string;
}

interface Props {
  items: Item[];
  imgClass: string;
  limit?: number | null;
  type?: "image" | "color";
  selectedId: string | number | null;
  onSelect: (id: string | number) => void;
}

export default function BackgroundPreview({
  items,
  imgClass,
  limit = null,
  type = "color",
  selectedId,
  onSelect,
}: Props) {
  const displayItems = limit ? items.slice(0, limit) : items;

  return (
    <>
      {displayItems.map((item) => (
        <li key={item.id} className={`${imgClass} list-none`}>
          <button
            onClick={() => onSelect(item.id)}
            style={{
              backgroundImage:
                type === "image"
                  ? item.value.startsWith("data:image")
                    ? `url("${item.value}")`
                    : `url(${item.value})`
                  : undefined,
            }}
            className={`relative flex h-full w-full cursor-pointer items-center justify-center rounded-lg shadow transition-transform hover:scale-105 ${
              type === "color"
                ? `${item.value ? item.value : "bg-[#0515240f]"}`
                : "bg-cover bg-center"
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
