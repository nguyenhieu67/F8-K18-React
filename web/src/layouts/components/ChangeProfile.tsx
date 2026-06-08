import { useState } from "react";
import type { ChangeEvent } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useTheme } from "@/context/ThemeContext";
import { useTrello } from "@/context/TrelloContext";
import { fetchApi } from "@/utils/api";
import type { UserI } from "@/utils/type";

interface ChangeProfileProps {
  currentUser: UserI;
  open: boolean;
  onClose: () => void;
}

export default function ChangeProfile({
  currentUser,
  open,
  onClose,
}: ChangeProfileProps) {
  const { theme } = useTheme();
  const { setCurrentUser } = useTrello();
  const [userForm, setUserForm] = useState({
    name: currentUser.name,
    email: currentUser.email,
  });
  const isDark = theme === "dark";
  const textFieldSx = {
    "& .MuiOutlinedInput-root": {
      color: "var(--trello-theme-text)",
      "& fieldset": {
        borderColor: isDark ? "var(--trello-border)" : "#c4b5fd",
        borderWidth: 1,
      },
      "&:hover fieldset": {
        borderColor: isDark ? "#525252" : "#c084fc",
      },
      "&.Mui-focused fieldset": {
        borderColor: isDark ? "#a3a3a3" : "#7c3aed",
      },
    },
    "& .MuiInputLabel-root": {
      color: "var(--trello-theme-muted)",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: isDark ? "#f5f5f5" : "#7c3aed",
    },
  };

  const handleChangeUserForm = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setUserForm({
      ...userForm,
      [name]: value,
    });
  };

  const handleUpdateUser = async () => {
    const updatedUser = await fetchApi.put<UserI>(`/users/${currentUser.id}`, {
      ...currentUser,
      ...userForm,
    });

    if (!updatedUser) return;

    setCurrentUser(updatedUser);
    localStorage.setItem("current_user", JSON.stringify(updatedUser));
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      slotProps={{
        paper: {
          sx: {
            bgcolor: "var(--trello-surface)",
            color: "var(--trello-theme-text)",
            border: "1px solid var(--trello-border)",
          },
        },
      }}
    >
      <DialogTitle>Thông tin người dùng</DialogTitle>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          overflow: "visible",
          pt: "24px !important",
        }}
      >
        <TextField
          label="Tên"
          name="name"
          value={userForm.name}
          onChange={handleChangeUserForm}
          fullWidth
          sx={{ mt: 0.5, ...textFieldSx }}
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          value={userForm.email}
          onChange={handleChangeUserForm}
          fullWidth
          sx={textFieldSx}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          sx={{ color: isDark ? "#f5f5f5" : "#7c3aed" }}
        >
          Hủy
        </Button>
        <Button
          variant="contained"
          onClick={handleUpdateUser}
          sx={{
            bgcolor: isDark ? "#27272a" : "#7c3aed",
            "&:hover": {
              bgcolor: isDark ? "#3f3f46" : "#6d28d9",
            },
          }}
        >
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
}
