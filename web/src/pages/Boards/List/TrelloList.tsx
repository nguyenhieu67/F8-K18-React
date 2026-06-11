import { useEffect, useMemo, useRef, useState } from "react";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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
import AddCardForm from "../Card/AddCardForm";
import Tooltip from "@/components/Tooltip";
import toSlug from "@/utils/slug";
import { addCardOrderApi } from "../_id";
import mapOrder from "@/utils/sort/sorts";
import { useParams } from "react-router-dom";

interface TrelloListProps {
  list: ListI;
  isFirstList?: boolean;
}

export default function TrelloList({ list, isFirstList }: TrelloListProps) {
  const { boards, setLists, cards, setCards } = useTrello();
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

  // Click out size
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        listTitleRef.current &&
        !listTitleRef.current.contains(e.target as Node)
      ) {
        setEditMode(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setEditMode]);

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

  const handleAddCard = async (content: string) => {
    try {
      const currentBoard = boards.find((b) => toSlug(b.title) === boardDetail);
      if (!currentBoard) return;

      const payload = {
        boardId: currentBoard.id,
        listId: list.id,
        content: content,
        isSaved: false,
      };

      const newCard = (await fetchApi.post("/cards", payload)) as CardI;
      addCardOrderApi(list.id, newCard.id);

      setCards((prev) => [...prev, newCard]);
    } catch (e) {
      console.log("Không thể thêm thẻ: ", e);
    }
  };

  const handleSaved = async () => {
    if (isSaving) return;

    try {
      setIsSaving(true);

      await fetchApi.patch(`/lists/${list.id}`, { isSaved: true });

      setLists((prevLists) => prevLists.filter((l) => l.id !== list.id));
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
        className={`${shrink ? "w-10" : "w-(--list-box-width)"} block min-w-0 shrink-0 self-start rounded-xl bg-[#f1f2f4]`}
      >
        {shrink ? (
          <div
            ref={shrinkRef}
            className="flex cursor-pointer flex-col items-center gap-1 rounded-xl px-3 py-2 hover:bg-[#0B120E24]"
            onClick={handleToggleShrink}
          >
            <button
              className="group/list relative h-8 w-8 cursor-pointer rounded-md p-2"
              disabled={isSaving}
            >
              <ChevronLeftRightIcon
                width="16"
                height="16"
                fillColor="#292a2e"
              />
              <Tooltip
                title="Mở rộng danh sách"
                name="list"
                isFirstList={isFirstList}
              />
            </button>
            <h3 className="whitespace-nowrap [writing-mode:vertical-lr]">
              {list.title}
            </h3>
            <span className="group/list relative mx-2">{listCardsCount}</span>
          </div>
        ) : (
          <div className="flex max-h-[calc(100vh-200px)] flex-col px-3 py-2">
            {/* Header List */}
            <div className="flex items-center justify-between py-1">
              <h3 className="w-full wrap-break-word [word-break:break-word] whitespace-pre-wrap">
                {editMode ? (
                  <div
                    ref={listTitleRef}
                    role="textbox"
                    contentEditable="true"
                    suppressContentEditableWarning
                    className="block w-full px-3 py-1 font-semibold wrap-break-word [word-break:break-word] whitespace-pre-wrap text-gray-700"
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
                    className="w-full cursor-pointer px-3 text-left font-semibold text-gray-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditMode(!editMode);
                    }}
                  >
                    {list.title}
                  </button>
                )}
              </h3>
              <div className="flex items-center text-sm">
                <span className="group/list relative mx-2">
                  {listCardsCount}
                  <Tooltip title="Tổng số thẻ" name="list" />
                </span>
                <button
                  className="group/list relative h-8 w-8 cursor-pointer rounded-md p-2 hover:bg-[#0B120E24]"
                  onClick={handleToggleShrink}
                >
                  <ChevronRightLeftIcon
                    width="16"
                    height="16"
                    fillColor="#292a2e"
                  />
                  <Tooltip title="Thu gọn danh sách" name="list" />
                </button>
                <button
                  className="group/list relative h-8 w-8 cursor-pointer rounded-md p-2 hover:bg-[#0B120E24]"
                  disabled={isSaving}
                  onClick={handleSaved}
                >
                  <SavedIcon width="16" height="16" iconClass="#292a2e" />
                  <Tooltip title="Lưu danh sách này" name="list" />
                </button>
              </div>
            </div>

            <ol className="my-1 flex min-h-0 flex-1 scrollbar-thin scrollbar-thumb-[#0B120E24] flex-col gap-1.5 overflow-x-hidden overflow-y-auto">
              <SortableContext
                items={orderedCards.map((c) => c.id)}
                strategy={verticalListSortingStrategy}
              >
                {orderedCards.map((card) => (
                  <li key={card.id} className="mr-0.5">
                    <Card card={card as CardI} isFirstList={isFirstList} />
                  </li>
                ))}
              </SortableContext>
              {showAddCard && (
                <li>
                  <AddCardForm
                    onAdd={handleAddCard}
                    onClose={() => setShowAddCard(false)}
                  />
                </li>
              )}
            </ol>

            {/* Thêm Card mới */}
            {!showAddCard && (
              <div className="mt-auto shrink-0 pt-1">
                <button
                  className="mt-1 flex w-full cursor-pointer items-center gap-1 rounded-lg p-2 text-sm font-medium text-[#505258] hover:bg-[#0B120E24]"
                  onClick={() => setShowAddCard(true)}
                >
                  <PlusIcon width="16" height="16" iconColor="#505258" />
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
