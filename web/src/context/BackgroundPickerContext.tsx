import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { PhotoI } from "@/components/Image/NatureGallery";
import images from "@/assets/images";
import { fetchApi } from "@/utils/api";

export type View = "main" | "photos" | "colors";
interface ColorItemI {
  id: string;
  value: string;
}
export interface SelectedItemI {
  id: string | number;
  value: string;
  isImage: boolean;
  publicId?: string;
}
export interface BackgroundImageI {
  id: string;
  userId: string;
  url: string;
  publicId: string;
  width: number;
  height: number;
}
interface BackgroundPickerContextI {
  open: boolean;
  anchorEl: HTMLElement | null;
  openPicker: (el: HTMLElement) => void;
  closePicker: () => void;
  handleReset: () => void;
  view: View;
  setView: (view: View) => void;
  selectedId: string | number | null;
  setSelectedId: (id: string | number | null) => void;
  natureImages: PhotoI[];
  setNatureImages: (imgs: PhotoI[]) => void;
  selectedItem: SelectedItemI | null;
  setSelectedItem: (item: SelectedItemI) => void;
  onSelect?: (item: SelectedItemI) => void;
  solidColors: ColorItemI[];
  gradientColors: ColorItemI[];
  gradientImageColors: ColorItemI[];
  handleSelectNature: (id: string | number) => void;
  handleSelectColor: (id: string | number) => void;

  // select anh upload tu user
  uploadedImages: BackgroundImageI[];
  loadingUploaded: boolean;
  uploadingNewFile: boolean;
  deletingId: string | null;
  handleUploadImage: (file: File) => Promise<void>;
  handleSelectUploaded: (image: BackgroundImageI) => void;
  handleDeleteUploaded: (image: BackgroundImageI) => Promise<void>;
}

const BackgroundPickerContext = createContext<BackgroundPickerContextI | null>(
  null,
);

const solidColors = [
  { id: "c1", value: "bg-[#0079bf]" },
  { id: "c2", value: "bg-[#d29034]" },
  { id: "c3", value: "bg-[#519839]" },
  { id: "c4", value: "bg-[#b04632]" },
  { id: "c5", value: "bg-[#89609e]" },
  { id: "c6", value: "bg-[#cd5a91]" },
  { id: "c7", value: "bg-[#4bbf6b]" },
  { id: "c8", value: "bg-[#00aecc]" },
  { id: "c9", value: "bg-[#838c91]" },
];

const gradientColors = [
  { id: "g1", value: "bg-[#dceafe]" },
  { id: "g2", value: "bg-[#228cd5]" },
  { id: "g3", value: "bg-[#0b50af]" },
  { id: "g4", value: "bg-[#674284]" },
  { id: "g5", value: "bg-[#a869c1]" },
  { id: "g6", value: "bg-[#ef763a]" },
  { id: "g7", value: "bg-[#f488a6]" },
  { id: "g8", value: "bg-[#3fa495]" },
  { id: "g9", value: "bg-[#374866]" },
  { id: "g10", value: "bg-[#762a14]" },
];

const gradientImageColors = [
  { id: "gI1", value: images.gradImgColor1 },
  { id: "gI2", value: images.gradImgColor2 },
  { id: "gI3", value: images.gradImgColor3 },
  { id: "gI4", value: images.gradImgColor4 },
  { id: "gI5", value: images.gradImgColor5 },
  { id: "gI6", value: images.gradImgColor6 },
  { id: "gI7", value: images.gradImgColor7 },
  { id: "gI8", value: images.gradImgColor8 },
  { id: "gI9", value: images.gradImgColor9 },
  { id: "gI10", value: images.gradImgColor10 },
];

