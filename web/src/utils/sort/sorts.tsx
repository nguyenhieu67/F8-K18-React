/* eslint-disable @typescript-eslint/no-explicit-any */
import type { BoardI, CardI, ListI } from "../type";

export default function mapOrder(
  originalArray: BoardI[] | ListI[] | CardI[],
  orderArray: string[],
  key: keyof BoardI | keyof ListI,
) {
  if (!originalArray || !orderArray || !key) return [];

  return [...originalArray].sort((a, b) => {
    const valA = (a as any)[key];
    const valB = (b as any)[key];

    // Tìm vị trí trong orderArray
    const aIndex = orderArray.indexOf(valA);
    const bIndex = orderArray.indexOf(valB);

    // Không có trong orderArray → đẩy xuống cuối
    const aOrder = aIndex === -1 ? Infinity : aIndex;
    const bOrder = bIndex === -1 ? Infinity : bIndex;

    return aOrder - bOrder;
  });
}
