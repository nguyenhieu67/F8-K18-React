import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTrello } from "@/context/TrelloContext";
import toSlug from "@/utils/slug";
import type { BoardI } from "@/utils/type";
import List from "./List/List";

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
    <div>
      <h1 className="h-14 p-3 text-xl font-bold text-white">
        {currentBoard ? currentBoard.title : "Đang tải dữ liệu Board..."}
      </h1>
      {currentBoard ? (
        <List boardId={currentBoard.id} />
      ) : (
        <div className="h-screen text-white">
          <h2 className="mt-10 text-center text-4xl font-bold">
            Vui lòng đợi...
          </h2>
        </div>
      )}
    </div>
  );
}
