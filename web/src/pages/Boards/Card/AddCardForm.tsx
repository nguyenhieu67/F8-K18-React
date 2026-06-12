import { useEffect, useRef, useState } from "react";
import { ClickAwayListener } from "@mui/material";

import { CloseIcon } from "@/components/Icons";
import { useTheme } from "@/context/ThemeContext";

interface AddCardFormProps {
  onAdd: (content: string) => Promise<void>;
  onClickOutSize: (content: string) => Promise<void>;
  onClose: () => void;
}

export default function AddCardForm({
  onAdd,
  onClickOutSize,
  onClose,
}: AddCardFormProps) {
  const [cardInput, setCardInput] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  const { theme } = useTheme();

  const divRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (divRef.current) divRef.current.focus();
  }, []);

  const handleSubmit = async () => {
    if (!cardInput.trim() || loading) return;
    try {
      setLoading(true);
      await onAdd(cardInput.trim());

      // Xoá đi div trong DOM vì sử dụng thuộc tính contentEditable
      if (divRef.current) {
        divRef.current.innerText = "";
        divRef.current.focus();
      }

      setCardInput("");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ClickAwayListener
      onClickAway={() => {
        if (cardInput.length > 0) {
          if (!cardInput.trim()) return;
          onClickOutSize(cardInput.trim());
        }
        onClose();
      }}
    >
      <div>
        <div className="bg-trello-card-bg relative min-h-16 w-full rounded-xl px-3 py-2 shadow">
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
            className="text-trello-listCard-text block w-full text-sm wrap-break-word [word-break:break-word] whitespace-pre-wrap outline-none"
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
            className="text-trello-button-text cursor-pointer rounded-md bg-blue-500 px-2 py-1 text-sm font-medium hover:bg-blue-400"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Đang thêm..." : "Thêm thẻ"}
          </button>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <CloseIcon
              iconColor={`${theme === "dark" ? "#a9abaf" : "#505258"}`}
            />
          </button>
        </div>
      </div>
    </ClickAwayListener>
  );
}
