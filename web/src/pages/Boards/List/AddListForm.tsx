import { useRef, useState } from "react";
import { ClickAwayListener } from "@mui/material";

import { CloseIcon } from "@/components/Icons";
import { useTheme } from "@/context/ThemeContext";

interface AddListFormProps {
  value: string;
  onChange: (value: string) => void;
  onAdd: (title: string) => Promise<void>;
  onClose: () => void;
}

export default function AddListForm({
  value,
  onChange,
  onAdd,
  onClose,
}: AddListFormProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { theme } = useTheme();

  const handleSubmit = async () => {
    if (!value.trim() || loading) return;
    try {
      setLoading(true);
      await onAdd(value.trim());
      onChange("");
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ClickAwayListener
      onClickAway={() => {
        onClose();
      }}
    >
      <div className="bg-trello-list-bg min-w-(--list-box-width) rounded-xl p-2 shadow">
        <input
          ref={inputRef}
          className="text-trello-listCard-text w-full rounded-sm px-2 py-1 text-sm shadow-[inset_0_0_0_1px_rgb(140,141,151)] outline-none focus:shadow-[0_0_0_2px_rgb(0,121,191)]"
          placeholder="Nhập tên danh sách..."
          value={value}
          autoFocus
          onChange={(e) => onChange(e.target.value)}
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
            className={`text-trello-button-text cursor-pointer rounded-md bg-[#1868db] px-2 py-1 text-sm font-medium hover:bg-blue-400 dark:bg-[#669df1]`}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Đang thêm..." : "Thêm danh sách"}
          </button>
          <button onClick={onClose} className="cursor-pointer">
            <CloseIcon
              iconColor={`${theme === "dark" ? "#a9abaf" : "#505258"}`}
            />
          </button>
        </div>
      </div>
    </ClickAwayListener>
  );
}
