import { Dialog } from "@mui/material";

interface Props {
  children: React.ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  open: boolean;
  onClose: () => void;
}

export default function ClosedBoard({
  children,
  size = "sm",
  open,
  onClose,
}: Props) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth={size}>
      {children}
    </Dialog>
  );
}
