import { useState, useRef, useEffect } from "react";
import type { ChangeEvent, DragEvent } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  Typography,
  Slider,
  CircularProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import ImageOutlinedIcon from "@mui/icons-material/PanoramaOutlined";
import { useTheme } from "@/context/ThemeContext";
import type { UserI } from "@/utils/type";
import { fetchApi } from "@/utils/api";
import { useTrello } from "@/context/TrelloContext";

interface ChangeProfileProps {
  currentUser: UserI;
  open: boolean;
  onClose: () => void;
}

interface UploadAvatarI {
  url: string;
  publicId: string;
  width: number;
  height: number;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export default function ChangeAvatar({
  currentUser,
  open,
  onClose,
}: ChangeProfileProps) {
  const { theme } = useTheme();
  const { setCurrentUser } = useTrello();
  const isDark = theme === "dark";

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1.2);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!selectedFile) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  const validateAndSetFile = (file: File) => {
    setErrorMessage(null);
    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage("Kích thước ảnh lớn hơn 10MB. Vui lòng chọn ảnh khác.");
      setSelectedFile(null);
      return;
    }
    setSelectedFile(file);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setZoomLevel(1.2);
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUpload = async () => {
    if (!selectedFile || !previewUrl) return;

    setIsUploading(true);
    try {
      const canvas = document.createElement("canvas");
      const OUTPUT_SIZE = 400;
      canvas.width = OUTPUT_SIZE;
      canvas.height = OUTPUT_SIZE;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const img = new Image();
      img.src = previewUrl;
      await new Promise<void>((resolve) => { img.onload = () => resolve(); });

      const scale = zoomLevel;
      const srcW = img.naturalWidth / scale;
      const srcH = img.naturalHeight / scale;
      const srcX = (img.naturalWidth - srcW) / 2;
      const srcY = (img.naturalHeight - srcH) / 2;

      ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

      const blob = await new Promise<Blob>((resolve) =>
        canvas.toBlob((b) => resolve(b!), "image/jpeg", 0.9)
      );

      const formData = new FormData();
      formData.append("image", blob, "avatar.jpg");

      const uploadResult = await fetchApi.post<UploadAvatarI>("/uploads/image?folder=avatars", formData);

      const { url, publicId } = uploadResult;

      await fetchApi.patch(`/users/${currentUser.id}`, { avatar: url, avatarPublicId: publicId });

      const updatedUser = await fetchApi.get<UserI>("/users/me");
      setCurrentUser(updatedUser);

      onClose();
      handleRemoveImage();
    } catch (err) {
      console.error("Upload avatar thất bại:", err);
      setErrorMessage("Upload thất bại. Vui lòng thử lại.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        if (isUploading) return;
        onClose();
      }}
      fullWidth
      maxWidth="xs"
      slotProps={{
        paper: {
          sx: {
            bgcolor: "var(--trello-surface)",
            color: "var(--trello-theme-text)",
            border: "1px solid var(--trello-border)",
            borderRadius: "12px",
            p: 1,
          },
        },
        transition: {
          onExited: handleRemoveImage,
        },
      }}
    >
      <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", pt: 3 }}>
        Thay đổi ảnh hồ sơ
      </DialogTitle>

      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          pb: 3,
          overflow: "visible",
        }}
      >
        {!previewUrl ? (
          // Chưa có ảnh
          <>
            <Box
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              sx={{
                width: 240,
                height: 240,
                borderRadius: "50%",
                border: `2px dashed ${errorMessage ? "#ef4444" : isDragActive ? "#0066cc" : "#cccccc"
                  }`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                p: 3,
                textAlign: "center",
                bgcolor: isDragActive ? "rgba(0, 102, 204, 0.05)" : "transparent",
                transition: "all 0.2s ease-in-out",
              }}
            >
              <CloudUploadIcon
                sx={{
                  fontSize: 80,
                  color: errorMessage ? "#ef4444" : "#1976d2",
                  mb: 1,
                }}
              />
              <Typography variant="body2" sx={{ color: "text.secondary", px: 1 }}>
                Kéo và thả hình ảnh của bạn tại đây
              </Typography>
            </Box>

            {errorMessage && (
              <Typography variant="caption" sx={{ color: "#ef4444", fontWeight: "medium", textAlign: "center" }}>
                {errorMessage}
              </Typography>
            )}

            <Typography variant="body2" sx={{ color: "text.secondary", my: 0.5 }}>
              hoặc
            </Typography>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: "none" }}
            />

            <Button
              variant="outlined"
              onClick={handleButtonClick}
              sx={{
                textTransform: "none",
                color: isDark ? "#f5f5f5" : "#000000",
                borderColor: isDark ? "#3f3f46" : "#cccccc",
                "&:hover": {
                  borderColor: isDark ? "#52525b" : "#999999",
                },
                px: 3,
              }}
            >
              Tải ảnh lên
            </Button>
          </>
        ) : (
          // Preview
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              maxWidth: 320,
            }}
          >
            <Box
              sx={{
                position: "relative",
                width: 320,
                height: 320,
                borderRadius: "8px",
                overflow: "hidden",
                bgcolor: "#f0f0f0",
                border: "1px solid var(--trello-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                onClick={handleRemoveImage}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  zIndex: 10,
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  bgcolor: "rgba(0, 0, 0, 0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                  "&:hover": {
                    bgcolor: "rgba(0, 0, 0, 0.8)",
                  },
                }}
              >
                <CloseIcon sx={{ fontSize: 18 }} />
              </Box>

              <img
                src={previewUrl}
                alt="Preview"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  transform: `scale(${zoomLevel})`,
                  transition: "transform 0.1s ease-out",
                }}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                gap: 1.5,
                mt: 2,
              }}
            >
              <ImageOutlinedIcon sx={{ color: isDark ? "#999999" : "#666666" }} />
              <Slider
                value={zoomLevel}
                min={1}
                max={3}
                step={0.1}
                onChange={(_, value) => setZoomLevel(value as number)}
                sx={{
                  color: isDark ? "#52525b" : "#444444",
                  flexGrow: 1,
                  "& .MuiSlider-thumb": {
                    width: 20,
                    height: 20,
                    bgcolor: isDark ? "#a1a1aa" : "#444444",
                  },
                }}
              />
              <ImageOutlinedIcon sx={{ color: isDark ? "#999999" : "#666666" }} />
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button
          onClick={() => {
            onClose();
          }}
          disabled={isUploading}
          variant="outlined"
          sx={{
            textTransform: "none",
            color: isDark ? "#f5f5f5" : "#000000",
            borderColor: isDark ? "#3f3f46" : "#cccccc",
            px: 3,
          }}
        >
          Hủy
        </Button>
        <Button
          variant="contained"
          disabled={!selectedFile || isUploading}
          onClick={handleUpload}
          sx={{
            textTransform: "none",
            bgcolor: "#0066cc",
            color: "#ffffff",
            px: 3,
            "&:hover": {
              bgcolor: "#0052a3",
            },
          }}
        >
          {isUploading ? (
            <CircularProgress size={20} sx={{ color: "#ffffff" }} />
          ) : (
            "Tải lên"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}