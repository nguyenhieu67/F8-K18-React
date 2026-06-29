import { useRef, useState } from "react";
import { PlusIcon, CloseIcon, CheckIcon } from "@/components/Icons";
import { fetchApi } from "@/utils/api";
import type { AttachmentI, CardI } from "@/utils/type";
import { useTrello } from "@/context/TrelloContext";

interface Props {
  card: CardI;
}

export default function UploadImage({ card }: Props) {
  const [uploading, setUploading] = useState(false);
  const { setCards } = useTrello();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const tempId = `temp-${Date.now()}`;
    const tempUrl = URL.createObjectURL(file);

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const newAttachment = await fetchApi.post<AttachmentI>(
        `/cards/${card.id}/attachments`,
        formData,
      );

      setCards((prevCards) =>
        prevCards.map((c) => {
          if (c.id !== card.id) return c;
          const currentAttachments = c.attachments ?? [];
          const hasTemp = currentAttachments.some((a) => a.id === tempId);
          return {
            ...c,
            cover: newAttachment.url,
            attachments: hasTemp
              ? currentAttachments.map((a) => (a.id === tempId ? newAttachment : a))
              : [newAttachment, ...currentAttachments],
          };
        })
      );

      await fetchApi.patch(`/cards/${card.id}`, { cover: newAttachment.url });

    } catch (err) {
      setCards((prevCards) =>
        prevCards.map((c) =>
          c.id === card.id
            ? { ...c, attachments: (c.attachments ?? []).filter((a) => a.id !== tempId) }
            : c
        )
      );
      console.error("Upload thất bại:", err);
    } finally {
      setUploading(false);
      URL.revokeObjectURL(tempUrl);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleRemoveCover = async () => {
    setCards((prev) =>
      prev.map((c) => c.id === card.id ? { ...c, cover: null } : c)
    );
    try {
      await fetchApi.patch(`/cards/${card.id}`, { cover: null });
    } catch (err) {
      console.error("Xoá bìa thất bại:", err);
    }
  };

  const handleSetCover = async (url: string) => {
    setCards((prev) =>
      prev.map((c) => c.id === card.id ? { ...c, cover: url } : c)
    );
    try {
      await fetchApi.patch(`/cards/${card.id}`, { cover: url });
    } catch (err) {
      console.error("Đặt bìa thất bại:", err);
    }
  };

  const handleDelete = async (attachmentId: string) => {
    setCards((prevCards) =>
      prevCards.map((c) =>
        c.id === card.id
          ? {
            ...c,
            attachments: (c.attachments ?? []).filter((a) => a.id !== attachmentId),
          }
          : c
      )
    );
    try {
      await fetchApi.delete(`/cards/${card.id}/attachments/${attachmentId}`);
    } catch (err) {
      console.error("Xoá thất bại:", err);
    }
  };

  return (
    <div className="px-2 pb-4">
      {card.cover && (
        <div className="text-center mb-4">
          <button
            onClick={handleRemoveCover}
            className="text-trello-addBoard-text bg-trello-addBoard-bg hover:bg-trello-menu-item-bg-hover cursor-pointer rounded-lg border border-[#8c8f97] px-3 py-1 text-sm"
          >
            Xoá ảnh bìa
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <div className="relative flex h-24 items-center justify-center overflow-hidden rounded-lg bg-[#0515240f] hover:opacity-70">
          {uploading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
          ) : (
            <PlusIcon size="24" />
          )}
          <input
            ref={inputRef}
            type="file"
            accept=".png,.webp,.jpg,.jpeg,image/png,image/webp,image/jpeg"
            disabled={uploading}
            onChange={handleFileChange}
            className="absolute h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
          />
        </div>

        {(card.attachments ?? []).map((att) => {
          return (
            <div
              key={att.id}
              className="group relative h-24 overflow-hidden rounded-lg"
            >
              <img
                src={att.url}
                alt={att.fileName}
                className="h-full w-full cursor-pointer object-cover"
                onClick={() => handleSetCover(att.url)}
              />

              {card.cover === att.url && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <CheckIcon size="16" fillColor="#fff" />
                </div>
              )}

              <button
                type="button"
                onClick={() => handleDelete(att.id)}
                className="absolute right-1 top-1 rounded-full bg-white/70 p-1 opacity-0 group-hover:opacity-100"
              >
                <CloseIcon size="14" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}