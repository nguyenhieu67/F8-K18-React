import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { useTrello } from "@/context/TrelloContext";

// hooks/useLatest.ts
export function useLatest<T>(value: T) {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref;
}

export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export function useCurrentBoard() {
  const { boards } = useTrello();
  const { boardDetail } = useParams();
  const currentBoard = boards?.find((b) => b.slug === boardDetail);
  const isClosed = currentBoard?.isClosed ?? false;

  return {
    currentBoard,
    isClosed,
  };
}
