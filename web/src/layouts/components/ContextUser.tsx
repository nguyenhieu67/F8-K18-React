import { useState } from "react";
import type { MouseEvent } from "react";
import { Menu, MenuItem } from "@mui/material";
import { useTheme } from "@/context/ThemeContext";
import ChangeProfile from "@/layouts/components/ChangeProfile";
import type { UserI } from "@/utils/type";

interface ContextUserProps {
  currentUser: UserI;
  logout: () => void;
}

export default function ContextUser({ currentUser, logout }: ContextUserProps) {
  const { theme } = useTheme();
  const [userMenuAnchor, setUserMenuAnchor] = useState<HTMLElement | null>(
    null,
  );
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const isUserMenuOpen = Boolean(userMenuAnchor);
  const isDark = theme === "dark";

  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setUserMenuAnchor(null);
  };

  const handleOpenProfileModal = () => {
    handleCloseUserMenu();
    setIsProfileModalOpen(true);
  };

  const handleCloseProfileModal = () => {
    setIsProfileModalOpen(false);
  };

  const handleLogout = () => {
    handleCloseUserMenu();
    logout();
  };

  return (
    <>
      <div
        onClick={handleOpenUserMenu}
        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white/25 text-sm font-bold uppercase text-white"
      >
        {currentUser.name.charAt(0)}
      </div>

      <Menu
        anchorEl={userMenuAnchor}
        open={isUserMenuOpen}
        onClose={handleCloseUserMenu}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              minWidth: 210,
              bgcolor: "var(--trello-surface)",
              color: "var(--trello-theme-text)",
              border: "1px solid var(--trello-border)",
              borderRadius: "0 0 8px 8px",
              boxShadow: isDark
                ? "0 12px 28px rgba(0, 0, 0, 0.35)"
                : "0 12px 28px rgba(76, 29, 149, 0.22)",
              "& .MuiMenuItem-root": {
                fontSize: 14,
                py: 1.2,
                "&:hover": {
                  bgcolor: isDark ? "#1f1f1f" : "#f3e8ff",
                },
              },
            },
          },
        }}
      >
        <MenuItem onClick={handleOpenProfileModal}>
          Thông tin người dùng
        </MenuItem>
        <MenuItem onClick={handleLogout} sx={{ color: "#ef4444" }}>
          Đăng xuất
        </MenuItem>
      </Menu>

      <ChangeProfile
        currentUser={currentUser}
        open={isProfileModalOpen}
        onClose={handleCloseProfileModal}
      />
    </>
  );
}
