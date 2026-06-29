import { useMemo, useState } from "react";

import { useTheme } from "@/context/ThemeContext";
import { useTrello } from "@/context/TrelloContext";
import { fetchApi } from "@/utils/api";
import type { CardI, ListI } from "@/utils/type";
import { EmptyState } from "./MenuView";
import {
  CircleCheckIcon,
  DeleteIcon,
  RefreshIcon,
  SavedIcon,
} from "@/components/Icons";
import { useDebounce } from "@/hooks";
import ConfirmPopover from "@/components/ConfirmPopover";

export default function MenuSavedView() {
  const [isCard, setIsCard] = useState(true);
  const { setBoards, lists, setLists, cards, setCards } = useTrello();
  const { theme } = useTheme();

  const [listKeyword, setListKeyword] = useState("");
  const [cardKeyword, setCardKeyword] = useState("");

  const debouncedListKeyword = useDebounce(listKeyword);
  const debouncedCardKeyword = useDebounce(cardKeyword);

  const [loadingItems, setLoadingItems] = useState<Record<string, boolean>>({});

  const startLoading = (id: string) => setLoadingItems(prev => ({ ...prev, [id]: true }));
  const stopLoading = (id: string) => setLoadingItems(prev => ({ ...prev, [id]: false }));

  const savedLists = useMemo(
    () =>
      lists
        .filter((l) => l.isSaved)
        .filter((l) =>
          l.title.toLowerCase().includes(debouncedListKeyword.toLowerCase()),
        ),
    [lists, debouncedListKeyword],
  );

  const savedCards = useMemo(
    () =>
      cards
        .filter((c) => c.isSaved)
        .filter((c) =>
          c.content.toLowerCase().includes(debouncedCardKeyword.toLowerCase()),
        ),
    [cards, debouncedCardKeyword],
  );

  // List
  const handleUnsaveList = async (listId: string) => {
    try {
      startLoading(listId);
      await fetchApi.patch(`/lists/${listId}`, {
        isSaved: false,
      });

      setLists((prev) =>
        prev.map((l) => (l.id === listId ? { ...l, isSaved: false } : l)),
      );
    } catch (error) {
      console.error(error);
    } finally {
      stopLoading(listId);
    }
  };

  const handleDeleteList = async (list: ListI, listId: string) => {
    try {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }

      startLoading(listId);
      // Delete list
      await fetchApi.delete(`/lists/${listId}`);

      setCards((prev) => prev.filter((c) => c.listId !== listId));
      setLists((prev) => prev.filter((c) => c.id !== listId));
      setBoards((prev) =>
        prev.map((b) =>
          b.id === list.boardId
            ? {
              ...b,
              listOrderIds: b.listOrderIds.filter((id) => id !== listId),
            }
            : b,
        ),
      );
    } catch (error) {
      console.error(error);
    } finally {
      stopLoading(listId);
    }
  };

  // Card
  const handleUnsaveCard = async (cardId: string) => {
    try {
      startLoading(cardId);
      await fetchApi.patch(`/cards/${cardId}`, {
        isSaved: false,
      });

      setCards((prev) =>
        prev.map((c) => (c.id === cardId ? { ...c, isSaved: false } : c)),
      );
    } catch (error) {
      console.error(error);
    } finally {
      stopLoading(cardId);
    }
  };

  const handleDeleteCard = async (card: CardI, cardId: string) => {
    try {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }

      startLoading(cardId);
      // Delete card
      await fetchApi.delete(`/cards/${cardId}`);

      setCards((prev) => prev.filter((c) => c.id !== cardId));
      setLists((prev) =>
        prev.map((l) =>
          l.id === card.listId
            ? {
              ...l,
              cardOrderIds: l.cardOrderIds.filter((id) => id !== cardId),
            }
            : l,
        ),
      );
    } catch (error) {
      console.error(error);
    } finally {
      stopLoading(cardId);
    }
  };

  return (
    <>
      <div className="mb-4 flex items-center">
        <div className="mr-2 flex-1">
          <input
            type="text"
            placeholder="Tìm kiếm"
            className="text-trello-addBoard-text bg-trello-addBoard-bg w-full rounded-md border border-[#8c8f97] px-3 py-1.5 outline-none"
            value={isCard ? cardKeyword : listKeyword}
            onChange={(e) =>
              isCard
                ? setCardKeyword(e.target.value)
                : setListKeyword(e.target.value)
            }
          />
        </div>
        <button
          className="text-trello-addBoard-text bg-trello-addBoard-bg hover:bg-trello-menu-item-bg-hover flex cursor-pointer items-center justify-center rounded-lg border border-[#8c8f97] px-3 py-1 text-sm"
          onClick={() => setIsCard(!isCard)}
        >
          {isCard ? "Danh sách" : "Thẻ"}
        </button>
      </div>
      <ul>
        {isCard ? (
          !savedCards?.length ? (
            <EmptyState title="Không có thẻ nào" />
          ) : (
            savedCards?.map((card) => {
              const isItemLoading = !!loadingItems[card.id];
              return (
                <li key={card.id} className="list-none">
                  <div className={`text-trello-addBoard-text mx-1 mt-2 mb-4 ${isItemLoading ? 'opacity-60 pointer-events-none' : ''}`}>
                    <div className="cursor-pointer rounded-lg p-3 shadow-sm hover:shadow-[0_0_0_2px_rgb(0,121,191)]">
                      <div className="flex items-center gap-2">
                        <span>
                          <CircleCheckIcon fillColor="#6A9A23" />
                        </span>
                        <p className="text-[15px]">{card.content}</p>
                      </div>
                      <div className="mt-2 ml-2 flex items-center gap-1.5 text-xs">
                        <span>
                          <SavedIcon size="14" />
                        </span>
                        <p>Đã lưu trữ</p>
                      </div>
                    </div>
                    <div className="ml-2 flex items-center gap-1.5 text-sm font-semibold mt-1">
                      <button
                        disabled={isItemLoading}
                        className="cursor-pointer hover:text-blue-400 hover:underline disabled:no-underline"
                        onClick={() => handleUnsaveCard(card.id)}
                      >
                        {isItemLoading ? "Đang xử lý..." : "Khôi phục"}
                      </button>
                      <span className="text-2xl">•</span>
                      <ConfirmPopover
                        title="Bạn muốn xoá thẻ?"
                        desc={
                          <>
                            Tất cả các thao tác sẽ bị xóa khỏi thông báo hoạt động
                            và bạn sẽ không thể mở lại thẻ. Không thể hoàn tác.
                          </>
                        }
                        buttonName={isItemLoading ? "Đang xoá..." : "Xoá"}
                        onConfirm={() => handleDeleteCard(card, card.id)}
                      >
                        <button disabled={isItemLoading} className="cursor-pointer hover:text-blue-400 hover:underline disabled:no-underline">
                          <p>{isItemLoading ? "Đang xoá..." : "Xoá"}</p>
                        </button>
                      </ConfirmPopover>
                    </div>
                  </div>
                </li>
              );
            })
          )
        ) : !savedLists?.length ? (
          <EmptyState title="Không có danh sách nào" />
        ) : (
          savedLists?.map((list) => {
            const isItemLoading = !!loadingItems[list.id];
            return (
              <li key={list.id} className="list-none">
                <div className={`text-trello-addBoard-text mb-2 flex items-center justify-between ${isItemLoading ? 'opacity-60 pointer-events-none' : ''}`}>
                  <p className="p-2 text-[15px] font-medium">{list.title}</p>
                  <div className="flex gap-1">
                    <button
                      disabled={isItemLoading}
                      className="hover:bg-trello-icon-bg-hover flex cursor-pointer items-center gap-1.5 rounded-lg border border-gray-300 px-2 py-1.5 disabled:opacity-50"
                      onClick={() => handleUnsaveList(list.id)}
                    >
                      <RefreshIcon
                        size="16"
                        fillColor={theme === "dark" ? "#a9abaf" : "#505258"}
                      />
                      <span className="text-sm">{isItemLoading ? "..." : "Khôi phục"}</span>
                    </button>
                    <ConfirmPopover
                      title="Xóa danh sách?"
                      desc={
                        <>
                          Mọi thẻ, thao tác và hoạt động trong danh sách này đều
                          sẽ bị xóa vĩnh viễn. Bạn sẽ không thể mở lại danh sách
                          này. Bạn không thể hoàn tác.
                        </>
                      }
                      buttonName={isItemLoading ? "Đang xoá..." : "Xoá"}
                      onConfirm={() => handleDeleteList(list, list.id)}
                    >
                      <button disabled={isItemLoading} className="hover:bg-trello-icon-bg-hover cursor-pointer rounded-lg border border-gray-300 px-2 py-1.5 disabled:opacity-50">
                        <span>
                          <DeleteIcon
                            size="18"
                            iconColor={theme === "dark" ? "#a9abaf" : "#505258"}
                          />
                        </span>
                      </button>
                    </ConfirmPopover>
                  </div>
                </div>
                <hr className="mb-2 text-[#0b120e24] dark:text-[#e3e4f21f]" />
              </li>
            );
          })
        )}
      </ul>
    </>
  );
}