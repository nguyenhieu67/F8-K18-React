import { useTrello } from "@/context/TrelloContext";
import BoardList from "./Boards/BoardContent/BoardList";
import AddBoardForm from "./Boards/BoardContent/AddBoardForm";
import { useEffect, useState } from "react";
import { BackgroundPickerProvider } from "@/context/BackgroundPickerContext";
import ClosedBoard from "./Boards/ClosedBoard";
import { CloseIcon, DeleteIcon, SavedIcon } from "@/components/Icons";
import { Link } from "react-router-dom";
import ConfirmPopover from "@/components/ConfirmPopover";
import { EmptyState } from "./Boards/BoardHeader/View/MenuView";

export default function Dashboard() {
  const {
    boards,
    filteredBoards,
    searchKeyword,
    loading,
    handleDeleteBoard,
    handleReopenBoard,
  } = useTrello();
  const [open, setOpen] = useState<boolean>(false);

  const starredBoards = filteredBoards.filter((board) => board.isStarred);
  const closedBoards = filteredBoards.filter((board) => board.isClosed);

  useEffect(() => {
    document.title = "Clone Trello";
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return;

    const date = new Date(dateString);

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");

    return `${day} tháng ${month}, ${year} lúc ${hour}:${minute}`;
  };

  if (loading)
    return (
      <div className="p-6 text-gray-500">Đang đồng bộ dữ liệu từ server...</div>
    );

  return (
    <BackgroundPickerProvider>
      <div className="bg-trello-board-bg h-[calc(100vh-56px)]">
        <main className="mx-auto max-w-6xl p-8">
          {boards.length === 0 ? (
            <div className="w-fit">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-trello-board-text text-xl font-bold">
                  Bảng công việc của bạn
                </h2>
              </div>
              <AddBoardForm
                title="Tạo bảng mới"
                className="h-28! w-60 bg-[#0515240f]! text-[#505258]! shadow-lg hover:bg-[#0b120e24]!"
                placement="left"
              />
            </div>
          ) : (
            <>
              {filteredBoards.length === 0 ? (
                <p className="text-white italic">
                  Không tìm thấy bảng nào khớp với từ khóa "{searchKeyword}".
                </p>
              ) : (
                <div className="space-y-10">
                  {/* Section Star */}
                  {starredBoards.length > 0 && (
                    <>
                      <section>
                        <h2 className="text-trello-board-text mb-6 flex items-center gap-2 text-2xl font-bold">
                          Bảng đánh dấu sao
                        </h2>

                        <div className="grid grid-cols-4 gap-5">
                          <BoardList boards={starredBoards} />
                        </div>
                      </section>

                      <hr className="mb-6 text-[#0b120e24] dark:text-[#505258]" />
                    </>
                  )}

                  {/* Section Board */}
                  <section>
                    <div className="mb-6 flex items-center justify-between">
                      <h2 className="text-trello-board-text text-2xl font-bold">
                        Bảng công việc của bạn
                      </h2>
                    </div>

                    <div className="grid grid-cols-4 gap-5">
                      <BoardList boards={boards} />
                      <AddBoardForm
                        title="Tạo bảng mới"
                        className="h-28! w-full bg-[#0515240f]! text-[#505258]! shadow-lg hover:bg-[#0b120e24]!"
                        placement="left"
                      />
                    </div>
                  </section>

                  <>
                    <button
                      className="mt-3 cursor-pointer rounded-lg border border-gray-300 p-3 text-sm font-semibold text-[#505258] hover:bg-[#0515240f]"
                      onClick={() => {
                        setOpen(!open);
                      }}
                    >
                      Xem tất cả các bảng đã đóng
                    </button>
                    {open && (
                      <ClosedBoard size="md" open={open} onClose={handleClose}>
                        <div className="rounded-lg p-2">
                          {/* Header */}
                          <header className="bg-trello-addBoard-bg text-trello-addBoard-text flex items-center justify-between p-3">
                            <div className="flex items-center gap-2">
                              <SavedIcon />
                              <p className="text-2xl font-medium">
                                Bảng đã đóng
                              </p>
                            </div>
                            <span className="h-6 w-6"></span>
                            <button
                              className="hover:bg-trello-icon-bg-hover cursor-pointer rounded-lg p-2"
                              onClick={handleClose}
                            >
                              <CloseIcon />
                            </button>
                          </header>

                          {/* Content */}
                          <div>
                            <ul className="mb-2 px-4">
                              {!closedBoards.length ? (
                                <EmptyState title="Chưa có bảng nào được đóng" />
                              ) : (
                                closedBoards.map((board) => (
                                  <li
                                    key={board.id}
                                    className="flex items-center justify-between border-b border-b-[#0b120e24] py-2 last:border-none"
                                  >
                                    <div className="flex items-center gap-3 text-sm">
                                      <div
                                        style={{
                                          backgroundImage: board.background.type
                                            ? board.background.type
                                              ? `url("${board.background.value}")`
                                              : `url(${board.background.value})`
                                            : undefined,
                                        }}
                                        className={`h-8 w-10 rounded bg-cover bg-center shadow-md ${
                                          !board.background.type
                                            ? board.background.value
                                            : ""
                                        }`}
                                      />
                                      <div className="flex flex-col">
                                        <Link
                                          to={`/${board.slug}`}
                                          className="text-[#1868db] underline"
                                        >
                                          {board.title}
                                        </Link>
                                        <span>
                                          Đóng vào ngày:{" "}
                                          {formatDate(board.createdAt)}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="flex gap-2">
                                      <div className="text-trello-button-text cursor-pointer rounded-md bg-[#1868db] px-3 py-1 hover:opacity-80">
                                        <ConfirmPopover
                                          title="Mở lại bảng"
                                          desc={
                                            <>Bạn có muốn mở lại bảng không?</>
                                          }
                                          buttonName="Mở lại bảng"
                                          className="bg-[#0515240f]! text-[#505258]! shadow-lg hover:bg-[#0b120e24]! dark:bg-[#669df1] dark:text-[#1f1f21] dark:hover:bg-[#8fb8f6]"
                                          onConfirm={() =>
                                            handleReopenBoard(board.id)
                                          }
                                        >
                                          <button className="cursor-pointer px-1">
                                            <p>Mở lại</p>
                                          </button>
                                        </ConfirmPopover>
                                      </div>
                                      <div className="text-trello-button-text flex cursor-pointer items-center gap-2 rounded-md bg-[#c9372c] px-3 py-1 hover:opacity-80">
                                        <ConfirmPopover
                                          title="Xoá bảng?"
                                          desc={
                                            <>
                                              Tất cả mọi danh sách, thẻ và hành
                                              động sẽ bị xóa, và bạn sẽ không
                                              thể mở lại bảng. Không thể hoàn
                                              tác.
                                            </>
                                          }
                                          buttonName="Xoá"
                                          onConfirm={() =>
                                            handleDeleteBoard(board.id)
                                          }
                                        >
                                          <button className="flex cursor-pointer items-center gap-2 px-1">
                                            <span>
                                              <DeleteIcon
                                                size="20"
                                                iconColor="#fff"
                                              />
                                            </span>
                                            <p>Xoá</p>
                                          </button>
                                        </ConfirmPopover>
                                      </div>
                                    </div>
                                  </li>
                                ))
                              )}
                            </ul>
                          </div>
                        </div>
                      </ClosedBoard>
                    )}
                  </>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </BackgroundPickerProvider>
  );
}
