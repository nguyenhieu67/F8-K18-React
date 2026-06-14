import { Fade, Popper } from "@mui/material";
import { ChevronLeftIcon, CloseIcon } from "@/components/Icons";
import { useBackgroundPicker } from "@/context/BackgroundPickerContext";
import { ColorsView, MainView, PhotosView } from "./View/View";
import { useTheme } from "@/context/ThemeContext";

export default function BackgroundPicker() {
  const { view, setView, open, anchorEl, closePicker } = useBackgroundPicker();
  const { theme } = useTheme();

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <Popper
        open={open}
        anchorEl={anchorEl}
        transition
        placement="right"
        style={{ zIndex: 1400 }}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <div className="bg-trello-addBoard-bg ml-3 w-72 rounded-lg shadow-xl">
              {/* Header */}
              <header className="flex h-10 items-center justify-between px-2">
                {view !== "main" ? (
                  <button
                    className="hover:bg-trello-icon-bg-hover cursor-pointer rounded p-1.5"
                    onClick={() => setView("main")}
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
                  {view === "main" && "Phông nền bảng"}
                  {view === "photos" && "Ảnh của Unsplash"}
                  {view === "colors" && "Màu"}
                </span>
                <button
                  className="hover:bg-trello-icon-bg-hover cursor-pointer rounded p-1.5"
                  onClick={closePicker}
                >
                  <CloseIcon
                    size="16"
                    iconColor={theme === "dark" ? "#a9abaf" : "#505258"}
                  />
                </button>
              </header>

              {/* Content */}
              <div className="max-h-120 scrollbar-thin scrollbar-thumb-[#0b120e24] overflow-y-auto p-3">
                {view === "main" && <MainView />}
                {view === "photos" && <PhotosView />}
                {view === "colors" && (
                  <ColorsView
                    gradientColorsViewClass="mb-3 grid grid-cols-3 gap-1"
                    solidColorsViewClass="grid grid-cols-3 gap-1 "
                  />
                )}
              </div>
            </div>
          </Fade>
        )}
      </Popper>
    </div>
  );
}
