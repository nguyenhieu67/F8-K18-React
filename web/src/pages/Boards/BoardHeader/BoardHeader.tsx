import { useEffect, useRef, useState } from "react";

import { Tooltip } from "@/components/Tooltip";
import { EllipsisIcon, ShareIcon, StarIcon } from "@/components/Icons";
import type { BoardI } from "@/utils/type";
import { useTrello } from "@/context/TrelloContext";
import { fetchApi } from "@/utils/api";
import ShareBoardModal from "./ShareBoardModal";
import BoardHeaderMenu from "./BoardHeaderMenu";
import {
  BackgroundPickerProvider,
  type SelectedItemI,
} from "@/context/BackgroundPickerContext";
import { ClickAwayListener } from "@mui/material";
import { useNavigate } from "react-router-dom";

export type MenuI = "main" | "images" | "saved" | "colors" | "background-piker";

interface Props {
  board: BoardI | null | undefined;
}

export default function BoardHeader({ board }: Props) {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menu, setMenu] = useState<MenuI>("main");
  const { currentUser, setBoards } = useTrello();
  const [openShare, setOpenShare] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editMode, setEditMode] = useState<boolean>(false);

  const boardTitleRef = useRef<HTMLInputElement | null>(null);
  const clearTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);


  const navigate = useNavigate();

  // Edit mode
  useEffect(() => {
    if (editMode && boardTitleRef.current) {
      const element = boardTitleRef.current;

      element.focus();
      element.textContent = board?.title ?? "";
      setEditTitle(board?.title ?? "");
    }
  }, [board?.title, editMode]);

  const handleToggleStar = async () => {
    if (!board) return;

    try {
      const updatedBoard = {
        ...board,
        isStarred: !board.isStarred,
      };

      await fetchApi.patch(`/boards/${board.id}`, updatedBoard);

      setBoards((prev) =>
        prev.map((item) => (item.id === board.id ? updatedBoard : item)),
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    return () => {
      if (clearTimeoutRef.current) clearTimeout(clearTimeoutRef.current);
    };
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen((previousOpen) => !previousOpen);
  };

  const handleClose = () => {
    setOpen(false);

    if (clearTimeoutRef.current) clearTimeout(clearTimeoutRef.current);
    clearTimeoutRef.current = setTimeout(() => {
      setMenu("main");
    }, 300);
  };

  const handleBackgroundPicker = async (item: SelectedItemI) => {
    if (!item) return;
    try {
      await fetchApi.patch(`/boards/${board?.id}`, {
        background: {
          type: item.isImage ? "image" : "color",
          value: item.value,
        },
      });

      setBoards((prev) =>
        prev.map((b) =>
          b.id === board?.id
            ? {
              ...b,
              background: {
                type: item.isImage ? "image" : "color",
                value: item.value,
              },
            }
            : b,
        ),
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    if (!editTitle.trim() || editTitle === board?.title) {
      setEditMode(false);
      return;
    }

    const newTitle = editTitle;

    try {
      const res = (await fetchApi.patch(`/boards/${board?.id}`, {
        title: newTitle,
      })) as BoardI;

      setBoards((prevBoards) =>
        prevBoards.map((b) =>
          b.id === board?.id ? { ...b, title: newTitle } : b,
        ),
      );

      setEditTitle("");
      setEditMode(false);

      navigate(`/${res.slug}`, {
        replace: true,
        state: { skipFetch: true },
      });
    } catch (e) {
      console.error("Lỗi khi cập nhật tiêu đề list:", e);
    }
  };

  return (
    <BackgroundPickerProvider
      onSelect={async (item) => {
        handleBackgroundPicker(item);
      }}
    >
      <div className="flex h-14 items-center justify-between bg-[#00000053] p-3 text-xl font-semibold text-white">
        <div className="flex-1">
          <ClickAwayListener onClickAway={() => handleSubmit()}>
            <h2>
              {editMode ? (
                <input
                  ref={boardTitleRef}
                  className="w-1/4 rounded-sm px-2 py-2 shadow-[inset_0_0_0_1px_rgb(140,141,151)] outline-none focus:shadow-[0_0_0_2px_rgb(0,121,191)]"
                  value={editTitle}
                  autoFocus
                  onChange={(e) => setEditTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                />
              ) : (
                <button
                  className="ml-2 w-full cursor-pointer text-left"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditMode(!editMode);
                  }}
                >
                  {board?.title}
                </button>
              )}
            </h2>
          </ClickAwayListener>
        </div>
        <div className="flex gap-1">
          <div className="h-8 w-8">
            <img
              src={`${currentUser?.avatar}`}
              alt="avatar"
              className="h-full w-full rounded-full object-cover"
            />
          </div>

          <Tooltip
            describeChild
            title="Đánh hoặc bỏ đánh dấu sao bảng này. Bảng được đánh dấu sao sẽ hiện ở đầu danh sách Bảng."
          >
            <div
              onClick={handleToggleStar}
              className="cursor-pointer rounded-md p-2 hover:bg-[#ffffff33]"
            >
              <StarIcon
                size="16"
                iconColor={board?.isStarred ? "#FFD700" : "#fff"}
                fillColor={board?.isStarred ? "#FFD700" : "transparent"}
              />
            </div>
          </Tooltip>

          <div
            onClick={() => board && setOpenShare(true)}
            className="flex max-w-100 cursor-pointer items-center rounded-md bg-[#dcdfe4] px-2 hover:bg-white"
          >
            <span className="-ml-1 p-2">
              <ShareIcon size="16" />
            </span>
            <span className="text-sm text-[#172B4D]">Chia sẻ</span>
          </div>

          <ClickAwayListener onClickAway={handleClose}>
            <div>
              <button
                className="cursor-pointer rounded-md p-2 hover:bg-[#ffffff33]"
                onClick={handleClick}
              >
                <EllipsisIcon size="18" iconColor="#fff" />
              </button>
              <BoardHeaderMenu
                open={open}
                anchorEl={anchorEl}
                menu={menu}
                setMenu={setMenu}
                onClose={handleClose}
              />
            </div>
          </ClickAwayListener>
        </div>
      </div>
      {board && (
        <ShareBoardModal
          board={board}
          open={openShare}
          onClose={() => setOpenShare(false)}
        />
      )}
    </BackgroundPickerProvider>
  );
}
