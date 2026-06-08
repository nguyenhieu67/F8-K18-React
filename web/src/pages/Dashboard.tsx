import { useTrello } from "@/context/TrelloContext";
import { fetchApi } from "@/utils/api";
import type { BoardI } from "@/utils/type";

export default function Dashboard() {
  const {
    currentUser,
    boards,
    filteredBoards,
    searchKeyword,
    setBoards,
    loading,
  } = useTrello();

  const handleCreateBoard = async () => {
    const title = prompt("Nhập tên bảng Trello mới:");
    if (!title || !currentUser) return;

    const newBoardData = {
      userId: currentUser.id,
      title: title,
    };

    try {
      const savedBoard = (await fetchApi.post(
        "/boards",
        newBoardData,
      )) as BoardI;

      setBoards((prev) => [...prev, savedBoard]);
    } catch (error) {
      console.error(error);
      alert("Không thể tạo bảng mới!");
    }
  };

  if (loading)
    return (
      <div className="p-6 text-white">Đang đồng bộ dữ liệu từ server...</div>
    );

  return (
    <div className="min-h-screen bg-[#a869c1]">
      <main className="mx-auto max-w-6xl p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            Bảng công việc của bạn
          </h2>
          <button
            onClick={handleCreateBoard}
            className="cursor-pointer rounded-lg bg-[#ffffff3d] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#ffffff33]"
          >
            + Tạo bảng mới
          </button>
        </div>

        {boards.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-solid border-[#ffffff8d] bg-[#ffffff6d] p-16 shadow-sm">
            <p className="mb-4 text-lg text-white">
              Chào mừng bạn! Hiện tại bạn chưa có bảng công việc nào.
            </p>
            <button
              onClick={handleCreateBoard}
              className="cursor-pointer rounded-lg bg-neutral-500 px-6 py-2.5 font-semibold text-white shadow transition hover:bg-neutral-400"
            >
              Tạo bảng đầu tiên của bạn
            </button>
          </div>
        ) : (
          <div>
            {filteredBoards.length === 0 ? (
              <p className="text-white italic">
                Không tìm thấy bảng nào khớp với từ khóa "{searchKeyword}".
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                {filteredBoards.map((board) => (
                  <div
                    key={board.id}
                    className="flex h-24 cursor-pointer items-end rounded-lg bg-linear-to-br from-blue-300 to-indigo-500 p-4 font-semibold text-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                  >
                    <h3 className="w-full truncate">{board.title}</h3>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
