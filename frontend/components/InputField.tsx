"use client";

import { ChangeEvent } from "react";

export const InputField = ({
  label,
  type = "text",
  onChange,
}: {
  label: string;
  type?: "text" | "email" | "password";
  onChange?: (e: any) => void;
}) => {
  return (
    <div className="flex flex-col">
      <label className="font-semibold text-slate-700">{`* ${label}`}</label>
      <input
        className="rounded-sm border border-gray-400 px-4 py-2"
        type={type}
      />
    </div>
  );
};
