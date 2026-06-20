import { Dialog } from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { CloseIcon } from "@/components/Icons";
import { useTrello } from "@/context/TrelloContext";
import { fetchApi } from "@/utils/api";
import type { BoardI, UserI } from "@/utils/type";

interface Props {
  board: BoardI;
  open: boolean;
  onClose: () => void;
}

// Sinh token ngẫu nhiên cho link mời (giống cách Login mock token).
function genToken() {
  return (
    Math.random().toString(36).substring(2) +
    Math.random().toString(36).substring(2)
  );
}

export default function ShareBoardModal({ board, open, onClose }: Props) {
  const { setBoards } = useTrello();
  const [users, setUsers] = useState<UserI[]>([]);
  const [emailInput, setEmailInput] = useState("");

  // Lấy toàn bộ user 1 lần khi mở modal để: tìm theo email + hiển thị members.
  useEffect(() => {
    if (!open) return;
    (async () => {
      const data = (await fetchApi.get("/users")) as UserI[] | null;
      setUsers(data || []);
    })();
  }, [open]);

  // Cập nhật board trong context để UI (dashboard/header) đồng bộ ngay.
  const syncBoard = (updated: BoardI) =>
    setBoards((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));

  const members = board.members || [];
  const memberUsers = users.filter((u) => members.includes(u.id));

  // B. Mời bằng email
  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = emailInput.trim().toLowerCase();
    if (!email) return;

    const found = users.find((u) => u.email.toLowerCase() === email);
    if (!found) {
      toast.error("Không tìm thấy người dùng");
      return;
    }
    if (members.includes(found.id)) {
      toast.info("Người này đã ở trong bảng");
      return;
    }

    const newMembers = [...members, found.id];
    const updated = { ...board, members: newMembers };
    const res = await fetchApi.patch<BoardI>(`/boards/${board.id}`, {
      members: newMembers,
    });
    if (!res) return;

    syncBoard(updated);
    setEmailInput("");
    toast.success(`Đã thêm ${found.username} vào bảng`);
  };

  // C. Sao chép liên kết (sinh token nếu chưa có)
  const handleCopyLink = async () => {
    let token = board.inviteToken;

    if (!token) {
      token = genToken();
      const res = await fetchApi.patch<BoardI>(`/boards/${board.id}`, {
        inviteToken: token,
      });
      if (!res) return;
      syncBoard({ ...board, inviteToken: token });
    }

    const link = `${window.location.origin}/invite/${board.id}/${token}`;
    try {
      await navigator.clipboard.writeText(link);
      toast.success("Đã sao chép liên kết");
    } catch {
      // Fallback nếu clipboard API bị chặn: hiện link để copy tay.
      window.prompt("Sao chép liên kết:", link);
    }
  };

  // C. Xóa liên kết (vô hiệu link cũ)
  const handleRemoveLink = async () => {
    if (!board.inviteToken) {
      toast.info("Bảng chưa có liên kết");
      return;
    }
    const res = await fetchApi.patch<BoardI>(`/boards/${board.id}`, {
      inviteToken: null,
    });
    if (!res) return;
    syncBoard({ ...board, inviteToken: null });
    toast.success("Đã xóa liên kết");
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <div className="p-5">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#172B4D]">
            Chia sẻ bảng "{board.title}"
          </h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 hover:bg-gray-100"
            aria-label="Đóng"
          >
            <CloseIcon size="18" iconColor="#172B4D" />
          </button>
        </div>

        {/* B. Mời bằng email/tên */}
        <form onSubmit={handleInvite} className="mb-5 flex gap-2">
          <input
            type="text"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="Địa chỉ email hoặc tên"
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm text-[#172B4D] outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Chia sẻ
          </button>
        </form>

        {/* C. Mời bằng liên kết */}
        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm text-[#172B4D]">
            Bất kỳ ai có liên kết đều có thể tham gia
          </p>
          <div className="flex gap-3 text-sm">
            <button
              onClick={handleCopyLink}
              className="cursor-pointer font-medium text-blue-600 hover:underline"
            >
              Sao chép liên kết
            </button>
            <button
              onClick={handleRemoveLink}
              className="cursor-pointer font-medium text-red-500 hover:underline"
            >
              Xóa liên kết
            </button>
          </div>
        </div>

        {/* Danh sách thành viên */}
        <div>
          <h3 className="mb-2 text-xs font-bold tracking-wide text-gray-500 uppercase">
            Thành viên ({memberUsers.length})
          </h3>
          <ul className="flex flex-col gap-3">
            {memberUsers.map((u) => (
              <li key={u.id} className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                  {u.username?.charAt(0).toUpperCase() || "?"}
                </div>
                <div className="leading-tight">
                  <p className="text-sm font-medium text-[#172B4D]">
                    {u.username}
                  </p>
                  <p className="text-xs text-gray-500">{u.email}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Dialog>
  );
}
