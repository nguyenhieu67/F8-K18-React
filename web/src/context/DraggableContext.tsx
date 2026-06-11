import { createContext, useContext, useState } from "react";
import { useTrello } from "./TrelloContext";

interface DraggableContextI {
  draggedListIndex: number | null;
  targetListIndex: number | null;
  targetCardInfo: { listId: string; index: number } | null;
  draggedCardInfo: {
    id: string;
    listId: string;
    index: number;
    content: string;
  } | null;
  handleListDragStart: (index: number) => void;
  handleListDragOver: (e: React.DragEvent, hoverIndex: number) => void;
  handleListDragEnd: () => void;

  handleCardDragStart: (
    e: React.DragEvent,
    cardId: string,
    listId: string,
    index: number,
    content: string,
  ) => void;
  handleCardDragOver: (
    e: React.DragEvent,
    listId: string,
    index: number,
  ) => void;
  handleCardDragEnd: () => void;
}

const DraggableContext = createContext<DraggableContextI | undefined>(
  undefined,
);

export default function DraggableProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [draggedListIndex, setDraggedListIndex] = useState<number | null>(null);
  const [targetListIndex, setTargetListIndex] = useState<number | null>(null);

  const [draggedCardInfo, setDraggedCardInfo] = useState<{
    id: string;
    listId: string;
    index: number;
    content: string;
  } | null>(null);
  const [targetCardInfo, setTargetCardInfo] = useState<{
    listId: string;
    index: number;
  } | null>(null);

  const { lists, setLists, cards, setCards } = useTrello();

  // --- 🟥 LOGIC KÉO THẢ LIST (DỊCH CHUYỂN DỰ ĐOÁN) ---
  const handleListDragStart = (index: number) => {
    setTimeout(() => {
      setDraggedListIndex(index);
      setTargetListIndex(index); // Ban đầu vị trí nhắm tới chính là vị trí gốc
    }, 0);
  };

  const handleListDragOver = (e: React.DragEvent, hoverIndex: number) => {
    e.preventDefault();
    if (draggedListIndex === null) return;

    // Tối ưu chặn re-render thừa: Chỉ set khi thực sự đổi cột qua lại
    if (targetListIndex !== hoverIndex) {
      setTargetListIndex(hoverIndex);
    }
  };

  const handleListDragEnd = async () => {
    if (
      draggedListIndex !== null &&
      targetListIndex !== null &&
      draggedListIndex !== targetListIndex
    ) {
      // 1. Cập nhật Local State cho UI thay đổi lập tức
      const newLists = [...lists];
      const [movedList] = newLists.splice(draggedListIndex, 1);
      newLists.splice(targetListIndex, 0, movedList);
      setLists(newLists);

      // 2. TODO: Gọi API cập nhật position lên database của bạn tại đây nếu cần
      // Vd: await fetchApi.patch(`/lists/reorder`, { positions: ... })
    }
    setDraggedListIndex(null);
    setTargetListIndex(null);
  };

  const handleCardDragStart = (
    e: React.DragEvent,
    cardId: string,
    listId: string,
    index: number,
    content: string,
  ) => {
    e.stopPropagation();

    // 🔥 MẸO QUAN TRỌNG: Tạo một ảnh trống hoàn toàn để ẩn cái bóng ma "bung bét" của trình duyệt đi
    const img = new Image();
    img.src =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    e.dataTransfer.setDragImage(img, 0, 0);

    setTimeout(() => {
      setDraggedCardInfo({ id: cardId, listId, index, content });
      setTargetCardInfo({ listId, index });
    }, 0);
  };

  const handleCardDragOver = (
    e: React.DragEvent,
    listId: string,
    index: number,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (!draggedCardInfo) return;

    // Tối ưu chặn re-render thừa cho Card
    if (targetCardInfo?.listId === listId && targetCardInfo?.index === index)
      return;
    setTargetCardInfo({ listId, index });
  };

  const handleCardDragEnd = async () => {
    if (draggedCardInfo && targetCardInfo) {
      const { id: cardId, listId: sourceListId } = draggedCardInfo;
      const { listId: destListId, index: destIndex } = targetCardInfo;

      // Chỉ xử lý nếu có sự thay đổi vị trí thực tế
      if (sourceListId !== destListId || draggedCardInfo.index !== destIndex) {
        // Tách danh sách card hiện tại ra xử lý vị trí cục bộ
        const updatedCards = [...cards];
        const movedCard = updatedCards.find((c) => c.id === cardId);

        if (movedCard) {
          // Đổi listId gốc sang listId đích
          movedCard.listId = destListId;
          setCards(updatedCards);

          // TODO: Gọi API cập nhật database của bạn tại đây
          // await fetchApi.patch(`/cards/${cardId}`, { listId: destListId, position: destIndex + 1 });
        }
      }
    }
    setDraggedCardInfo(null);
    setTargetCardInfo(null);
  };

  return (
    <DraggableContext.Provider
      value={{
        draggedListIndex,
        targetListIndex,
        draggedCardInfo,
        targetCardInfo,
        handleListDragStart,
        handleListDragOver,
        handleListDragEnd,
        handleCardDragStart,
        handleCardDragOver,
        handleCardDragEnd,
      }}
    >
      {children}
    </DraggableContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDraggable() {
  const context = useContext(DraggableContext);
  if (!context) {
    throw new Error("useDraggable phải được đặt bên trong DraggableProvider");
  }
  return context;
}
