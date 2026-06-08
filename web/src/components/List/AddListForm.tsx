import { useEffect, useRef, useState } from "react";
import { CloseIcon } from "../Icons";

interface AddListFormProps {
  onAdd: (title: string) => Promise<void>;
  onClose: () => void;
}

export default function AddListForm({ onAdd, onClose }: AddListFormProps) {
  const [listInput, setListInput] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const boxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleSubmit = async () => {
    if (!listInput.trim() || loading) return;
    try {
      setLoading(true);
      await onAdd(listInput.trim());
      setListInput("");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={boxRef}
      className="min-w-(--list-box-width) rounded-xl bg-white p-2 shadow"
    >
      <input
        className="w-full rounded-sm border border-gray-400 px-2 py-1 text-sm text-gray-600 outline-none"
        placeholder="Nhập tên danh sách..."
        value={listInput}
        autoFocus
        onChange={(e) => setListInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSubmit();
          }
          if (e.key === "Escape") {
            onClose();
          }
        }}
      />
      <div className="mt-1.5 flex items-center gap-3">
        <button
          className="cursor-pointer rounded-md bg-blue-500 px-2 py-1 text-sm font-medium text-white hover:bg-blue-400"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Đang thêm..." : "Thêm danh sách"}
        </button>
        <button onClick={onClose} className="cursor-pointer text-gray-500">
          <CloseIcon />
        </button>
      </div>
    </div>
  );
}
