import { useState } from "react";
import { useTrello } from "@/context/TrelloContext";
import { fetchApi } from "@/utils/api";
import type { ListI } from "@/utils/type";
import TrelloList from "./TrelloList";
import AddListForm from "./AddListForm";
import { PlusIcon } from "../Icons";

interface ListProps {
  boardId: string;
}

export default function List({ boardId }: ListProps) {
  const [showAddList, setShowAddList] = useState<boolean>(false);
  const { lists, setLists } = useTrello();

  const handleCreateList = async (title: string) => {
    const listCount = lists.filter((l) => l.boardId === boardId);

    const payload = {
      boardId: boardId,
      title: title,
      position: listCount.length + 1,
      isSaved: false,
      isShrink: false,
    };

    const newList = (await fetchApi.post("/lists", payload)) as ListI;
    setLists((prev) => [...prev, newList]);
  };

  return (
    <div className="relative mt-3 h-[calc(100vh-64px)] w-full overflow-x-auto overflow-y-hidden">
      <ul className="absolute inset-0 mb-0! flex items-start gap-3 px-2 pb-18!">
        {lists
          .filter((list) => !list.isSaved)
          .map((list, index) => {
            if (list.boardId === boardId) {
              return (
                <TrelloList
                  key={list.id}
                  list={list}
                  isFirstList={index === 0}
                />
              );
            }
          })}

        {showAddList ? (
          <AddListForm
            onAdd={handleCreateList}
            onClose={() => setShowAddList(false)}
          />
        ) : (
          <div className="shrink-0">
            <button
              className="flex min-w-(--list-box-width) cursor-pointer items-center gap-1 rounded-lg bg-[#ffffff3d] p-3 text-sm font-medium text-white hover:bg-[#ffffff33]"
              onClick={() => setShowAddList(true)}
            >
              <PlusIcon width="16" height="16" iconColor="#fff" />
              Thêm danh sách khác
            </button>
          </div>
        )}
      </ul>
    </div>
  );
}
