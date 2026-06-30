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
import { useCurrentBoard } from "@/hooks";
import EditCard from "./EditCard";

interface CardProps {
  card: CardI;
}

export default function Card({ card }: CardProps) {
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [mouseIsOver, setMouseIsOver] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editContent, setEditContent] = useState("");
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { setCards } = useTrello();
  const { isClosed } = useCurrentBoard();
  const { theme } = useTheme();

  const editRef = useRef<HTMLDivElement | null>(null);
  // anchor riêng, LUÔN tồn tại trong DOM 
  const popperAnchorRef = useRef<HTMLDivElement | null>(null);

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
      const element = editRef.current;

      if (element.textContent !== card.content) {
        element.textContent = card.content;
      }
      setEditContent(card.content);
      element.focus();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editMode]);

  const handleOpenEditAndMenu = () => {
    if (isClosed) return;
    setEditMode(true);
    if (popperAnchorRef.current) {
      setAnchorEl(popperAnchorRef.current);
    }
    setOpen(true);
  };

  const handleSaveEditContent = async () => {
    const trimmed = editContent.trim();

    if (!trimmed || trimmed === card.content) {
      setEditMode(false);
      setOpen(false);
      return;
    }

    const previousContent = card.content;
    setEditMode(false);
    setOpen(false);
    setEditContent("");
    setCards((prev) =>
      prev.map((c) => (c.id === card.id ? { ...c, content: trimmed } : c)),
    );

    try {
      const updatedCard = (await fetchApi.patch(`/cards/${card.id}`, {
        content: trimmed,
      })) as CardI;

      setCards((prev) =>
        prev.map((c) =>
          c.id === card.id ? { ...c, content: updatedCard.content } : c,
        ),
      );
    } catch (e) {
      console.error(e);
      setCards((prev) =>
        prev.map((c) =>
          c.id === card.id ? { ...c, content: previousContent } : c,
        ),
      );
      toast.error("Lưu thẻ thất bại, đã hoàn tác");
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setOpen(false);
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

  const handleSaveCard = async () => {
    if (isSaving) return;

    try {
      setIsSaving(true);

      await fetchApi.patch(`/cards/${card.id}`, { isSaved: true });
      setCards((prevCards) =>
        prevCards.map((c) => (c.id === card.id ? { ...c, isSaved: true } : c)),
      );

      if (!editMode) {
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
      }
    } catch (e) {
      console.error("Lỗi khi lưu danh sách:", e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      {editMode && (
        <div
          data-no-dnd="true"
          className="fixed inset-0 z-40 bg-black/30 transition-opacity"
          onClick={handleCancelEdit}
        />
      )}
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...(editMode ? {} : listeners)}
        className={
          editMode
            ? "relative w-full rounded-xl z-50 outline-none"
            : `group bg-trello-card-bg relative flex items-center justify-between rounded-xl border border-transparent overflow-hidden shadow-sm outline-nones hover:border-blue-500 ${isDragging
              ? "w-full rounded-xl border border-gray-400 bg-gray-300 opacity-50"
              : ""
            }`
        }
        onMouseEnter={() => !isDragging && setMouseIsOver(true)}
        onMouseLeave={() => setMouseIsOver(false)}
      >
        {/* Anchor cố định cho Popper - luôn tồn tại trong DOM, */}
        <div
          ref={popperAnchorRef}
          style={{ position: "absolute", top: 8, right: 0, width: 0, height: 0 }}
        />
        {editMode ? (
          <div className="rounded-xl border border-blue-500 bg-trello-card-bg" data-no-dnd="true">
            {card.cover && (
              <div
                className="max-h-42.5 h-38.5 w-full rounded-t-xl bg-cover"
                style={{ backgroundImage: `url(${card.cover})` }}
              />
            )}
            <div
              key={`edit-${card.id}-${editMode}`}
              ref={editRef}
              role="textbox"
              contentEditable="true"
              suppressContentEditableWarning
              data-no-dnd="true"
              className="block min-h-16 w-full  px-3 py-2 text-sm wrap-break-word [word-break:break-word] whitespace-pre-wrap text-trello-listCard-text shadow outline-none"
              onInput={(e) => setEditContent(e.currentTarget.innerText || "")}
              onMouseDown={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSaveEditContent();
                  setOpen(false)
                }
              }}
            />
          </div>
        ) : (
          <div className="flex w-full flex-col">
            {card.cover && (
              <div
                className="max-h-42.5 h-38.5 w-full rounded-t-xl bg-cover"
                style={{ backgroundImage: `url(${card.cover})` }}
              />
            )}
            <div className="flex min-w-0 flex-1 items-center p-2.5">
              <div
                className={`flex shrink-0 items-center transition-all duration-400 ease-in-out ${isCompleted
                  ? "w-6 opacity-100"
                  : isClosed
                    ? "w-0 opacity-0"
                    : "w-0 opacity-0 group-hover:w-6 group-hover:opacity-100"
                  }`}
              >
                <Tooltip
                  offset={[0, -1]}
                  title={
                    isClosed
                      ? ""
                      : isCompleted
                        ? "Đánh dấu chưa hoàn thành"
                        : "Đánh dấu hoàn thành"
                  }
                >
                  <button
                    type="button"
                    className={`relative rounded-full ${isClosed ? "cursor-default" : "cursor-pointer"}`}
                    onClick={() => {
                      if (isClosed) return;
                      setIsCompleted(!isCompleted);
                    }}
                    disabled={isClosed}
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
          </div>
        )}

        {(mouseIsOver || open || editMode) && !isClosed && (
          <div
            className={
              editMode
                ? "mt-1.5 flex justify-start"
                : "absolute top-5 right-2 z-10 flex -translate-y-1/2 items-center bg-transparent pl-1 transition-opacity duration-150"
            }
          >
            {editMode ? (
              <>
                <button
                  onClick={handleSaveEditContent}
                  className="rounded-lg bg-blue-500 px-2.5 py-1 text-xs font-medium text-white hover:bg-blue-600"
                >
                  Lưu
                </button>
              </>
            ) : (
              <>
                {isCompleted && (
                  <Tooltip offset={[0, -8]} title={isClosed ? "" : "Lưu thẻ này"}>
                    <button
                      className="relative mr-1 cursor-pointer rounded-full bg-white border border-gray-300  p-1.5 opacity-60 hover:bg-[#F0F1F2] hover:opacity-100 dark:hover:bg-[#2b2c2f]"
                      onClick={(e) => {
                        if (isClosed) return;
                        e.stopPropagation()
                        handleSaveCard();
                      }}
                      disabled={isClosed}
                    >
                      <SavedIcon
                        size="16"
                        iconColor={`${theme === "dark" ? "#fff" : "#000"}`}
                      />
                    </button>
                  </Tooltip>
                )}
                <Tooltip offset={[0, -8]} title={isClosed ? "" : "Sửa thẻ này"}>
                  <button
                    className="relative mr-1 cursor-pointer rounded-full border bg-white border-gray-300  p-1.5 opacity-60 hover:bg-[#F0F1F2] hover:opacity-100 dark:hover:bg-[#2b2c2f]"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenEditAndMenu();
                    }}
                  >
                    <EditIcon
                      size="16"
                      fillColor={`${theme === "dark" ? "#fff" : "#000"}`}
                    />
                  </button>
                </Tooltip>
              </>
            )}
          </div>
        )}

        {open && (
          <EditCard
            open={open}
            anchorEl={anchorEl}
            card={card}
            onSaved={handleSaveCard}
          />
        )}
      </div>
    </>
  );
}