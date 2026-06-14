import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { useTrello } from "@/context/TrelloContext";
import { fetchApi } from "@/utils/api";
import type { BoardI } from "@/utils/type";
import toSlug from "@/utils/slug";

type Status = "processing" | "invalid";

export default function Invite() {
  const { boardId, inviteToken } = useParams<{
    boardId: string;
    inviteToken: string;
  }>();
  const { loading, currentUser, setBoards } = useTrello();
  const navigate = useNavigate();

  const [status, setStatus] = useState<Status>("processing");
  const handled = useRef(false); // tránh chạy 2 lần (StrictMode)

  useEffect(() => {
    // Chờ context load xong + đã đăng nhập.
    // (Nếu chưa đăng nhập, context đã tự lưu link và điều hướng sang /login.)
    if (loading || !currentUser || handled.current) return;
    handled.current = true;

    (async () => {
      // Lấy toàn bộ boards rồi tìm theo id (tránh 404 -> alert của fetchApi).
      const allBoards = (await fetchApi.get("/boards")) as BoardI[] | null;
      const board = allBoards?.find((b) => b.id === boardId);

      // Token không khớp / board không tồn tại / link đã bị xóa.
      if (!board || !board.inviteToken || board.inviteToken !== inviteToken) {
        setStatus("invalid");
        return;
      }

      const members = board.members || [];
      let joined = board;
      if (!members.includes(currentUser.id)) {
        const newMembers = [...members, currentUser.id];
        const res = await fetchApi.patch<BoardI>(`/boards/${board.id}`, {
          members: newMembers,
        });
        if (!res) {
          setStatus("invalid");
          return;
        }
        joined = { ...board, members: newMembers };
      }

      // Đưa board vào context để mở được bằng slug.
      setBoards((prev) =>
        prev.some((b) => b.id === joined.id) ? prev : [...prev, joined],
      );
      toast.success(`Đã tham gia bảng "${joined.title}"`);
      navigate(`/${toSlug(joined.title)}`);
    })();
  }, [loading, currentUser, boardId, inviteToken, setBoards, navigate]);

  return (
    <div className="bg-trello-board-bg flex min-h-screen items-center justify-center text-white">
      {status === "processing" ? (
        <h2 className="text-2xl font-bold">Đang xử lý lời mời...</h2>
      ) : (
        <div className="text-center">
          <h2 className="mb-3 text-2xl font-bold">Liên kết không hợp lệ</h2>
          <p className="mb-6 text-white/80">
            Lời mời có thể đã bị xóa hoặc không còn hiệu lực.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-trello-button-bg text-trello-button-text hover:bg-trello-button-bg-hover cursor-pointer rounded-md px-4 py-2 font-medium"
          >
            Về trang chủ
          </button>
        </div>
      )}
    </div>
  );
}
