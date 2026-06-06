import { useNavigate } from "react-router-dom";
import type { UserI } from "../../utils/type";

interface HeaderProps {
  user: UserI | null;
  onSearch: (keyword: string) => void;
}

export default function Header({ user, onSearch }: HeaderProps) {
  const navigate = useNavigate();

  const token = localStorage.getItem("access_token");
  if (!token) {
    localStorage.clear();
    // eslint-disable-next-line react-hooks/immutability
    window.location.href = "/login";
  }

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className="flex h-14 items-center justify-between border-b border-[#473699] bg-[#473699] px-6 text-white shadow-md">
      <div
        className="cursor-pointer text-xl font-black tracking-wider"
        onClick={() => navigate("/dashboard")}
      >
        CLONE TRELLO
      </div>

      <div className="w-1/2">
        <input
          placeholder="Tìm kiếm Trello"
          className="w-full rounded-md border border-[#dfe1e6] bg-white/20 px-3 py-1.5 text-sm text-white placeholder-white/60 transition outline-none focus:bg-white focus:text-black focus:placeholder-gray-400"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Chào, {user.name}</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1e52cc] text-sm font-bold uppercase">
              {user.name.charAt(0)}
            </div>
            <button
              onClick={handleLogout}
              className="ml-2 cursor-pointer rounded bg-[#1e52cc] px-2 py-1 text-xs font-semibold transition hover:bg-[#567acc]"
            >
              Thoát
            </button>
          </div>
        ) : (
          <div className="h-8 w-24 animate-pulse rounded bg-white/20"></div>
        )}
      </div>
    </header>
  );
}
