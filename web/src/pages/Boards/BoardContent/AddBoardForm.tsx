import { Fade, Popper, ClickAwayListener } from "@mui/material";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { CloseIcon, EllipsisIcon } from "@/components/Icons";
import { useTrello } from "@/context/TrelloContext";
import type { BoardI } from "@/utils/type";
import { fetchApi } from "@/utils/api";
import { NatureGallery } from "@/components/Image/NatureGallery";
import { BackgroundPreview } from "./BackgroundSection";
import BackgroundPicker from "./BackgroundSection/BackgroundPicker";
import { useBackgroundPicker } from "@/context/BackgroundPickerContext";
import images from "@/assets/images";
import { useTheme } from "@/context/ThemeContext";

interface Props {
  title: string;
  className?: string;
  placement?:
    | "auto-end"
    | "auto-start"
    | "auto"
    | "bottom-end"
    | "bottom-start"
    | "bottom"
    | "left-end"
    | "left-start"
    | "left"
    | "right-end"
    | "right-start"
    | "right"
    | "top-end"
    | "top-start"
    | "top";
}

export default function AddBoardForm({
  title,
  className,
  placement = "bottom",
}: Props) {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [titleInput, setTitleInput] = useState("");

  const bgRef = useRef<HTMLDivElement | null>(null);
  const bgPickerAnchorRef = useRef<HTMLButtonElement | null>(null);
  const isClosingPickerRef = useRef(false);

  const navigate = useNavigate();

  const { currentUser, setBoards } = useTrello();
  const { theme } = useTheme();
  const {
    selectedId,
    setSelectedId,
    setNatureImages,
    openPicker,
    closePicker,
    selectedItem,
    setSelectedItem,
    open: bgPickerOpen,
    gradientColors,
    handleSelectNature,
    handleSelectColor,
  } = useBackgroundPicker();

  const isImage = selectedItem?.isImage ?? false;

  const isTitleValid = titleInput.trim().length > 0;

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
        members: currentUser?.id ? [currentUser.id] : [],
        background: {
          type: isImage ? "image" : "color",
          value: selectedItem.value,
        },
        inviteToken: null,
      };

      const newBoard = (await fetchApi.post("/boards", payload)) as BoardI;
      navigate(`/${newBoard.slug}`);
      toast.success("Đã tạo bảng thành công.");
      setBoards((prev) => [...prev, newBoard]);
      setTitleInput("");
      setOpen(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleClickAway = () => {
    if (bgPickerOpen) {
      closePicker();
      return;
    }
    setOpen(false);
  };

  const handleReset = () => {
    setTimeout(() => {
      setSelectedId("owcJsiIK7UU");
      setSelectedItem({
        id: "owcJsiIK7UU",
        value:
          "https://images.unsplash.com/photo-1759681770982-313332e7f42c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzU3ODN8MHwxfHNlYXJjaHwxfHxuYXR1cmV8ZW58MHwwfHx8MTc4MTI3OTAwOHww&ixlib=rb-4.1.0&q=80&w=1080",
        isImage: true,
      });
    }, 300);
    setOpen(false);
    closePicker();
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div>
        <button
          type="button"
          className={`bg-trello-header-button-bg text-trello-header-button-text hover:bg-trello-header-button-bg-hover h-10 cursor-pointer rounded-md px-4 font-medium transition ${className}`}
          onClick={handleClick}
        >
          {title}
        </button>
        <Popper
          open={open}
          anchorEl={anchorEl}
          transition
          placement={placement}
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <section className="bg-trello-addBoard-bg m-2 w-76 overflow-hidden rounded-lg shadow-lg">
                <header className="flex h-12 items-center justify-between p-1">
                  <button className="h-9 w-9"></button>
                  <span className="text-trello-addBoard-text">Tạo bảng</span>
                  <button
                    className="hover:bg-trello-icon-bg-hover cursor-pointer rounded p-1.5"
                    onClick={handleReset}
                  >
                    <CloseIcon
                      size="16"
                      iconColor={theme === "dark" ? "#a9abaf" : "#000"}
                    />
                  </button>
                </header>
                {/* Content */}
                <div className="max-h-[80vh] overflow-y-auto p-3">
                  {/* Preview */}
                  <div className="mb-2 flex justify-center">
                    <div
                      ref={bgRef}
                      style={{
                        backgroundImage: isImage
                          ? isImage
                            ? `url("${selectedItem?.value}")`
                            : `url(${selectedItem?.value})`
                          : undefined,
                      }}
                      className={`flex h-30 w-50 items-center justify-center rounded bg-cover bg-center shadow-md ${
                        !isImage ? selectedItem?.value : ""
                      }`}
                    >
                      <img
                        src={images.trelloBackgroundPreview}
                        alt="trello"
                        className="border-none"
                      />
                    </div>
                  </div>
                  {/* Select background */}
                  <fieldset className="mb-1 p-0">
                    <legend className="text-trello-addBoard-text mt-3 mb-1 block text-xs font-bold">
                      Phông nền
                    </legend>
                    <div>
                      {/* Background Image */}
                      <ul className="mb-2 flex justify-between">
                        <NatureGallery
                          imgSize="w-16 h-10"
                          imgCount={4}
                          selectedId={selectedId}
                          onSelect={handleSelectNature}
                          onDataLoaded={setNatureImages}
                        />
                      </ul>
                      {/* Background Color */}
                      <ul className="mb-2 flex justify-between">
                        <BackgroundPreview
                          items={gradientColors}
                          imgClass="w-10 h-8"
                          limit={5}
                          selectedId={selectedId}
                          onSelect={handleSelectColor}
                        />
                        <li className="h-8 w-10">
                          <button
                            ref={bgPickerAnchorRef}
                            className={`flex h-full min-h-0 w-full cursor-pointer items-center justify-center rounded border border-gray-200 p-2 dark:bg-gray-300 ${bgPickerOpen ? "bg-[#292a2e]" : "hover:bg-[#0515240f] dark:hover:bg-gray-200"}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (bgPickerOpen) {
                                closePicker();
                                return;
                              }
                              isClosingPickerRef.current = false;
                              if (bgPickerAnchorRef.current) {
                                openPicker(bgPickerAnchorRef.current);
                              }
                            }}
                          >
                            <EllipsisIcon
                              iconColor={`${bgPickerOpen ? "#fff" : "#172b4d"}`}
                            />
                          </button>
                          <BackgroundPicker />
                        </li>
                      </ul>
                    </div>
                  </fieldset>
                  {/* From create title */}
                  <form onSubmit={handleSubmit}>
                    <div className="">
                      <label
                        htmlFor="title"
                        className="text-trello-addBoard-text text-xs font-bold"
                      >
                        Tiêu đề bảng{" "}
                        <span className="ml-0.5 text-[#e34935]">*</span>
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={titleInput}
                        className={`text-trello-addBoard-text w-full rounded-md px-3 py-2 transition-shadow outline-none ${
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
                      <p className="text-trello-heading-text ml-3 text-sm dark:text-[#cecfd2]">
                        Tiêu đề bảng là bắt buộc
                      </p>
                    </div>
                    <div>
                      <button
                        disabled={!isTitleValid}
                        className={`inline-flex w-full items-center justify-center rounded-md border border-gray-100 px-3 py-1.5 font-medium shadow transition dark:border-none ${
                          isTitleValid
                            ? "text-trello-button-text cursor-pointer bg-[#1868db] hover:opacity-80"
                            : "cursor-not-allowed bg-[#091e4208] text-[#080F214A] dark:bg-[#e3e4f21f] dark:text-[#e5e9f640]"
                        }`}
                      >
                        Tạo mới
                      </button>
                    </div>
                  </form>
                  {/* ----  */}
                  <div className="text-trello-addBoard-text mt-3 text-left text-xs">
                    Bằng cách sử dụng hình ảnh từ Unsplash, bạn đồng ý với{" "}
                    <a
                      href="https://unsplash.com/fr/licence"
                      target="_blank"
                      className="underline"
                    >
                      giấy phép
                    </a>{" "}
                    và{" "}
                    <a
                      href="https://unsplash.com/fr/conditions"
                      target="_blank"
                      className="underline"
                    >
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
