import type React from "react";

interface Props {
  children: React.ReactNode;
}

export default function DefaultLayout({ children }: Props) {
  return <div>{children}</div>;
}
