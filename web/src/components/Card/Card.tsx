import { useState } from "react";
import type { CardI } from "@/utils/type";
import { EditIcon, CircleIcon, CircleCheckIcon, SavedIcon } from "../Icons";
import Tooltip from "../Tooltip";
import { useTrello } from "@/context/TrelloContext";
import { fetchApi } from "@/utils/api";

interface CardProps {
  card: CardI;
  isFirstList: boolean;
}

export default function Card({ card, isFirstList }: CardProps) {
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState(false);

  const { setCards } = useTrello();

  const handleSavedCard = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isSaving) return;

    try {
      setIsSaving(true);

      await fetchApi.patch(`/cards/${card.id}`, { isSaved: true });

      setCards((prevCards) => prevCards.filter((c) => c.id !== card.id));
    } catch (e) {
      console.error("Lỗi khi lưu danh sách:", e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="group relative flex cursor-pointer items-center justify-between rounded-xl border border-transparent bg-white p-2.5 shadow-sm transition-all duration-150 hover:border-blue-500">
      <div className="flex min-w-0 flex-1 items-center">
        <div
          className={`flex shrink-0 items-center transition-all duration-400 ease-in-out ${
            isCompleted
              ? "w-6 opacity-100"
              : "w-0 opacity-0 group-hover:w-6 group-hover:opacity-100"
          }`}
        >
          <button
            type="button"
            className={`group/card relative cursor-pointer rounded-full`}
            onClick={(e) => {
              e.stopPropagation();
              setIsCompleted(!isCompleted);
            }}
          >
            {isCompleted ? (
              <CircleCheckIcon width="16" height="16" fillColor="#6A9A23" />
            ) : (
              <CircleIcon width="16" height="16" />
            )}
            <Tooltip
              title={
                isCompleted ? "Đánh dấu chưa hoàn thành" : "Đánh dấu hoàn thành"
              }
              name="card"
              isFirstList={isFirstList}
            />
          </button>
        </div>

        <span className=": text-sm wrap-break-word [word-break:break-word] text-gray-700 transition-all duration-200 select-none">
          {card.content}
        </span>
      </div>

      <div className="absolute top-5 right-2 z-10 flex -translate-y-1/2 items-center bg-transparent pl-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
        {isCompleted && (
          <button
            onClick={handleSavedCard}
            className="group/card relative mr-1 cursor-pointer rounded-full border border-gray-300 bg-transparent p-1.5 hover:bg-[#F0F1F2]"
          >
            <SavedIcon width="16" height="16" />
            <Tooltip title="Lưu thẻ này" name="card" />
          </button>
        )}

        <button
          onClick={(e) => e.stopPropagation()}
          className="group/card relative cursor-pointer rounded-full border border-gray-300 bg-transparent p-1.5 hover:bg-[#F0F1F2]"
        >
          <EditIcon width="16" height="16" />
          <Tooltip title="Sửa thẻ này" name="card" />
        </button>
      </div>
    </div>
  );
}
