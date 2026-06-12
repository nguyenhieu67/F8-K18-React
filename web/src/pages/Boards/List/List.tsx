import { useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  defaultDropAnimationSideEffects,
  DndContext,
  DragOverlay,
  MouseSensor,
  rectIntersection,
  TouchSensor,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  type DropAnimation,
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";

import { PlusIcon } from "@/components/Icons";
import { useTrello } from "@/context/TrelloContext";
import { fetchApi } from "@/utils/api";
import type { CardI, ListI } from "@/utils/type";
import mapOrder from "@/utils/sort/sorts";
import { useLatest } from "@/hooks";
import Card from "../Card/Card";
import {
  addListOrderApi,
  updateCardOrderIdsApi,
  updateListOrderIdsApi,
} from "../_id";
import TrelloList from "./TrelloList";
import AddListForm from "./AddListForm";

interface ListProps {
  boardId: string;
}

export default function List({ boardId }: ListProps) {
  const [showAddList, setShowAddList] = useState<boolean>(false);
  const [activeList, setActiveList] = useState<ListI | null>(null);
  const [activeCard, setActiveCard] = useState<CardI | null>(null);
  const [listInput, setListInput] = useState("");

  const { boards, setBoards, lists, setLists, cards, setCards } = useTrello();

  // Lưu lại list trước đó tránh bị re-render cập nhật thành cái mới
  const originalListIdRef = useRef<string | null>(null);

  const orderedLists = useMemo(() => {
    const currentBoard = boards.find((b) => b.id === boardId);
    const orderIds = currentBoard?.listOrderIds || [];
    const currentLists = lists.filter(
      (l) => l.boardId === boardId && !l.isSaved,
    );

    return mapOrder(currentLists, orderIds, "id");
  }, [boards, lists, boardId]);

  const listsRef = useLatest(lists);
  const cardsRef = useLatest(cards);
  const orderedListsRef = useLatest(orderedLists);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 5,
      predicate: (event: PointerEvent) => {
        const target = event.target as HTMLElement;

        if (!target) return true;
        const shouldBlock =
          target.closest('[data-no-dnd="true"]') ||
          target.closest('[contenteditable="true"]') ||
          target.isContentEditable;
        return !shouldBlock;
      },
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  const handleAddList = async (title: string) => {
    const payload = {
      boardId: boardId,
      title: title,
      cardOrderIds: [],
      isSaved: false,
      isShrink: false,
      createdAt: new Date().toISOString(),
    };

    const newList = (await fetchApi.post("/lists", payload)) as ListI;
    addListOrderApi(boardId, newList.id);

    setLists((prev) => [...prev, newList]);
  };

  const handleDragStart = (e: DragStartEvent) => {
    if (e.active.data.current?.type === "List") {
      setActiveList(e.active.data.current.list);
      return;
    }

    if (e.active.data.current?.type === "Card") {
      setActiveCard(e.active.data.current.card);
      originalListIdRef.current = e.active.data.current.card.listId;
      return;
    }
  };

  const findIndexById = <T extends { id: unknown }>(
    array: T[],
    cardId: unknown,
  ) => {
    return array?.findIndex((a) => a.id === cardId);
  };

  const handleDragOver = (e: DragOverEvent) => {
    const { active, over } = e;
    if (!over) return;

    const activeCardId = active.id;
    const overCardId = over.id;

    if (activeCardId === overCardId) return;

    const isActiveACard = active.data.current?.type === "Card";
    if (!isActiveACard) return;

    const isOverACard = over.data.current?.type === "Card";
    const isOverAList = over.data.current?.type === "List";

    // Trường hợp 1: card → card (cùng hoặc khác list)
    if (isActiveACard && isOverACard) {
      setCards((cards) => {
        const activeIndex = cards.findIndex((c) => c.id === activeCardId);
        const overIndex = cards.findIndex((c) => c.id === overCardId);

        if (activeIndex === -1 || overIndex === -1) return cards;

        const updatedCards = cards.map((c, i) =>
          i === activeIndex ? { ...c, listId: cards[overIndex].listId } : c,
        );

        return arrayMove(updatedCards, activeIndex, overIndex);
      });
    }

    // Trường hợp 2: card → list (thả vào list trống hoặc cuối list)
    if (isActiveACard && isOverAList) {
      // Lấy lists từ ref để tránh stale closure
      const targetList = listsRef.current.find(
        (l) => l.id === String(overCardId),
      );
      if (targetList?.isShrink) return;

      setCards((cards) => {
        const activeIndex = cards.findIndex((c) => c.id === activeCardId);
        if (activeIndex === -1) return cards;

        if (cards[activeIndex].listId === String(overCardId)) {
          const sameListCards = cards.filter(
            (c) => c.listId === String(overCardId) && !c.isSaved,
          );
          if (sameListCards[sameListCards.length - 1]?.id === activeCardId) {
            return cards;
          }
        }

        const updatedCards = cards.map((c, i) =>
          i === activeIndex ? { ...c, listId: String(overCardId) } : c,
        );

        let lastIndexInTarget = -1;
        for (let i = updatedCards.length - 1; i >= 0; i--) {
          if (
            updatedCards[i].listId === String(overCardId) &&
            i !== activeIndex &&
            !updatedCards[i].isSaved
          ) {
            lastIndexInTarget = i;
            break;
          }
        }

        const targetIndex =
          lastIndexInTarget === -1
            ? updatedCards.length - 1
            : activeIndex < lastIndexInTarget
              ? lastIndexInTarget
              : lastIndexInTarget + 1;

        return arrayMove(updatedCards, activeIndex, targetIndex);
      });
    }
  };

  const handleDragEnd = async (e: DragEndEvent) => {
    setActiveList(null);
    setActiveCard(null);

    const { active, over } = e;
    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();
    const activeType = active.data.current?.type;

    // Handle drop card
    if (activeType === "Card") {
      const activeCard = cardsRef.current.find((c) => c.id === activeId);
      if (!activeCard) return;

      const targetListId = activeCard.listId;
      const originalListId = originalListIdRef.current;

      const newTargetCardOrderIds = cardsRef.current
        .filter((c) => c.listId === targetListId && !c.isSaved)
        .map((c) => c.id);

      setLists((prev) =>
        prev.map((l) => {
          if (l.id === targetListId) {
            return { ...l, cardOrderIds: newTargetCardOrderIds };
          }
          if (
            originalListId &&
            l.id === originalListId &&
            originalListId !== targetListId
          ) {
            return {
              ...l,
              cardOrderIds: l.cardOrderIds.filter((id) => id !== activeId),
            };
          }
          return l;
        }),
      );

      const patches: Promise<unknown>[] = [
        updateCardOrderIdsApi(targetListId, newTargetCardOrderIds),
      ];

      if (originalListId && originalListId !== targetListId) {
        const originalList = listsRef.current.find(
          (l) => l.id === originalListId,
        );
        const newOriginalCardOrderIds = (
          originalList?.cardOrderIds || []
        ).filter((id) => id !== activeId);

        patches.push(
          updateCardOrderIdsApi(originalListId, newOriginalCardOrderIds),
          fetchApi.patch(`/cards/${activeId}`, {
            listId: targetListId,
          }),
        );
      }

      await Promise.all(patches);
    }

    // Handle drop list
    if (activeType === "List") {
      if (activeId === overId) return;

      const currentOrderedLists = orderedListsRef.current;

      const oldIndex = findIndexById(currentOrderedLists, activeId);
      const newIndex = findIndexById(currentOrderedLists, overId);

      if (oldIndex === -1 || newIndex === -1) return;

      const newOrderedLists = arrayMove(
        currentOrderedLists,
        oldIndex,
        newIndex,
      );

      const newOrderedListIds = newOrderedLists.map((l) => l.id);

      setBoards((prevBoards) =>
        prevBoards.map((board) =>
          board.id === boardId
            ? { ...board, listOrderIds: newOrderedListIds }
            : board,
        ),
      );

      updateListOrderIdsApi(boardId, newOrderedListIds);
    }
  };

  // Custom vùng va chạm
  const customCollisionDetection: CollisionDetection = (args) => {
    const { pointerCoordinates, active } = args;
    if (!pointerCoordinates) return rectIntersection(args);

    const activeType = active?.data?.current?.type;

    if (activeType === "List") {
      const listOnlyArgs = {
        ...args,
        droppableContainers: args.droppableContainers.filter(
          (c) => c.data.current?.type === "List" && c.id !== active.id,
        ),
      };

      const result = rectIntersection(listOnlyArgs);

      if (result.length === 0) {
        return rectIntersection({
          ...args,
          droppableContainers: args.droppableContainers.filter(
            (c) => c.data.current?.type === "List",
          ),
        });
      }

      return result;
    }

    const intersections = args.droppableContainers.filter((container) => {
      const rect = container.rect.current;
      if (!rect) return false;
      const containerType = container.data.current?.type;

      if (containerType === "List") {
        return (
          pointerCoordinates.x >= rect.left &&
          pointerCoordinates.x <= rect.right
        );
      }

      if (containerType === "Card") {
        return (
          pointerCoordinates.x >= rect.left &&
          pointerCoordinates.x <= rect.right &&
          pointerCoordinates.y >= rect.top &&
          pointerCoordinates.y <= rect.bottom
        );
      }

      return false;
    });

    if (intersections.length === 0) return rectIntersection(args);

    const cardIntersections = intersections.filter(
      (c) => c.data.current?.type === "Card",
    );
    if (cardIntersections.length > 0) {
      return cardIntersections.map((c) => ({
        id: c.id,
        data: { droppableContainer: c },
      }));
    }

    return intersections.map((c) => ({
      id: c.id,
      data: { droppableContainer: c },
    }));
  };

  const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: { active: { opacity: "0" } },
    }),
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={customCollisionDetection}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      <div className="relative mt-3 h-[calc(100vh-124px)] w-full overflow-x-auto overflow-y-hidden">
        <ul className="absolute inset-0 mb-0! flex items-start gap-4 overflow-x-auto overflow-y-hidden px-2 pb-18!">
          <SortableContext
            items={orderedLists.map((b) => b.id)}
            strategy={horizontalListSortingStrategy}
          >
            {orderedLists.map((list) => (
              <li key={list.id} className="block h-full list-none">
                <TrelloList list={list as ListI} />
              </li>
            ))}
          </SortableContext>

          {showAddList ? (
            <AddListForm
              value={listInput}
              onChange={setListInput}
              onAdd={handleAddList}
              onClose={() => setShowAddList(false)}
            />
          ) : (
            <div className="shrink-0">
              <button
                className="flex min-w-(--list-box-width) cursor-pointer items-center gap-1 rounded-lg bg-[#ffffff3d] p-3 text-sm font-medium text-white hover:bg-[#ffffff33]"
                onClick={() => setShowAddList(true)}
              >
                <PlusIcon size="16" iconColor="#fff" />
                Thêm danh sách khác
              </button>
            </div>
          )}
        </ul>
      </div>

      {createPortal(
        <DragOverlay dropAnimation={dropAnimation}>
          {activeList && (
            <div className="rotate-5">
              <TrelloList list={activeList} />
            </div>
          )}

          {activeCard && (
            <div className="rotate-5">
              <Card card={activeCard}></Card>
            </div>
          )}
        </DragOverlay>,
        document.body,
      )}
    </DndContext>
  );
}
