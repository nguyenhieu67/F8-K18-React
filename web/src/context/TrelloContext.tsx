/* eslint-disable react-hooks/set-state-in-effect */
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchApi } from "@/utils/api";
import type { BoardI, CardI, ListI, UserI } from "@/utils/type";

interface TrelloContextType {
  currentUser: UserI | null;
  setCurrentUser: (user: UserI | null) => void;
  boards: BoardI[];
  setBoards: React.Dispatch<React.SetStateAction<BoardI[]>>;
  lists: ListI[];
  setLists: React.Dispatch<React.SetStateAction<ListI[]>>;
  cards: CardI[];
  setCards: React.Dispatch<React.SetStateAction<CardI[]>>;
  filteredBoards: BoardI[];
  searchKeyword: string;
  setSearchKeyword: (keyword: string) => void;
  loading: boolean;
  logout: () => void;
}

const TrelloContext = createContext<TrelloContextType | undefined>(undefined);

export function TrelloProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserI | null>(null);
  const [boards, setBoards] = useState<BoardI[]>([]);
  const [lists, setLists] = useState<ListI[]>([]);
  const [cards, setCards] = useState<CardI[]>([]);
  const [filteredBoards, setFilteredBoards] = useState<BoardI[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const savedUser = localStorage.getItem("current_user");

    if (window.location.pathname === "/register") return;
    if (!token || !savedUser) {
      const path = window.location.pathname;
      localStorage.clear();
      // Chưa đăng nhập mà mở link mời -> lưu lại để quay về sau khi đăng nhập.
      if (path.startsWith("/invite")) {
        localStorage.setItem("redirect_after_login", path);
      }
      navigate("/login");
      return;
    }

    const user = JSON.parse(savedUser) as UserI;
    setCurrentUser(user);

    const getBoards = async () => {
      try {
        // json-server không lọc OR (userId HOẶC members chứa id) trong 1 request,
        // nên lấy toàn bộ boards rồi filter ở client: board mình tạo + board được chia sẻ.
        const [allBoards, listData, cardData] = (await Promise.all([
          fetchApi.get(`/boards`),
          fetchApi.get("/lists"),
          fetchApi.get("/cards"),
        ])) as [BoardI[], ListI[], CardI[]];

        const myBoards = (allBoards || []).filter(
          (board) =>
            board.userId === user.id || board.members?.includes(user.id),
        );

        setBoards(myBoards);
        setLists(listData || []);
        setCards(cardData || []);

        setFilteredBoards(myBoards);
      } catch (error) {
        console.error("Lỗi lấy danh sách board:", error);
      } finally {
        setLoading(false);
      }
    };

    getBoards();
  }, [navigate]);

  useEffect(() => {
    if (searchKeyword.trim() === "") {
      setFilteredBoards(boards);
    } else {
      const filtered = boards.filter((board) =>
        board.title.toLowerCase().includes(searchKeyword.toLowerCase()),
      );
      setFilteredBoards(filtered);
    }
  }, [searchKeyword, boards]);

  const logout = () => {
    localStorage.clear();
    setCurrentUser(null);
    setBoards([]);
    setLists([]);
    setCards([]);
    navigate("/login");
  };

  return (
    <TrelloContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        boards,
        setBoards,
        lists,
        setLists,
        cards,
        setCards,
        filteredBoards,
        searchKeyword,
        setSearchKeyword,
        loading,
        logout,
      }}
    >
      {children}
    </TrelloContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTrello() {
  const context = useContext(TrelloContext);
  if (!context) {
    throw new Error("useTrello phải được đặt bên trong TrelloProvider");
  }
  return context;
}
