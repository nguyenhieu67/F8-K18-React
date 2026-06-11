import { fetchApi } from "@/utils/api";
import type { BoardI, ListI } from "@/utils/type";

// List API

export async function addListOrderApi(boardId: string, newListId: string) {
  const response = (await fetchApi.get(`/boards/${boardId}`)) as BoardI;
  const currentBoard = response;
  const updatedListOrderIds = [...currentBoard.listOrderIds, newListId];

  await fetchApi.patch(`/boards/${boardId}`, {
    listOrderIds: updatedListOrderIds,
  });
}

export async function updateListOrderIdsApi(
  boardId: string,
  orderIds: string[],
) {
  await fetchApi.patch(`/boards/${boardId}`, {
    listOrderIds: orderIds,
  });
}

// Card API

export async function addCardOrderApi(listId: string, newCardId: string) {
  const response = (await fetchApi.get(`/lists/${listId}`)) as ListI;
  const currentList = response;
  const updatedCardOrderIds = [...currentList.cardOrderIds, newCardId];

  await fetchApi.patch(`/lists/${listId}`, {
    cardOrderIds: updatedCardOrderIds,
  });
}

export async function updateCardOrderIdsApi(
  listId: string | undefined,
  orderIds: string[],
) {
  await fetchApi.patch(`/lists/${listId}`, {
    cardOrderIds: orderIds,
  });
}
