import images from "@/assets/images";
import { PlusIcon } from "@/components/Icons";
import type { MenuI } from "../BoardHeader";

interface Props {
  setMenu: (menu: MenuI) => void;
}

export default function MenuBackgroundPickerView({ setMenu }: Props) {
  return (
    <>
      <div className="mb-3 grid grid-cols-2 gap-2">
        <button
          className="flex flex-col items-center justify-center overflow-hidden"
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
          className="flex flex-col items-center justify-center overflow-hidden"
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
      <hr className="mb-3" />
      <div>
        <h3 className="text-trello-addBoard-text mb-3 font-semibold">
          Tuỳ chọn
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="relative flex h-24 items-center justify-center overflow-hidden rounded-lg bg-[#0515240f] hover:opacity-70">
            <span className="">
              <PlusIcon size="24" />
            </span>
            <input
              type="file"
              disabled={true}
              className="absolute h-full w-full cursor-pointer opacity-0"
            />
          </div>
        </div>
      </div>
    </>
  );
}
