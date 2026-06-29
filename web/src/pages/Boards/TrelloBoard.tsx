import List from "./List/List";
import BoardHeader from "./BoardHeader/BoardHeader";
import { useCurrentBoard } from "@/hooks";
import { CircleAlertIcon } from "@/components/Icons";
import { useTrello } from "@/context/TrelloContext";
import { useEffect } from "react";
import { fetchApi } from "@/utils/api";
import type { BoardI } from "@/utils/type";

export default function TrelloBoard() {
  const { setLists, setCards } = useTrello();
  const { currentBoard, isClosed } = useCurrentBoard();
  const { handleReopenBoard } = useTrello();

  useEffect(() => {
    const fetchBoardDetail = async () => {
      if (!currentBoard?.id) return;
      const board = (await fetchApi.get(
        `/boards/${currentBoard?.id}`,
      )) as BoardI;
      setLists(board.lists);
      setCards(board.cards);
    };
    fetchBoardDetail();
  }, [currentBoard?.id, setLists, setCards]);

  useEffect(() => {
    document.title = `${currentBoard?.title} | Trello`;
  }, [currentBoard?.title]);

  const bg = currentBoard?.background;
  const isImage = bg?.type === "image";

  return (
    <div
      className={`-z-10 transition-all duration-500 ease-linear ${!isImage ? bg?.value : "bg-cover bg-center"}`}
      style={{
        backgroundImage: isImage
          ? bg.value.startsWith("data:image")
            ? `url("${bg.value}")`
            : `url(${bg.value})`
          : undefined,
      }}
    >
      {isClosed && (
        <div className="flex w-full items-center justify-center gap-2 bg-[#e9f2fe] px-4 py-3 text-sm text-[#292a2e] dark:bg-[#1d2125] dark:text-white">
          <span>
            <CircleAlertIcon iconColor="#4688ec" />
          </span>
          <p>
            Bảng thông tin này đã đóng. Mở lại bảng thông tin để thực hiện thay
            đổi.{" "}
            <button
              className="cursor-pointer font-semibold underline hover:opacity-70"
              onClick={() => handleReopenBoard(currentBoard?.id as string)}
            >
              Mở lại bảng
            </button>
          </p>
        </div>
      )}
      <BoardHeader board={currentBoard} />
      {currentBoard ? (
        <div
          className={`relative mt-3 ${isClosed ? "h-[calc(100vh-168px)]" : "h-[calc(100vh-124px)]"} w-full overflow-x-auto overflow-y-hidden`}
        >
          <List boardId={currentBoard.id} />
        </div>
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
