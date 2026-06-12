import { useTrello } from "@/context/TrelloContext";
import BoardList from "./Boards/BoardContent/BoardList";
import AddBoardForm from "./Boards/BoardContent/AddBoardForm";
import { useEffect } from "react";

export default function Dashboard() {
  const { boards, filteredBoards, searchKeyword, loading } = useTrello();

  useEffect(() => {
    document.title = "Clone Trello";
  }, []);

  if (loading)
    return (
      <div className="p-6 text-white">Đang đồng bộ dữ liệu từ server...</div>
    );

  return (
    <div className="bg-trello-board-bg h-screen">
      <main className="mx-auto max-w-6xl p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-trello-board-text text-xl font-bold">
            Bảng công việc của bạn
          </h2>
          <AddBoardForm title="Tạo bảng mới" />
        </div>

        {boards.length === 0 ? (
          <div className="border-trello-border bg-trello-surface-soft flex flex-col items-center justify-center rounded-xl border border-solid p-16 shadow-sm">
            <h2 className="text-trello-board-text mb-4 text-center text-3xl font-black">
              Chào mừng bạn! Hiện tại bạn chưa có bảng công việc nào. Tạo bảng
              mới và bắt đầu công việc thôi nào!!!
            </h2>
          </div>
        ) : (
          <div>
            {filteredBoards.length === 0 ? (
              <p className="text-white italic">
                Không tìm thấy bảng nào khớp với từ khóa "{searchKeyword}".
              </p>
            ) : (
              <div className="grid grid-cols-4 gap-5">
                <BoardList />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
