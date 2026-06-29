import images from "@/assets/images";
import { CheckIcon, CloseIcon, PlusIcon } from "@/components/Icons";
import { useBackgroundPicker } from "@/context/BackgroundPickerContext";
import type { MenuI } from "../BoardHeader";

interface Props {
  setMenu: (menu: MenuI) => void;
}

export default function MenuBackgroundPickerView({ setMenu }: Props) {
  const {
    selectedId,
    uploadedImages,
    loadingUploaded,
    uploadingNewFile,
    deletingId,
    handleUploadImage,
    handleSelectUploaded,
    handleDeleteUploaded,
  } = useBackgroundPicker();

  const ALLOWED_TYPES = ["image/png", "image/webp", "image/jpeg"];
  const MAX_SIZE_MB = 10;

  const verifyRealImage = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result;
        if (!(result instanceof ArrayBuffer)) {
          resolve(false);
          return;
        }
        const arr = new Uint8Array(result).subarray(0, 4);
        let header = "";
        for (let i = 0; i < arr.length; i++) {
          header += arr[i].toString(16);
        }
        const isPNG = header.startsWith("89504e47");
        const isWebP = header.startsWith("52494646");
        const isJPEG = header.startsWith("ffd8ff");
        resolve(isPNG || isWebP || isJPEG);
      };
      reader.readAsArrayBuffer(file.slice(0, 4));
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      e.target.value = "";
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      e.target.value = "";
      return;
    }

    const isValid = await verifyRealImage(file);
    if (!isValid) {
      e.target.value = "";
      return;
    }

    e.target.value = "";
    await handleUploadImage(file);
  };

  return (
    <>
      <div className="mb-3 grid grid-cols-2 gap-2">
        <button
          className="flex cursor-pointer flex-col items-center justify-center overflow-hidden"
          onClick={() => setMenu("images")}
        >
          <div
            style={{
              backgroundImage: `url(${images.trelloBackgroundImage})`,
            }}
            className={`mb-2 h-24 w-full rounded-lg bg-cover bg-center`}
          ></div>
          <span className="text-trello-addBoard-text text-sm">Ảnh</span>
        </button>
        <button
          className="flex cursor-pointer flex-col items-center justify-center overflow-hidden"
          onClick={() => setMenu("colors")}
        >
          <div
            style={{
              backgroundImage: `url(${images.trelloBackgroundColor})`,
            }}
            className={`mb-2 h-24 w-full rounded-lg bg-cover bg-center`}
          ></div>
          <span className="text-trello-addBoard-text text-sm">Màu</span>
        </button>
      </div>
      <hr className="mb-3 text-[#0b120e24] dark:text-[#e3e4f21f]" />
      <div>
        <h3 className="text-trello-addBoard-text mb-3 font-semibold">
          Tuỳ chọn
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="relative flex h-24 items-center justify-center overflow-hidden rounded-lg bg-[#0515240f] hover:opacity-70">
            {uploadingNewFile ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
            ) : (
              <PlusIcon size="24" />
            )}
            <input
              type="file"
              accept=".png,.webp,.jpg,.jpeg,image/png,image/webp,image/jpeg"
              className="absolute h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
              onChange={handleFileChange}
              disabled={uploadingNewFile}
            />
          </div>

          {loadingUploaded ? (
            <div className="col-span-2 flex h-24 items-center justify-center text-xs text-gray-400">
              Đang tải...
            </div>
          ) : (
            uploadedImages.map((image) => {
              const isActive = image._id === selectedId;
              const isDeleting = deletingId === image._id;

              return (
                <div
                  key={image._id}
                  className={`group relative h-24 w-full overflow-hidden rounded-lg ${isDeleting
                    ? "pointer-events-none cursor-not-allowed"
                    : isActive
                      ? "cursor-default"
                      : "cursor-pointer"
                    }`}
                  onClick={() => handleSelectUploaded(image)}
                >
                  <img
                    src={image.url}
                    alt="background"
                    className="h-full w-full object-cover transition-opacity group-hover:opacity-80"
                  />

                  {isActive && (
                    <span className="absolute top-1/2 left-1/2 -translate-1/2 flex h-6 w-6 items-center justify-center rounded-full bg-white/30 backdrop-blur-sm">
                      <CheckIcon size="12" />
                    </span>
                  )}

                  {isDeleting && (
                    <div className="absolute inset-0 flex items-center justify-center bg-red-500/30">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    </div>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteUploaded(image);
                    }}
                    disabled={isDeleting}
                    className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-xs opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/80 disabled:opacity-0"
                    type="button"
                  >
                    <CloseIcon iconColor="#fff" size="12" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}