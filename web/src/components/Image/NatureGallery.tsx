import { useEffect, useState } from "react";
import { createApi } from "unsplash-js";
import { CheckIcon } from "../Icons";

// 1. Khởi tạo API với Access Key từ biến môi trường
const unsplash = createApi({
  accessKey: import.meta.env.VITE_UNSPLASH_ACCESS_KEY,
});

export interface PhotoI {
  id: string;
  urls: { regular: string; raw: string; full: string; small: string };
  alt_description?: string;
}

interface Props {
  imgSize: string;
  imgType?: "regular" | "raw" | "full" | "small";
  imgCount?: number;
  selectedId: string | number | null;
  onSelect: (id: string | number) => void;
  onDataLoaded?: (photos: PhotoI[]) => void;
}

export function NatureGallery({
  imgSize = "w-16 h-10",
  imgType = "regular",
  imgCount = 5,
  selectedId,
  onSelect,
  onDataLoaded,
}: Props) {
  const [photos, setPhotos] = useState<PhotoI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 2. Hàm gọi API lấy ảnh nature
    const fetchNaturePhotos = async () => {
      try {
        const response = await unsplash.GET("/search/photos", {
          params: {
            query: {
              query: "nature",
              orientation: "landscape",
              per_page: imgCount,
            },
          },
        });

        if (response.data) {
          setPhotos(response.data.results as PhotoI[]);
          onDataLoaded?.(response.data.results);

          return response.data.results;
        }
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNaturePhotos();
  }, [imgCount, onDataLoaded]);

  if (loading) return <div>Đang tải ảnh thiên nhiên...</div>;

  return (
    <>
      {photos.map((photo) => (
        <div
          key={photo.id}
          className={`overflow-hidden rounded-lg shadow-lg ${imgSize}`}
        >
          <button
            onClick={() => onSelect?.(photo.id)}
            style={{
              backgroundImage: `url(${photo.urls[imgType]})`,
            }}
            className="relative flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-cover bg-center shadow transition-transform hover:scale-105"
          >
            {selectedId === photo.id && (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/30 backdrop-blur-sm">
                <CheckIcon size="12" />
              </span>
            )}
          </button>
        </div>
      ))}
    </>
  );
}
