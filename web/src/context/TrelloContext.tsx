/* eslint-disable react-hooks/set-state-in-effect */
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchApi } from "../utils/api";
import type { BoardI, UserI } from "../utils/type";

interface TrelloContextType {
  currentUser: UserI | null;
  setCurrentUser: (user: UserI | null) => void;
  boards: BoardI[];
  setBoards: React.Dispatch<React.SetStateAction<BoardI[]>>;
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
  const [filteredBoards, setFilteredBoards] = useState<BoardI[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const savedUser = localStorage.getItem("current_user");

    if (window.location.pathname === "/register") return;
    if (!token || !savedUser) {
      localStorage.clear();
      navigate("/login");
      return;
    }

    const user = JSON.parse(savedUser) as UserI;
    setCurrentUser(user);

    const getBoards = async () => {
      try {
        const res = (await fetchApi.get(
          `/boards?userId=${user.id}`,
        )) as BoardI[];
        setBoards(res || []);
        setFilteredBoards(res || []);
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
    navigate("/login");
  };

  return (
    <TrelloContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        boards,
        setBoards,
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
