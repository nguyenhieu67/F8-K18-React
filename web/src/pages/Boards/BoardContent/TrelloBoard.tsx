import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTrello } from "@/context/TrelloContext";
import toSlug from "@/utils/slug";
import type { BoardI } from "@/utils/type";
import List from "../List/List";
import BoardHeader from "../BoardHeader/BoardHeader";

export default function TrelloBoard() {
  const [currentBoard, setCurrentBoard] = useState<BoardI | null>(null);

  const { boards } = useTrello();
  const { boardDetail } = useParams<{ boardDetail: string }>();

  useEffect(() => {
    if (!boards || boards.length === 0 || !boardDetail) return;
    const foundBoard = boards.find((b) => toSlug(b.title) === boardDetail);
    if (foundBoard) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentBoard(foundBoard);
    }
  }, [boardDetail, boards]);

  const bg = currentBoard?.background;
  const isImage = bg?.type === "image";

  return (
    <div className="relative w-full">
      <div
        className={`fixed inset-0 -z-10 transition-all duration-500 ease-linear ${!isImage ? bg?.value : "bg-cover bg-center"}`}
        style={{
          backgroundImage: isImage ? `url(${bg?.value})` : undefined,
        }}
      >
        <BoardHeader board={currentBoard} />
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
    </div>
  );
}
