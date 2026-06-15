// components/ConfirmPopover.tsx
import { Popover } from "@mui/material";
import { useState } from "react";
import { CloseIcon } from "./Icons";
import { useTheme } from "@/context/ThemeContext";

interface Props {
  title: string;
  desc: React.ReactNode;
  buttonName: string;
  className?: string;
  onConfirm: () => void;
  children: React.ReactNode;
}

export default function ConfirmPopover({
  title,
  desc,
  buttonName,
  className,
  onConfirm,
  children,
}: Props) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { theme } = useTheme();

  const handleClose = () => setAnchorEl(null);

  const handleConfirm = () => {
    onConfirm();
    handleClose();
  };

  return (
    <>
      <span onClick={(e) => setAnchorEl(e.currentTarget as HTMLElement)}>
        {children}
      </span>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        sx={{ zIndex: 9999 }}
      >
        <div className="bg-trello-addBoard-bg text-trello-addBoard-text w-72 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="w-6" />
            <h3 className="flex-1 text-center font-semibold">{title}</h3>
            <button
              onClick={handleClose}
              className="hover:bg-trello-icon-bg-hover cursor-pointer rounded-lg p-1.5"
            >
              <CloseIcon
                size="16"
                iconColor={`${theme === "dark" ? "#a9abaf" : "#505258"}`}
              />
            </button>
          </div>
          <p className="mb-4 text-sm">{desc}</p>
          <button
            className={`text-trello-header-button-text w-full cursor-pointer rounded-md bg-red-500 py-2 text-sm font-semibold hover:bg-red-600 ${className}`}
            onClick={handleConfirm}
          >
            {buttonName}
          </button>
        </div>
      </Popover>
    </>
  );
}
