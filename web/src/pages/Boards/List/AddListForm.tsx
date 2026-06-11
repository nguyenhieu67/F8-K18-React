import { useState } from "react";
import { ClickAwayListener } from "@mui/material";

import { CloseIcon } from "@/components/Icons";
import { useTheme } from "@/context/ThemeContext";

interface AddListFormProps {
  onAdd: (title: string) => Promise<void>;
  onClose: () => void;
}

export default function AddListForm({ onAdd, onClose }: AddListFormProps) {
  const [listInput, setListInput] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  const { theme } = useTheme();

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
    <ClickAwayListener onClickAway={() => onClose()}>
      <div className="bg-trello-list-bg min-w-(--list-box-width) rounded-xl p-2 shadow">
        <input
          className="text-trello-listCard-text w-full rounded-sm border border-gray-400 px-2 py-1 text-sm outline-none"
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
