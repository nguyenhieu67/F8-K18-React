import { createContext, useContext, useEffect, useState } from "react";
import { useTrello } from "@/context/TrelloContext";
import { fetchApi } from "@/utils/api";
import type { UserI } from "@/utils/type";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { currentUser, setCurrentUser } = useTrello();
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    if (currentUser?.theme) {
      setTheme(currentUser.theme);
    }
  }, [currentUser?.theme]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = async () => {
    if (!currentUser) return;

    const nextTheme: Theme = theme === "light" ? "dark" : "light";

    const updatedUser = await fetchApi.patch<UserI>(
      `/users/${currentUser.id}`,
      {
        theme: nextTheme,
      },
    );

    if (!updatedUser) return;

    setTheme(updatedUser.theme);
    setCurrentUser(updatedUser);

    localStorage.setItem("current_user", JSON.stringify(updatedUser));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme phải được dùng trong ThemeProvider");
  }

  return context;
}
