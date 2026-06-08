import { useEffect, useRef, useState } from "react";
import { useTrello } from "@/context/TrelloContext";
import { fetchApi } from "@/utils/api";
import type { CardI, ListI } from "@/utils/type";
import Card from "../Card/Card";
import {
  ChevronLeftRightIcon,
  ChevronRightLeftIcon,
  PlusIcon,
  SavedIcon,
} from "../Icons";
import AddCardForm from "../Card/AddCardForm";
import Tooltip from "../Tooltip";

interface TrelloListProps {
  list: ListI;
  isFirstList: boolean;
}

export default function TrelloList({ list, isFirstList }: TrelloListProps) {
  const [showAddCard, setShowAddCard] = useState<boolean>(false);
  const [shrink, setShrink] = useState<boolean>(list.isShrink || false);
  const [editTitle, setEditTitle] = useState("");
  const [showEditTitle, setShowEditTitle] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState(false);

  const { boards, setLists, cards, setCards } = useTrello();
  const divRef = useRef<HTMLDivElement | null>(null);
  const listTitleRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (showAddCard && divRef.current) {
      divRef.current.focus();
    }

    if (showEditTitle && listTitleRef.current) {
      const element = listTitleRef.current;

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
  }, [showAddCard, showEditTitle, list.title]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        listTitleRef.current &&
        !listTitleRef.current.contains(e.target as Node)
      ) {
        setShowEditTitle(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowEditTitle]);

  const listCardsCount = cards.filter(
    (c) => c.listId === list.id && !c.isSaved,
  ).length;

  const handleCreateCard = async (content: string) => {
    const boardTitle = decodeURIComponent(
      window.location.pathname.substring(1),
    );
    const currentBoard = boards.find((b) => b.title === boardTitle);
    if (!currentBoard) return;

    const payload = {
      boardId: currentBoard.id,
      listId: list.id,
      content: content,
      position: listCardsCount + 1,
      isSaved: false,
    };

    const newCard = (await fetchApi.post("/cards", payload)) as CardI;
    setCards((prev) => [...prev, newCard]);
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
      setShowEditTitle(false);
    }
  };

  const handleToggleShrink = async () => {
    if (isSaving) return;
    setShrink(!shrink);
    const nextShrinkState = !shrink;
    try {
      setIsSaving(true);
      await fetchApi.patch(`/lists/${list.id}`, { isShrink: nextShrinkState });
      setShrink(nextShrinkState);
    } catch (e) {
      console.error("Lỗi khi cập nhật trạng thái shrink:", e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!editTitle.trim() || editTitle === list.title) {
      setShowEditTitle(false);
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
      setShowEditTitle(false);
    } catch (e) {
      console.error("Lỗi khi cập nhật tiêu đề list:", e);
    }
  };

  return (
    <li
      className={`${shrink ? "w-10" : "w-(--list-box-width)"} min-w-0 shrink-0 rounded-xl bg-[#f1f2f4]`}
    >
      {shrink ? (
        <div
          className="flex cursor-pointer flex-col items-center gap-1 rounded-xl px-3 py-2 hover:bg-[#0B120E24]"
          onClick={handleToggleShrink}
        >
          <button
            className="group/list relative h-8 w-8 cursor-pointer rounded-md p-2"
            disabled={isSaving}
          >
            <ChevronLeftRightIcon width="16" height="16" fillColor="#292a2e" />
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
        <div className="flex flex-col px-3 py-2">
          {/* Header List */}
          <div className="flex items-center justify-between py-1">
            <h3 className="w-full wrap-break-word [word-break:break-word] whitespace-pre-wrap">
              {showEditTitle ? (
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
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                ></div>
              ) : (
                <button
                  className="w-full cursor-pointer px-3 text-left font-semibold text-gray-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowEditTitle(!showEditTitle);
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

          <ol className="my-1 flex flex-col gap-1.5">
            {cards
              .filter((card) => !card.isSaved)
              .map((card) => {
                if (list.id === card.listId) {
                  return (
                    <li key={card.id}>
                      <Card card={card} isFirstList={isFirstList} />
                    </li>
                  );
                }
                return null;
              })}
          </ol>

          {/* Thêm Card mới */}
          <div>
            {showAddCard ? (
              <AddCardForm
                onAdd={handleCreateCard}
                onClose={() => setShowAddCard(false)}
              />
            ) : (
              <button
                className="mt-1 flex w-full cursor-pointer items-center gap-1 rounded-lg p-2 text-sm font-medium text-[#505258] hover:bg-[#0B120E24]"
                onClick={() => setShowAddCard(true)}
              >
                <PlusIcon width="16" height="16" iconColor="#505258" />
                Thêm thẻ
              </button>
            )}
          </div>
        </div>
      )}
    </li>
  );
}
