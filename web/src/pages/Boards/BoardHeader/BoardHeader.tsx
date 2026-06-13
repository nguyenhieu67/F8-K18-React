import { Tooltip } from "@/components/Tooltip";
import { EllipsisIcon, ShareIcon, StarIcon } from "@/components/Icons";
import type { BoardI } from "@/utils/type";

interface Props {
  board: BoardI | null;
}

export default function BoardHeader({ board }: Props) {
  return (
    <div className="flex h-14 items-center justify-between bg-[#00000053] p-3 text-xl text-white">
      <div className="flex-1">
        <h2 className="font-bold">{board?.title}</h2>
      </div>
      <div className="flex gap-1">
        <div className="h-8 w-8">
          <img
            src="https://plus.unsplash.com/premium_photo-1723028769916-a767a6b0f719?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="avatar"
            className="h-full w-full rounded-full object-cover"
          />
        </div>

        <Tooltip
          describeChild
          title="Đánh hoặc bỏ đánh dấu sao bảng này. Bảng được đánh dấu sao sẽ hiện ở đầu danh sách Bảng."
        >
          <div className="rounded-md p-2 hover:bg-[#ffffff33]">
            <StarIcon size="16" iconColor="#fff" />
          </div>
        </Tooltip>

        <div className="flex max-w-100 cursor-pointer items-center rounded-md bg-[#dcdfe4] px-2 hover:bg-white">
          <span className="-ml-1 p-2">
            <ShareIcon size="16" />
          </span>
          <span className="text-sm text-[#172B4D]">Chia sẻ</span>
        </div>
        <div className="rounded-md p-1.5 hover:bg-[#ffffff33]">
          <EllipsisIcon size="18" iconColor="#fff" />
        </div>
      </div>
    </div>
  );
}
