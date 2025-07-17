"use client";

import { ReactNode } from "react";

export const PrimaryButton = ({
  children,
  onClick,
  size = "small",
}: {
  children: ReactNode;
  onClick?: () => void;
  size?: "big" | "small";
}) => {
  return (
    <div
      className={`cursor-pointer bg-orange-600 ${size === "small" ? "rounded-4xl text-sm" : "rounded-sm text-xl"} hover:shadow-black-500/50 px-4 py-2 font-semibold text-white hover:bg-amber-700 hover:shadow-lg`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
