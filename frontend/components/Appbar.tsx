"use client";

import { LinkButton } from "./buttons/LinkButton";
import { useRouter } from "next/navigation";
import { PrimaryButton } from "./buttons/PrimaryButton";

export const Appbar = () => {
  const router = useRouter();
  return (
    <div className="flex justify-between border-b border-gray-200 bg-gray-100 px-8 py-2">
      <div className="flex flex-col justify-center text-2xl font-extrabold">
        Zapier
      </div>
      <div className="flex gap-x-1">
        <LinkButton>Contact Sales</LinkButton>
        <LinkButton
          onClick={() => {
            router.push("/login");
          }}
        >
          Log in
        </LinkButton>
        <PrimaryButton
          onClick={() => {
            router.push("/signup");
          }}
        >
          Sign up
        </PrimaryButton>
      </div>
    </div>
  );
};
