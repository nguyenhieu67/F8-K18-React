import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTrello } from "@/context/TrelloContext";
import List from "@/components/List/List";
import toSlug from "@/utils/slug";
import type { BoardI } from "@/utils/type";

export default function TrelloBoard() {
  const { boardDetail } = useParams<{ boardDetail: string }>();
  const { boards } = useTrello();

  const [currentBoard, setCurrentBoard] = useState<BoardI | null>(null);

  useEffect(() => {
    if (!boards || boards.length === 0 || !boardDetail) return;

    const foundBoard = boards.find((b) => toSlug(b.title) === boardDetail);

    if (foundBoard) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentBoard(foundBoard);
    }
  }, [boardDetail, boards]);

  return (
    <div className="p-4">
      <h1 className="mb-4 text-xl font-bold text-white">
        {currentBoard ? currentBoard.title : "Đang tải dữ liệu Board..."}
      </h1>
      {currentBoard ? (
        <List boardId={currentBoard.id} />
      ) : (
        <div className="text-white">Vui lòng đợi...</div>
      )}
    </div>
  );
}
