import { Link } from "react-router-dom";

import type { MenuI } from "../BoardHeader";
import {
  ChevronLeftRightIcon,
  ChevronRightLeftIcon,
  DeleteIcon,
  MinusIcon,
  SavedIcon,
} from "@/components/Icons";
import { useTrello } from "@/context/TrelloContext";
import { useTheme } from "@/context/ThemeContext";
import { fetchApi } from "@/utils/api";
import ConfirmPopover from "@/components/ConfirmPopover";
import { useCurrentBoard } from "@/hooks";

interface Props {
  setMenu: (menu: MenuI) => void;
}

export default function MenuView({ setMenu }: Props) {
  const {
    lists,
    setLists,
    handleCloseBoard,
    handleDeleteBoard,
    handleReopenBoard,
  } = useTrello();
  const { currentBoard } = useCurrentBoard();
  const { theme } = useTheme();
  const allShrunk = lists.every((l) => l.isShrink);

  const handleToggleShrink = async () => {
    const nextShrink = !allShrunk;

    try {
      await Promise.all(
        lists.map((l) =>
          fetchApi.patch(`/lists/${l.id}`, { isShrink: nextShrink }),
        ),
      );

      setLists((prev) => prev.map((l) => ({ ...l, isShrink: nextShrink })));
    } catch (error) {
      console.error(error);
    }
  };

  const menus = [
    {
      id: 1,
      title: "Thay đổi hình nền",
      icon: (
        <img
          src={currentBoard?.background.value}
          alt="icon"
          className="h-5 w-5 rounded object-cover"
        />
      ),
      onClick: () => {
        setMenu("background-piker");
      },
    },
    {
      id: 2,
      title: "Mục đã lưu trữ",
      icon: (
        <SavedIcon
          size="20"
          iconColor={theme === "dark" ? "#a9abaf" : "#505258"}
        />
      ),
      onClick: () => {
        setMenu("saved");
      },
    },
    {
      id: 3,
      title: allShrunk
        ? "Mở rộng tất cả danh sách"
        : "Thu gọn tất cả danh sách",
      icon: allShrunk ? (
        <ChevronLeftRightIcon
          size="20"
          fillColor={theme === "dark" ? "#a9abaf" : "#505258"}
        />
      ) : (
        <ChevronRightLeftIcon
          size="20"
          fillColor={theme === "dark" ? "#a9abaf" : "#505258"}
        />
      ),
      onClick: () => handleToggleShrink(),
    },
  ];

  return (
    <>
      <ul>
        {menus.map((menu) => (
          <li key={menu.id} className="list-none">
            <button
              className="text-trello-addBoard-text hover:bg-trello-menu-item-bg-hover flex w-full cursor-pointer items-center justify-items-start gap-x-4 rounded-md px-3 py-2"
              onClick={(e) => {
                e.stopPropagation();
                menu.onClick?.();
              }}
            >
              <span>{menu.icon}</span>
              <p>{menu.title}</p>
            </button>
          </li>
        ))}

        {currentBoard?.isClosed && (
          <li className="list-none">
            <ConfirmPopover
              title="Mở lại bảng"
              desc={<>Bạn có muốn mở lại bảng không?</>}
              buttonName="Mở lại bảng"
              className="bg-[#0515240f]! text-[#505258]! shadow-lg hover:bg-[#0b120e24]! dark:bg-[#669df1] dark:text-[#1f1f21] dark:hover:bg-[#8fb8f6]"
              onConfirm={() => handleReopenBoard(currentBoard.id)}
            >
              <button className="text-trello-addBoard-text hover:bg-trello-menu-item-bg-hover flex w-full cursor-pointer items-center justify-items-start gap-x-4 rounded-lg px-3 py-2">
                <span>
                  <MinusIcon
                    size="20"
                    iconColor={theme === "dark" ? "#a9abaf" : "#505258"}
                  />
                </span>
                <p>Mở lại bảng</p>
              </button>
            </ConfirmPopover>
          </li>
        )}

        {currentBoard?.isClosed ? (
          <li className="list-none">
            <ConfirmPopover
              title="Xoá bảng?"
              desc={
                <>
                  Tất cả mọi danh sách, thẻ và hành động sẽ bị xóa, và bạn sẽ
                  không thể mở lại bảng. Không thể hoàn tác.
                </>
              }
              buttonName="Xoá"
              onConfirm={() => handleDeleteBoard(currentBoard.id)}
            >
              <button className="text-trello-addBoard-text hover:bg-trello-menu-item-bg-hover flex w-full cursor-pointer items-center justify-items-start gap-x-4 rounded-lg px-3 py-2">
                <span>
                  <DeleteIcon size="20" iconColor="#c9372c" />
                </span>
                <p>Xoá bảng vĩnh viễn</p>
              </button>
            </ConfirmPopover>
          </li>
        ) : (
          <li className="list-none">
            <ConfirmPopover
              title="Đóng bảng?"
              desc={
                <>
                  Bạn có thể tìm và mở lại các bảng đã đóng ở cuối{" "}
                  <Link to="/dashboard" className="text-blue-500 underline">
                    trang các bảng của bạn
                  </Link>
                  .
                </>
              }
              buttonName="Đóng"
              onConfirm={() => handleCloseBoard(currentBoard?.id as string)}
            >
              <button className="text-trello-addBoard-text hover:bg-trello-menu-item-bg-hover flex w-full cursor-pointer items-center justify-items-start gap-x-4 rounded-lg px-3 py-2">
                <span>
                  <MinusIcon
                    size="20"
                    iconColor={theme === "dark" ? "#a9abaf" : "#505258"}
                  />
                </span>
                <p>Đóng bảng thông tin</p>
              </button>
            </ConfirmPopover>
          </li>
        )}
      </ul>
    </>
  );
}

export const EmptyState = ({ title }: { title: string }) => (
  <div className="pb-3">
    <p className="text-trello-addBoard-text rounded-lg bg-[#0515240f] px-3 py-6 text-center">
      {title}
    </p>
  </div>
);
