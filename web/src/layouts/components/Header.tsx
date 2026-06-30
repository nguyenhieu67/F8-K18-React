import { useNavigate } from "react-router-dom";
import { SearchIcon, TrelloIcon } from "@/components/Icons";
import { useTrello } from "@/context/TrelloContext";
import ContextUser from "@/layouts/components/ContextUser";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { useTheme } from "@/context/ThemeContext";
import AddBoardForm from "@/pages/Boards/BoardContent/AddBoardForm";

export default function Header() {
  const navigate = useNavigate();
  const { currentUser, searchKeyword, setSearchKeyword, logout } = useTrello();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-trello-header sticky top-0 left-0 flex h-14 items-center justify-between px-6 text-white shadow-md">
      <div
        className="flex cursor-pointer items-center gap-2"
        onClick={() => navigate("/dashboard")}
      >
        <TrelloIcon size="24" iconColor="#fff" />
        <span className="font-bold">Trello</span>
      </div>

      <div className="mx-6 flex w-full max-w-155 items-center gap-2">
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
        <AddBoardForm title="Tạo mới" />
      </div>

      <div className="flex items-center gap-4">
        {currentUser ? (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              Chào, {currentUser.username}
            </span>
            <button
              onClick={toggleTheme}
              className="bg-trello-header-button-bg hover:bg-trello-header-button-bg-hover text-trello-header-button-text h-9 w-14 cursor-pointer rounded-md text-center text-sm font-semibold transition"
            >
              {theme === "dark" ? "Light" : "Dark"}
            </button>
            <NotificationsNoneIcon sx={{ color: "#fff" }} />
            <ContextUser currentUser={currentUser} logout={logout} />
          </div>
        ) : (
          <div className="bg-trello-header-button-bg hover:bg-trello-header-button-bg-hover text-trello-header-button-text h-8 w-24 animate-pulse rounded"></div>
        )}
      </div>
    </header>
  );
}
