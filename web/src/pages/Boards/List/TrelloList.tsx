import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ClickAwayListener } from "@mui/material";

import { useTrello } from "@/context/TrelloContext";
import { fetchApi } from "@/utils/api";
import type { CardI, ListI } from "@/utils/type";
import Card from "../Card/Card";
import {
  ChevronLeftRightIcon,
  ChevronRightLeftIcon,
  PlusIcon,
  SavedIcon,
} from "@/components/Icons";
import { Tooltip } from "@/components/Tooltip";
import AddCardForm from "../Card/AddCardForm";
import toSlug from "@/utils/slug";
import { addCardOrderApi } from "../_id";
import mapOrder from "@/utils/sort/sorts";
import { useTheme } from "@/context/ThemeContext";
import { useCurrentBoard } from "@/hooks";

interface TrelloListProps {
  list: ListI;
}

export default function TrelloList({ list }: TrelloListProps) {
  const { boards, setLists, cards, setCards } = useTrello();
  const { isClosed } = useCurrentBoard();
  const { theme } = useTheme();
  const { boardDetail } = useParams();

  const [showAddCard, setShowAddCard] = useState<boolean>(false);
  const [shrink, setShrink] = useState<boolean>(list.isShrink || false);
  const [editTitle, setEditTitle] = useState("");
  const [editMode, setEditMode] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [normalSize, setNormalSize] = useState({
    width: "272px",
    height: "300px",
  });
  const [shrinkSize, setShrinkSize] = useState({
    width: "40px",
    height: "150px",
  });

  const editRef = useRef<HTMLDivElement | null>(null);
  const listTitleRef = useRef<HTMLDivElement | null>(null);
  const shrinkRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  const orderedCards = useMemo(() => {
    return mapOrder(
      cards.filter((c) => c.listId === list.id && !c.isSaved),
      list.cardOrderIds || [],
      "id",
    );
  }, [list.cardOrderIds, cards, list.id]);
  const listCardsCount = orderedCards.length;

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: list.id,
    data: {
      type: "List",
      list,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  // Edit mode
  useEffect(() => {
    if (showAddCard && editRef.current) {
      editRef.current.focus();
    }

    if (editMode && listTitleRef.current) {
      const element = listTitleRef.current;

      setTimeout(() => {
        element.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });

        element.focus();
      }, 50);

      element.focus();
      element.textContent = list.title;
      setEditTitle(list.title);

      try {
        const range = document.createRange();
        range.selectNodeContents(element);

        const selection = window.getSelection();
        if (selection) {
          selection.removeAllRanges();
          selection.addRange(range);
        }
      } catch (error) {
        console.error("Lỗi khi bôi đen text:", error);
      }
    }
  }, [showAddCard, editMode, list.title]);

  // Lấy width & height của list isDragging đó
  useEffect(() => {
    if (isDragging || !listRef.current) return;
    const rect = listRef.current.getBoundingClientRect();
    if (rect.height <= 0) return;

    if (!shrink) {
      const newW = `${rect.width}px`;
      const newH = `${rect.height}px`;
      setNormalSize((prev) => {
        if (prev.width === newW && prev.height === newH) return prev;
        return { width: newW, height: newH };
      });
    } else {
      const newW = `${rect.width}px`;
      const newH = `${rect.height}px`;
      setShrinkSize((prev) => {
        if (prev.width === newW && prev.height === newH) return prev;
        return { width: newW, height: newH };
      });
    }
  }, [cards, shrink, isDragging]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShrink(list.isShrink || false);
  }, [list.isShrink]);

  const handleAddCard = async (content: string) => {
    try {
      const currentBoard = boards.find((b) => toSlug(b.title) === boardDetail);
      if (!currentBoard) return;

      const payload = {
        boardId: currentBoard.id,
        listId: list.id,
        content: content,
        isSaved: false,
        createdAt: new Date().toISOString(),
      };

      const newCard = (await fetchApi.post("/cards", payload)) as CardI;
      addCardOrderApi(list.id, newCard.id);

      setCards((prev) => [...prev, newCard]);
    } catch (e) {
      console.log("Không thể thêm thẻ: ", e);
    }
  };

  const handleUnSaveCard = async () => {
    toast.info("Chưa lưu trữ danh sách", {
      position: "bottom-left",
      autoClose: 3000,
    });

    await fetchApi.patch(`/lists/${list.id}`, {
      isSaved: false,
    });

    setLists((prevLists) => [...prevLists, { ...list, isSaved: false }]);
  };

  const handleSaveList = async () => {
    if (isSaving) return;

    try {
      setIsSaving(true);

      await fetchApi.patch(`/lists/${list.id}`, { isSaved: true });
      setLists((prevLists) =>
        prevLists.map((l) => (l.id === list.id ? { ...l, isSaved: true } : l)),
      );

      toast.success(
        <div>
          <p>Đã lưu danh sách</p>
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
      setEditMode(false);
    }
  };

  const handleToggleShrink = async () => {
    if (isSaving) return;
    const nextShrinkState = !shrink;
    setShrink(nextShrinkState);
    try {
      setIsSaving(true);
      await fetchApi.patch(`/lists/${list.id}`, { isShrink: nextShrinkState });
      setLists((prev) =>
        prev.map((l) =>
          l.id === list.id ? { ...l, isShrink: nextShrinkState } : l,
        ),
      );
    } catch (e) {
      setShrink(!nextShrinkState);
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!editTitle.trim() || editTitle === list.title) {
      setEditMode(false);
      return;
    }

    const newTitle = editTitle;

    try {
      await fetchApi.patch(`/lists/${list.id}`, { title: newTitle });

      setLists((prevLists) =>
        prevLists.map((l) =>
          l.id === list.id ? { ...l, title: newTitle } : l,
        ),
      );

      if (listTitleRef.current) {
        listTitleRef.current.innerText = "";
      }

      setEditTitle("");
      setEditMode(false);
    } catch (e) {
      console.error("Lỗi khi cập nhật tiêu đề list:", e);
    }
  };

  if (isDragging) {
    const currentW = shrink ? shrinkSize.width : normalSize.width;
    const currentH = shrink ? shrinkSize.height : normalSize.height;

    return (
      <div
        ref={setNodeRef}
        style={{
          ...style,
          width: currentW,
          height: currentH,
        }}
        className="min-w-0 shrink-0 rounded-xl bg-gray-400 opacity-30"
      />
    );
  }

  return (
    <div ref={setNodeRef} style={style}>
      <div
        ref={listRef}
        {...listeners}
        {...attributes}
        className={`${shrink ? "w-10" : "w-(--list-box-width)"} bg-trello-list-bg block min-w-0 shrink-0 self-start rounded-xl`}
      >
        {shrink ? (
          <div
            ref={shrinkRef}
            className="text-trello-listCard-text flex cursor-pointer flex-col items-center gap-1 rounded-xl px-3 py-2 hover:bg-[#0B120E24]"
            onClick={handleToggleShrink}
          >
            <Tooltip title="Mở rộng danh sách" offset={[0, -15]}>
              <button
                className="relative h-8 w-8 cursor-pointer rounded-md p-2"
                disabled={isSaving}
              >
                <ChevronLeftRightIcon
                  size="16"
                  fillColor={`${theme === "dark" ? "#a9abaf" : "#292a2e"}`}
                />
              </button>
            </Tooltip>
            <h3 className="whitespace-nowrap [writing-mode:vertical-lr]">
              {list.title}
            </h3>
            <span className="relative mx-2">{listCardsCount}</span>
          </div>
        ) : (
          <div className="flex max-h-[calc(100vh-200px)] flex-col px-3 py-2">
            {/* Header List */}
            <div className="flex items-center justify-between py-1">
              <ClickAwayListener onClickAway={() => setEditMode(false)}>
                <h3 className="w-full wrap-break-word [word-break:break-word] whitespace-pre-wrap">
                  {editMode ? (
                    <div
                      ref={listTitleRef}
                      role="textbox"
                      contentEditable="true"
                      suppressContentEditableWarning
                      className="text-trello-listCard-text block w-full px-3 py-1 font-semibold wrap-break-word [word-break:break-word] whitespace-pre-wrap"
                      onInput={(e) =>
                        setEditTitle(e.currentTarget.textContent || "")
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSubmit();
                        }
                      }}
                    />
                  ) : (
                    <button
                      className="text-trello-listCard-text ml-3 w-full cursor-pointer text-left font-semibold"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditMode(!editMode);
                      }}
                    >
                      {list.title}
                    </button>
                  )}
                </h3>
              </ClickAwayListener>
              <div className="text-trello-listCard-text flex items-center text-sm">
                <Tooltip title="Tổng số thẻ">
                  <span className="mx-2">{listCardsCount}</span>
                </Tooltip>
                <Tooltip title="Thu gọn danh sách">
                  <button
                    className="h-8 w-8 cursor-pointer rounded-md p-2 hover:bg-[#0B120E24]"
                    onClick={handleToggleShrink}
                  >
                    <ChevronRightLeftIcon
                      size="16"
                      fillColor={`${theme === "dark" ? "#a9abaf" : "#292a2e"}`}
                    />
                  </button>
                </Tooltip>
                {!isClosed && (
                  <Tooltip title="Lưu danh sách này">
                    <button
                      className="h-8 w-8 cursor-pointer rounded-md p-2 hover:bg-[#0B120E24]"
                      disabled={isSaving}
                      onClick={handleSaveList}
                    >
                      <SavedIcon
                        size="16"
                        iconColor={`${theme === "dark" ? "#a9abaf" : "#292a2e"}`}
                      />
                    </button>
                  </Tooltip>
                )}
              </div>
            </div>

            <ol className="my-1 flex min-h-0 flex-1 scrollbar-thin scrollbar-thumb-[#0B120E24] flex-col gap-1.5 overflow-x-hidden overflow-y-auto">
              <SortableContext
                items={orderedCards.map((c) => c.id)}
                strategy={verticalListSortingStrategy}
              >
                {orderedCards.map((card) => (
                  <li key={card.id} className="mr-0.5">
                    <Card card={card as CardI} />
                  </li>
                ))}
              </SortableContext>
              {showAddCard && (
                <li onMouseDown={(e) => e.stopPropagation()}>
                  <AddCardForm
                    onAdd={handleAddCard}
                    onClickOutSize={handleAddCard}
                    onClose={() => setShowAddCard(false)}
                  />
                </li>
              )}
            </ol>

            {/* Thêm Card mới */}
            {!showAddCard && !isClosed && (
              <div className="mt-auto shrink-0 pt-1">
                <button
                  className="mt-1 flex w-full cursor-pointer items-center gap-1 rounded-lg p-2 text-sm font-medium text-[#505258] hover:bg-[#0B120E24] dark:text-[#a9abaf] dark:hover:bg-[#e3e4f21f]"
                  onClick={() => setShowAddCard(true)}
                >
                  <PlusIcon
                    size="16"
                    iconColor={`${theme === "dark" ? "#a9abaf" : "#505258"}`}
                  />
                  Thêm thẻ
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
