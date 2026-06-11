import { useEffect, useRef, useState } from "react";
import { CloseIcon } from "@/components/Icons";

interface AddCardFormProps {
  onAdd: (content: string) => Promise<void>;
  onClose: () => void;
}

export default function AddCardForm({ onAdd, onClose }: AddCardFormProps) {
  const [cardInput, setCardInput] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  const formRef = useRef<HTMLDivElement | null>(null);
  const divRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (divRef.current) divRef.current.focus();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleSubmit = async () => {
    if (!cardInput.trim() || loading) return;
    try {
      setLoading(true);
      await onAdd(cardInput.trim());

      // Xoá đi div trong DOM vì sử dụng thuộc tính contentEditable
      if (divRef.current) {
        divRef.current.innerText = "";
      }

      setCardInput("");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={formRef}>
      <div className="relative min-h-16 w-full rounded-xl bg-white px-3 py-2 shadow">
        {!cardInput && (
          <span className="pointer-events-none absolute top-2 left-3 text-sm text-gray-400 select-none">
            Nhập tiêu đề hoặc dán liên kết
          </span>
        )}
        <div
          ref={divRef}
          role="textbox"
          contentEditable="true"
          suppressContentEditableWarning
          className="block w-full text-sm wrap-break-word [word-break:break-word] whitespace-pre-wrap text-gray-700 outline-none"
          onInput={(e) => setCardInput(e.currentTarget.innerText || "")}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
            if (e.key === "Escape") {
              onClose();
            }
          }}
        />
      </div>

      <div className="mt-1.5 flex items-center gap-3">
        <button
          className="cursor-pointer rounded-md bg-blue-500 px-2 py-1 text-sm font-medium text-white hover:bg-blue-400"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Đang thêm..." : "Thêm thẻ"}
        </button>
        <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>
          <CloseIcon />
        </button>
      </div>
    </div>
  );
}
