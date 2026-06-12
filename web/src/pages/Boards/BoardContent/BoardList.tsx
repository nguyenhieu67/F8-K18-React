import { useNavigate } from "react-router-dom";

import { useTrello } from "@/context/TrelloContext";
import toSlug from "@/utils/slug";

export default function BoardList() {
  const { boards } = useTrello();
  const navigate = useNavigate();

  const handleBoardClick = (title: string) => {
    const safeTitle = toSlug(title);

    navigate(`/${safeTitle}`);
  };

  return (
    <>
      {boards.map((board) => {
        const bg = board.background;
        const isImage = bg.type === "image";

        return (
          <button
            key={board.id}
            onClick={() => handleBoardClick(board.title)}
            className={`flex h-40 cursor-pointer items-end rounded-lg p-4 font-semibold text-white shadow-sm transition hover:-translate-y-1 hover:shadow-md ${
              isImage ? bg.value : "bg-cover bg-center"
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
