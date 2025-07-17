"use client";

import { Appbar } from "@/components/Appbar";
import { LinkButton } from "@/components/buttons/LinkButton";
import { ZapCell } from "@/components/ZapCell";
import { useState } from "react";

export default function CreateZap() {
  const [selectedTrigger, setSelectedTrigger] = useState("");
  const [selectedActions, setSelectedActions] = useState<
    {
      availableActionName: string;
      availableActionId: string;
    }[]
  >([]);
  return (
    <main className="flex min-h-screen flex-col">
      <Appbar />
      <div className="flex w-full grow flex-col items-center justify-center gap-2">
        <ZapCell
          index={1}
          name={selectedTrigger ? selectedTrigger : "Trigger"}
        />
        <LinkButton
          onClick={() => {
            setSelectedActions((a) => [
              ...a,
              { availableActionId: "", availableActionName: "" },
            ]);
          }}
        >
          <div className="text-2xl">+</div>
        </LinkButton>
        {selectedActions.map((a, i) => (
          <>
            <ZapCell
              index={i + 2}
              name={a.availableActionName ? a.availableActionName : "Action"}
            />
            <LinkButton
              onClick={() => {
                setSelectedActions((a) => [
                  ...a,
                  { availableActionId: "", availableActionName: "" },
                ]);
              }}
            >
              <div className="text-2xl">+</div>
            </LinkButton>
          </>
        ))}
      </div>
    </main>
  );
}
