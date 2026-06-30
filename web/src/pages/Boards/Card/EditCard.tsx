import { Fade, Popper } from "@mui/material";
import { useState } from "react";
import EditCardMenu from "./View/EditCardMenu";
import UploadImage from "./View/UploadImage";
import { CloseIcon } from "@/components/Icons";
import { useTheme } from "@/context/ThemeContext";
import type { CardI } from "@/utils/type";

interface Props {
  open: boolean;
  anchorEl: HTMLElement | null;
  card: CardI
  onSaved: () => void;
}

export default function EditCard({ open, anchorEl, card, onSaved }: Props) {
  const { theme } = useTheme();
  const [menu, setMenu] = useState('edit')

  return (
    <div onClick={(e) => {
      e.stopPropagation()
    }}>
      <Popper
        open={open}
        anchorEl={anchorEl}
        transition
        placement="right-start"
        style={{ zIndex: 1400 }}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <div className="ml-3.5" data-no-dnd="true">
              {menu === 'edit'
                ? <EditCardMenu setMenu={setMenu} onSaved={onSaved} />
                :
                <div className="bg-trello-addBoard-bg max-w-165 w-76 rounded-lg">
                  <header className="flex h-10 items-center justify-between px-2">
                    <div className="w-6" />
                    <span className="text-sm font-semibold text-trello-board-text">
                      {menu === "upload-image" && "Ảnh bìa"}
                    </span>
                    <button
                      className="hover:bg-trello-icon-bg-hover cursor-pointer rounded p-1.5"
                      onClick={() => setMenu('edit')}
                    >
                      <CloseIcon
                        size="16"
                        iconColor={theme === "dark" ? "#a9abaf" : "#505258"}
                      />
                    </button>
                  </header>

                  {/* Content */}
                  <div className="flex max-h-[80vh]">
                    <section className="min-h-0 w-full flex-1 scrollbar-thin scrollbar-thumb-[#0b120e24] overflow-y-auto">
                      {menu === "upload-image" && <UploadImage card={card} />}
                    </section>
                  </div>
                </div>}

            </div>
          </Fade>
        )}
      </Popper>
    </div>
  );
}
