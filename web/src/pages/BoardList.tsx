import { useNavigate } from "react-router-dom";
import toSlug from "@/utils/slug";
import { useTrello } from "@/context/TrelloContext";

export default function BoardList() {
  const { boards } = useTrello();
  const navigate = useNavigate();

  const handleBoardClick = (title: string) => {
    const safeTitle = toSlug(title);

    navigate(`/${safeTitle}`);
  };

  return (
    <>
      {boards.map((board) => (
        <button
          key={board.id}
          onClick={() => handleBoardClick(board.title)}
          className="flex h-24 cursor-pointer items-end rounded-lg bg-linear-to-br from-blue-300 to-indigo-500 p-4 font-semibold text-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
          {board.title}
        </button>
      ))}
    </>
  );
}
