import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import {
  EditIcon,
  CircleIcon,
  CircleCheckIcon,
  SavedIcon,
} from "@/components/Icons";
import { Tooltip } from "@/components/Tooltip";
import { useTrello } from "@/context/TrelloContext";
import { useTheme } from "@/context/ThemeContext";
import { fetchApi } from "@/utils/api";
import type { CardI } from "@/utils/type";

interface CardProps {
  card: CardI;
}

export default function Card({ card }: CardProps) {
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [mouseIsOver, setMouseIsOver] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editContent, setEditContent] = useState("");

  const { setCards } = useTrello();
  const { theme } = useTheme();

  const editRef = useRef<HTMLDivElement | null>(null);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: {
      type: "Card",
      card,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  useEffect(() => {
    if (editMode && editRef.current) {
      editRef.current.focus();
    }

    if (editMode && editRef.current) {
      const element = editRef.current;

      element.focus();
      element.textContent = card.content;
      setEditContent(card.content);

      try {
        const range = document.createRange();
        range.selectNodeContents(element);
        range.collapse(false);

        const selection = window.getSelection();
        if (selection) {
          selection.removeAllRanges();
          selection.addRange(range);
        }
      } catch (error) {
        console.error("Lỗi khi bôi đen text:", error);
      }
    }
  }, [editMode, card.content]);

  const handleEditCard = async () => {
    if (!editMode) {
      setEditMode(true);
      return;
    }

    if (!editContent.trim()) return;
    try {
      const updatedCard = (await fetchApi.patch(`/cards/${card.id}`, {
        content: editContent,
      })) as CardI;

      setCards((prev) =>
        prev.map((c) =>
          c.id === card.id ? { ...c, content: updatedCard.content } : c,
        ),
      );

      // Xoá đi div trong DOM vì sử dụng thuộc tính contentEditable
      if (editRef.current) {
        editRef.current.innerText = "";
      }

      setEditContent("");
      setEditMode(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleUnSaveCard = async () => {
    toast.info("Chưa lưu trữ thẻ", {
      position: "bottom-left",
      autoClose: 3000,
    });

    await fetchApi.patch(`/cards/${card.id}`, {
      isSaved: false,
    });

    setCards((prevCards) => [...prevCards, { ...card, isSaved: false }]);
  };

  const handleSaveCard = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isSaving) return;

    try {
      setIsSaving(true);

      await fetchApi.patch(`/cards/${card.id}`, { isSaved: true });
      setCards((prevCards) => prevCards.filter((c) => c.id !== card.id));

      toast.success(
        <div>
          <p>Đã lưu thẻ</p>
          <button
            className="mt-3 ml-5 cursor-pointer rounded-md border border-gray-300 px-3 py-1 hover:bg-gray-100"
            onClick={handleUnSaveCard}
          >
            Hoãn
          </button>
        </div>,
        {
          position: "bottom-left",
          autoClose: 3000,
          closeOnClick: true,
        },
      );
    } catch (e) {
      console.error("Lỗi khi lưu danh sách:", e);
    } finally {
      setIsSaving(false);
    }
  };

  if (editMode) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="w-full rounded-xl bg-white p-2"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div
          ref={editRef}
          role="textbox"
          contentEditable="true"
          suppressContentEditableWarning
          data-no-dnd="true"
          className="block min-h-16 w-full rounded-xl border border-blue-500 bg-white px-3 py-2 text-sm wrap-break-word [word-break:break-word] whitespace-pre-wrap text-gray-700 shadow outline-none"
          onInput={(e) => setEditContent(e.currentTarget.innerText || "")}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleEditCard();
            }
          }}
        />
        <div className="mt-1.5 flex justify-end gap-2">
          <button
            onClick={() => {
              if (editRef.current) {
                editRef.current.innerText = "";
              }
              setEditMode(false);
            }}
            className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200"
          >
            Hủy
          </button>
          <button
            onClick={handleEditCard}
            className="rounded-lg bg-blue-500 px-2.5 py-1 text-xs font-medium text-white hover:bg-blue-600"
          >
            Lưu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group bg-trello-card-bg relative flex cursor-pointer items-center justify-between rounded-xl border border-transparent p-2.5 shadow-sm transition-all duration-150 hover:border-blue-500 ${isDragging ? "w-full rounded-xl border border-gray-400 bg-gray-300 opacity-50" : ""}`}
      onMouseEnter={() => !isDragging && setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}
    >
      <div
        className={`flex min-w-0 flex-1 items-center ${isDragging ? "invisible" : ""}`}
      >
        <div
          className={`flex shrink-0 items-center transition-all duration-400 ease-in-out ${
            isCompleted
              ? "w-6 opacity-100"
              : "w-0 opacity-0 group-hover:w-6 group-hover:opacity-100"
          }`}
        >
          <Tooltip
            offset={[0, -1]}
            title={
              isCompleted ? "Đánh dấu chưa hoàn thành" : "Đánh dấu hoàn thành"
            }
          >
            <button
              type="button"
              className="group/card relative cursor-pointer rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                setIsCompleted(!isCompleted);
              }}
            >
              {isCompleted ? (
                <CircleCheckIcon
                  size="16"
                  fillColor={`${theme === "dark" ? "#aee65c" : "#6A9A23"}`}
                />
              ) : (
                <CircleIcon
                  size="16"
                  iconColor={`${theme === "dark" ? "#fff" : "#000"}`}
                  iconClass="opacity-70 hover:opacity-100"
                />
              )}
            </button>
          </Tooltip>
        </div>

        <span className="text-trello-listCard-text text-sm wrap-break-word [word-break:break-word] transition-all duration-200 select-none">
          {card.content}
        </span>
      </div>

      {mouseIsOver && (
        <div className="absolute top-5 right-2 z-10 flex -translate-y-1/2 items-center bg-transparent pl-1 transition-opacity duration-150">
          {isCompleted && (
            <Tooltip offset={[0, -8]} title="Lưu thẻ này">
              <button
                className="group/card relative mr-1 cursor-pointer rounded-full border border-gray-300 bg-transparent p-1.5 opacity-60 hover:bg-[#F0F1F2] hover:opacity-100 dark:hover:bg-[#2b2c2f]"
                onClick={handleSaveCard}
              >
                <SavedIcon
                  size="16"
                  iconColor={`${theme === "dark" ? "#fff" : "#000"}`}
                />
              </button>
            </Tooltip>
          )}
          <Tooltip offset={[0, -8]} title="Sửa thẻ này">
            <button
              className="group/card relative cursor-pointer rounded-full border border-gray-300 bg-transparent p-1.5 opacity-60 hover:bg-[#F0F1F2] hover:opacity-100 dark:hover:bg-[#2b2c2f]"
              onClick={(e) => {
                e.stopPropagation();
                handleEditCard();
              }}
            >
              <EditIcon
                size="16"
                fillColor={`${theme === "dark" ? "#fff" : "#000"}`}
              />
            </button>
          </Tooltip>
        </div>
      )}
    </div>
  );
}
