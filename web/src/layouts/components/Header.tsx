import { useNavigate } from "react-router-dom";
import { SearchIcon, TrelloIcon } from "@/components/Icons";
import { useTrello } from "@/context/TrelloContext";
import ContextUser from "@/layouts/components/ContextUser";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { useTheme } from "@/context/ThemeContext";

export default function Header() {
  const navigate = useNavigate();
  const { currentUser, searchKeyword, setSearchKeyword, logout } = useTrello();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="border-trello-border bg-trello-header flex h-14 items-center justify-between border-b px-6 text-white shadow-md">
      <div
        className="flex cursor-pointer items-center gap-2"
        onClick={() => navigate("/dashboard")}
      >
        <TrelloIcon width="24" height="24" iconColor="#fff" />
        <span className="font-bold">Trello</span>
      </div>

      <div className="mx-6 flex w-full max-w-[620px] items-center gap-2">
        <div className="flex h-10 flex-1 items-center rounded-md border border-white/35 bg-white/20 px-3 text-sm text-white transition focus-within:border-white/60 focus-within:bg-white/25">
          <label htmlFor="search">
            <SearchIcon iconColor="#fff" />
          </label>
          <input
            id="search"
            placeholder="Tìm kiếm"
            value={searchKeyword}
            className="w-full px-2 text-base font-medium outline-none placeholder:text-white"
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>
        <button className="h-10 shrink-0 cursor-pointer rounded-md bg-white/20 px-4 font-semibold text-white transition hover:bg-white/30">
          Tạo mới
        </button>
      </div>

      <div className="flex items-center gap-4">
        {currentUser ? (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              Chào, {currentUser.name}
            </span>
            <button
              onClick={toggleTheme}
              className="h-9 w-14 rounded-md bg-white/20 text-center text-sm font-semibold text-white transition hover:bg-white/30"
            >
              {theme === "light" ? "Light" : "Dark"}
            </button>
            <NotificationsNoneIcon sx={{ color: "#fff" }} />
            <ContextUser currentUser={currentUser} logout={logout} />
          </div>
        ) : (
          <div className="h-8 w-24 animate-pulse rounded bg-white/20"></div>
        )}
      </div>
    </header>
  );
}