export function BackgroundPickerProvider({
  children,
  onSelect,
}: {
  children: ReactNode;
  onSelect?: (item: SelectedItemI) => void;
}) {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [view, setView] = useState<View>("main");
  const [selectedId, setSelectedId] = useState<string | number | null>(
    "owcJsiIK7UU",
  );
  const [selectedItem, setSelectedItem] = useState<SelectedItemI | null>({
    id: "owcJsiIK7UU",
    value:
      "https://images.unsplash.com/photo-1759681770982-313332e7f42c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzU3ODN8MHwxfHNlYXJjaHwxfHxuYXR1cmV8ZW58MHwwfHx8MTc4MTI3OTAwOHww&ixlib=rb-4.1.0&q=80&w=1080",
    isImage: true,
  });

  const [natureImages, setNatureImages] = useState<PhotoI[]>([]);
  const [uploadedImages, setUploadedImages] = useState<BackgroundImageI[]>([]);
  const [loadingUploaded, setLoadingUploaded] = useState(true);
  const [uploadingNewFile, setUploadingNewFile] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const clearTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const fetchUploadedImages = async () => {
      try {
        setLoadingUploaded(true);
        const data = (await fetchApi.get(`/background-images`)) as BackgroundImageI[];
        setUploadedImages(data);
      } catch (error) {
        console.error("Lỗi tải danh sách ảnh:", error);
      } finally {
        setLoadingUploaded(false);
      }
    };
    fetchUploadedImages();
  }, []);

  useEffect(() => {
    return () => {
      if (clearTimeoutRef.current) clearTimeout(clearTimeoutRef.current);
    };
  }, []);

  const openPicker = (el: HTMLElement) => {
    if (!el || !document.contains(el)) return;
    setAnchorEl(el);
    setOpen(true);
    setView("main");
  };

  const closePicker = () => {
    setOpen(false);
    if (clearTimeoutRef.current) clearTimeout(clearTimeoutRef.current);
    clearTimeoutRef.current = setTimeout(() => {
      setView("main");
    }, 300);
  };

  const handleReset = () => {
    setOpen(false);
    closePicker();
    if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
    resetTimeoutRef.current = setTimeout(() => {
      setSelectedId("owcJsiIK7UU");
      setSelectedItem({
        id: "owcJsiIK7UU",
        value:
          "https://images.unsplash.com/photo-1759681770982-313332e7f42c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzU3ODN8MHwxfHNlYXJjaHwxfHxuYXR1cmV8ZW58MHwwfHx8MTc4MTI3OTAwOHww&ixlib=rb-4.1.0&q=80&w=1080",
        isImage: true,
      });
    }, 300);
  };


  const handleSelectNature = (id: string | number) => {
    if (id === selectedId) return;

    const img = natureImages.find((i) => i.id === id);
    if (!img) return;
    const item = { id, value: img.urls.regular, isImage: true };
    setSelectedId(id);
    setSelectedItem(item);
    onSelect?.(item);
  };

  const handleSelectColor = (id: string | number) => {
    if (id === selectedId) return;

    const allColors = [
      ...gradientColors,
      ...solidColors,
      ...gradientImageColors,
    ];
    const color = allColors.find((c) => c.id === id);
    if (!color) return;
    const item = {
      id,
      value: color.value,
      isImage:
        color.value.startsWith("http") || color.value.startsWith("data:image"),
    };

    setSelectedId(id);
    setSelectedItem(item);
    onSelect?.(item);
  };

  const handleUploadImage = async (file: File) => {
    try {
      setUploadingNewFile(true);
      const formData = new FormData();
      formData.append("image", file);

      const newImage = (await fetchApi.post(
        `/background-images`,
        formData
      )) as BackgroundImageI;

      setUploadedImages((prev) => [newImage, ...prev]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error?.response?.status === 409) {
        return;
      }
      console.error(error);
    } finally {
      setUploadingNewFile(false);
    }
  };

  // Click chọn ảnh đã có trong danh sách - dùng chung pattern check active với selectedId
  const handleSelectUploaded = (image: BackgroundImageI) => {
    if (image.id === selectedId) return; // tận dụng đúng check có sẵn, không cần state applyingId riêng

    const item: SelectedItemI = {
      id: image.id,
      value: image.url,
      isImage: true,
      publicId: image.publicId,
    };

    setSelectedId(image.id);
    setSelectedItem(item);
    onSelect?.(item);
  };

  const handleDeleteUploaded = async (image: BackgroundImageI) => {
    if (deletingId) return;
    setDeletingId(image.id);
    try {
      await fetchApi.delete(`/background-images/${image.id}`);
      setUploadedImages((prev) => prev.filter((img) => img.id !== image.id));
    } catch (error) {
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <BackgroundPickerContext.Provider
      value={{
        open,
        anchorEl,
        openPicker,
        closePicker,
        handleReset,
        view,
        setView,
        selectedId,
        setSelectedId,
        natureImages,
        setNatureImages,
        selectedItem,
        setSelectedItem,
        onSelect,
        solidColors,
        gradientColors,
        gradientImageColors,
        handleSelectNature,
        handleSelectColor,
        uploadedImages,
        loadingUploaded,
        uploadingNewFile,
        deletingId,
        handleUploadImage,
        handleSelectUploaded,
        handleDeleteUploaded,
      }}
    >
      {children}
    </BackgroundPickerContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useBackgroundPicker() {
  const ctx = useContext(BackgroundPickerContext);
  if (!ctx)
    throw new Error(
      "useBackgroundPicker must be used within BackgroundPickerProvider",
    );
  return ctx;
}
