import { useNavigate } from "react-router-dom";

import toSlug from "@/utils/slug";
import type { BoardI } from "@/utils/type";

interface BoardListProps {
  boards: BoardI[];
}

export default function BoardList({ boards }: BoardListProps) {
  const navigate = useNavigate();

  const handleBoardClick = (title: string) => {
    const safeTitle = toSlug(title);

    navigate(`/${safeTitle}`);
  };

  return (
    <>
      {boards.map((board) => {
        const bg = board.background;
        const isImage = bg?.type === "image";

        if (board.isClosed) return;

        return (
          <button
            key={board.id}
            onClick={() => handleBoardClick(board.title)}
            className={`flex h-40 cursor-pointer items-end rounded-lg p-4 font-semibold text-white shadow-sm transition hover:-translate-y-1 hover:shadow-md ${
              isImage
                ? "bg-cover bg-center"
                : "bg-linear-to-br from-blue-300 to-indigo-500"
            }`}
            style={{
              backgroundImage: isImage ? `url(${bg.value})` : undefined,
            }}
          >
            {board.title}
          </button>
        );
      })}
    </>
  );
}
