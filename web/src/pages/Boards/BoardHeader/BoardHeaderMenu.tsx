import { Fade, Popper } from "@mui/material";

import { ChevronLeftIcon, CloseIcon } from "@/components/Icons";
import { useTheme } from "@/context/ThemeContext";
import type { MenuI } from "./BoardHeader";
import {
  ColorsView,
  PhotosView,
} from "../BoardContent/BackgroundSection/View/View";
import { MenuBackgroundPickerView, MenuSavedView, MenuView } from "./View";

interface Props {
  open: boolean;
  anchorEl: HTMLElement | null;
  menu: MenuI;
  setMenu: (menu: MenuI) => void;
  onClose: () => void;
}

export default function BoardHeaderMenu({
  open,
  anchorEl,
  menu,
  setMenu,
  onClose,
}: Props) {
  const { theme } = useTheme();

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Popper
        open={open}
        anchorEl={anchorEl}
        transition
        placement="left-start"
        style={{ zIndex: 1400 }}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <div className="bg-trello-addBoard-bg -mr-8 w-88 rounded-lg">
              {/* Header */}
              <header className="flex h-10 items-center justify-between px-2">
                {menu !== "main" ? (
                  <button
                    className="hover:bg-trello-icon-bg-hover cursor-pointer rounded p-1.5"
                    onClick={() => setMenu("main")}
                  >
                    <ChevronLeftIcon
                      iconColor={theme === "dark" ? "#a9abaf" : "#505258"}
                      size="size-4"
                    />
                  </button>
                ) : (
                  <div className="w-6" />
                )}
                <span className="text-trello-addBoard-text text-sm font-semibold">
                  {menu === "main" && "Menu"}
                  {menu === "background-piker" && "Thay đổi hình nền"}
                  {menu === "images" && "Ảnh"}
                  {menu === "colors" && "Màu"}
                  {menu === "saved" && "Mục đã lưu trữ"}
                </span>
                <button
                  className="hover:bg-trello-icon-bg-hover cursor-pointer rounded p-1.5"
                  onClick={onClose}
                >
                  <CloseIcon
                    size="16"
                    iconColor={theme === "dark" ? "#a9abaf" : "#505258"}
                  />
                </button>
              </header>

              {/* Content */}
              <div className="max-h-120">
                <div className="flex max-h-[80vh] p-2">
                  <section className="min-h-0 w-full flex-1 scrollbar-thin scrollbar-thumb-[#0b120e24] overflow-y-auto p-1">
                    {menu === "main" && <MenuView setMenu={setMenu} />}
                    {menu === "background-piker" && (
                      <MenuBackgroundPickerView setMenu={setMenu} />
                    )}
                    {menu === "images" && <PhotosView iconCheck={false} />}
                    {menu === "colors" && (
                      <ColorsView
                        gradientColorsViewClass="mb-3 grid grid-cols-2 gap-2"
                        solidColorsViewClass="grid grid-cols-3 gap-2"
                        iconCheck={false}
                      />
                    )}
                    {menu === "saved" && <MenuSavedView />}
                  </section>
                </div>
              </div>
            </div>
          </Fade>
        )}
      </Popper>
    </div>
  );
}
