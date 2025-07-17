"use client";

import { ReactNode } from "react";

export const LinkButton = ({
  children,
  onClick = () => {},
}: {
  children: ReactNode;
  onClick?: () => void;
}) => {
  return (
    <div
      className="cursor-pointer px-4 py-2 text-center text-sm hover:rounded-sm hover:bg-stone-200"
      onClick={onClick}
    >
      {children}
    </div>
  );
};
