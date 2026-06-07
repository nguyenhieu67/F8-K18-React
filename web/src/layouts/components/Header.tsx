import { useNavigate } from "react-router-dom";
import { useTrello } from "../../context/TrelloContext";
import { SearchIcon } from "../../components/Icons";

export default function Header() {
  const navigate = useNavigate();
  const { currentUser, searchKeyword, setSearchKeyword, logout } = useTrello();

  return (
    <header className="flex h-14 items-center justify-between border-b border-[#473699] bg-[#473699] px-6 text-white shadow-md">
      <div
        className="cursor-pointer text-xl font-black tracking-wider"
        onClick={() => navigate("/dashboard")}
      >
        CLONE TRELLO
      </div>

      <div className="flex w-1/2 items-center rounded-md border border-[#dfe1e6] bg-white/20 px-2 py-1.5 text-sm text-white placeholder-white/60 transition focus:bg-white focus:text-black focus:placeholder-gray-400">
        <label htmlFor="search">
          <SearchIcon iconColor="#fff" />
        </label>
        <input
          id="search"
          placeholder="Tìm kiếm Trello"
          value={searchKeyword}
          className="w-full px-2 outline-none"
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-4">
        {currentUser ? (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              Chào, {currentUser.name}
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1e52cc] text-sm font-bold uppercase">
              {currentUser.name.charAt(0)}
            </div>
            <button
              onClick={logout}
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
