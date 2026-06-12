import { useNavigate } from "react-router-dom";
import toSlug from "@/utils/slug";
import { useTrello } from "@/context/TrelloContext";

export default function BoardList() {
  const { filteredBoards } = useTrello();
  const navigate = useNavigate();

  const handleBoardClick = (title: string) => {
    const safeTitle = toSlug(title);

    navigate(`/${safeTitle}`);
  };

  return (
    <>
      {filteredBoards.map((board) => {
        const bg = board.background;
        const isImage = bg?.type === "image";

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
