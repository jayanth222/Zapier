"use client";

import { Appbar } from "@/components/Appbar";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { CheckFeatures } from "@/components/CheckFeatures";
import { InputField } from "@/components/InputField";
import { useState } from "react";
import { PRIMARY_BACKEND_URL } from "../config";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onClickHandler = () => {
    axios
      .post(`${PRIMARY_BACKEND_URL}/api/v1/user/signin`, {
        email,
        password,
      })
      .then(() => {
        router.push("/");
      })
      .catch((e) => {
        console.error(e);
        alert("there was an error");
      });
  };
  return (
    <div className="flex h-screen flex-col">
      <Appbar />
      <div className="flex grow items-center gap-x-16 px-60">
        <div className="flex w-1/2 flex-col">
          <div className="flex justify-center pb-6 text-center text-3xl font-bold">
            Join millions world wide who automate their work using zapier
          </div>
          <div className="flex flex-col items-center">
            <div>
              <CheckFeatures label="Easy setup, no coding required" />
              <CheckFeatures label="Free forever for core features" />
              <CheckFeatures label="14-day free trial for premium apps & services" />
            </div>
          </div>
        </div>
        <div className="w-1/2">
          <div className="flex flex-col gap-y-3 rounded-sm border border-stone-400 px-6 py-6">
            <div className="text-sm">* indicates a required field.</div>
            <InputField
              onChange={(e) => setEmail(e.target.value)}
              label="Email"
              type="email"
              value={email}
            />
            <InputField
              onChange={(e) => setPassword(e.target.value)}
              label="Password"
              type="password"
              value={password}
            />
            <PrimaryButton
              onClick={onClickHandler}
              children="Get started for free"
              size="big"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
