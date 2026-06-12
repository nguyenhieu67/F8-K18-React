import { createContext, useContext, useEffect, useState } from "react";
import { useTrello } from "@/context/TrelloContext";
import { fetchApi } from "@/utils/api";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { currentUser } = useTrello();
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    if (!currentUser?.id) return;

    const getUserTheme = async () => {
      const user = await fetchApi.get<{ theme: Theme }>(
        `/users/${currentUser.id}`,
      );

      if (user?.theme) {
        setTheme(user.theme);
      }
    };

    getUserTheme();
  }, [currentUser?.id]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = async () => {
    if (!currentUser?.id) return;

    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    const updatedUser = await fetchApi.patch<{ theme: Theme }>(
      `/users/${currentUser.id}`,
      {
        theme: nextTheme,
      },
    );

    if (!updatedUser) return;

    setTheme(updatedUser.theme);
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
