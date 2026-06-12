import { Fade, Popper, ClickAwayListener } from "@mui/material";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { CloseIcon, EllipsisIcon } from "@/components/Icons";
import { useTrello } from "@/context/TrelloContext";
import type { BoardI } from "@/utils/type";
import { fetchApi } from "@/utils/api";
import toSlug from "@/utils/slug";
import Background from "./Background";

const images = [
  {
    id: "i1",
    value:
      "https://images.unsplash.com/photo-1576506542790-51244b486a6b?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "i2",
    value:
      "https://images.unsplash.com/photo-1780995174272-3515544edd64?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "i3",
    value:
      "https://images.unsplash.com/photo-1770341990092-6a5b0e1b61c2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "i4",
    value:
      "https://images.unsplash.com/photo-1780995174569-bca1738b3c88?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];
const gradientColors = [
  { id: "g1", value: "bg-linear-to-br from-blue-400 to-emerald-400" },
  { id: "g2", value: "bg-linear-to-br from-orange-400 to-rose-400" },
  { id: "g3", value: "bg-linear-to-br from-indigo-900 to-slate-800" },
  { id: "g4", value: "bg-linear-to-br from-violet-500 to-fuchsia-500" },
  { id: "g5", value: "bg-linear-to-br from-green-500 to-teal-700" },
];

interface Props {
  title: string;
}

export default function AddBoardForm({ title }: Props) {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [titleInput, setTitleInput] = useState("");
  const [selectedId, setSelectedId] = useState<string | number | null>("i1");
  const bgRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const { currentUser, setBoards } = useTrello();

  const allItems = [...images, ...gradientColors];
  const selectedItem = allItems.find((item) => item.id === selectedId);
  const isTitleValid = titleInput.trim().length > 0;
  const isImage = selectedItem?.value.startsWith("http");

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen((previousOpen) => !previousOpen);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isTitleValid || !selectedItem) return;
    if (!titleInput.trim()) return;
    try {
      const payload = {
        userId: currentUser?.id,
        title: titleInput,
        listOrderIds: [],
        background: {
          type: isImage ? "image" : "color",
          value: selectedItem.value,
        },
        createdAt: new Date().toISOString(),
      };

      const newBoard = (await fetchApi.post("/boards", payload)) as BoardI;

      navigate(`/${toSlug(newBoard.title)}`);

      setBoards((prev) => [...prev, newBoard]);
      setTitleInput("");
      setOpen(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <div>
        <button
          type="button"
          className="bg-trello-button-bg text-trello-button-text hover:bg-trello-button-bg-hover h-10 cursor-pointer rounded-md px-4 font-medium transition"
          onClick={handleClick}
        >
          {title}
        </button>
        <Popper open={open} anchorEl={anchorEl} transition>
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <section className="mt-2 w-76 rounded-lg bg-white shadow-lg">
                <header className="flex h-12 items-center justify-between p-1">
                  <button className="h-9 w-9 bg-white"></button>
                  <span>Tạo bảng</span>
                  <button className="p-2" onClick={() => setOpen(false)}>
                    <CloseIcon />
                  </button>
                </header>
                <div className="max-h-143 overflow-x-hidden overflow-y-auto p-3">
                  <div className="mb-2 flex justify-center">
                    <div
                      ref={bgRef}
                      style={{
                        backgroundImage: selectedItem?.value.startsWith("http")
                          ? `url(${selectedItem?.value})`
                          : undefined,
                      }}
                      className={`flex h-30 w-50 items-center justify-center rounded bg-cover bg-center shadow-md ${
                        !selectedItem?.value.startsWith("http")
                          ? selectedItem?.value
                          : ""
                      }`}
                    >
                      <img
                        src="https://trello.com/assets/14cda5dc635d1f13bc48.svg"
                        alt="trello"
                        className="border-none"
                      />
                    </div>
                  </div>
                  <fieldset className="mb-1 p-0">
                    <legend className="text-trello-label-text mt-3 mb-1 block text-xs font-bold">
                      Phông nền
                    </legend>
                    <div>
                      <ul className="mb-2 flex justify-between">
                        <Background
                          items={images}
                          type="image"
                          imgClass="w-16 h-10"
                          selectedId={selectedId}
                          onSelect={setSelectedId}
                        />
                      </ul>
                      <ul className="mb-2 flex justify-between">
                        <Background
                          items={gradientColors}
                          type="color"
                          imgClass="w-10 h-8"
                          selectedId={selectedId}
                          onSelect={setSelectedId}
                        />
                        <li className="h-8 w-10">
                          <button className="relative flex h-full min-h-0 w-full cursor-pointer items-center justify-center rounded border border-gray-200 bg-none bg-center p-2">
                            <EllipsisIcon iconColor="#172b4d" />
                          </button>
                        </li>
                      </ul>
                    </div>
                  </fieldset>
                  <form onSubmit={handleSubmit}>
                    <div className="">
                      <label
                        htmlFor="title"
                        className="text-trello-label-text text-xs font-bold"
                      >
                        Tiêu đề bảng{" "}
                        <span className="ml-0.5 text-[#e34935]">*</span>
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={titleInput}
                        className={`text-trello-heading-text w-full rounded-md px-3 py-2 transition-shadow outline-none ${
                          isTitleValid
                            ? "shadow-[inset_0_0_0_1px_rgb(140,141,151)] focus:shadow-[0_0_0_2px_rgb(0,121,191)]"
                            : "shadow-[inset_0_0_0_1px_rgb(227,73,53)] focus:shadow-[inset_0_0_0_1px_rgb(227,73,53)]"
                        }`}
                        onChange={(e) => setTitleInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSubmit(e);
                          }
                        }}
                      />
                    </div>
                    <div className="mt-1 mb-2 flex items-center">
                      <span>👋</span>
                      <p className="text-trello-heading-text ml-3 text-sm">
                        Tiêu đề bảng là bắt buộc
                      </p>
                    </div>
                    <div>
                      <button
                        disabled={!isTitleValid}
                        className={`inline-flex w-full items-center justify-center rounded-md border border-gray-100 px-3 py-1.5 font-medium shadow transition ${
                          isTitleValid
                            ? "cursor-pointer bg-blue-500 text-white hover:bg-blue-600"
                            : "cursor-not-allowed bg-[#091e4208] text-[#080F214A]"
                        }`}
                      >
                        Tạo mới
                      </button>
                    </div>
                  </form>
                  <div className="text-trello-label-text mt-3 text-left text-xs">
                    Bằng cách sử dụng hình ảnh từ Unsplash, bạn đồng ý với{" "}
                    <a href="#!" className="underline">
                      giấy phép
                    </a>{" "}
                    và{" "}
                    <a href="#!" className="underline">
                      Điều khoản dịch vụ
                    </a>
                  </div>
                </div>
              </section>
            </Fade>
          )}
        </Popper>
      </div>
    </ClickAwayListener>
  );
}
