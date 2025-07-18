"use client";

import { Appbar } from "@/components/Appbar";
import { LinkButton } from "@/components/buttons/LinkButton";
import { ZapCell } from "@/components/ZapCell";
import { useEffect, useState } from "react";
import axios from "axios";
import { PRIMARY_BACKEND_URL } from "@/app/config";
import { DarkButton } from "@/components/buttons/DarkButton";
import { useRouter } from "next/navigation";
import { EmailSelector } from "@/components/EmailSelector";
import { SolanaSelector } from "@/components/SolanaSelector";

export default function CreateZap() {
  const router = useRouter();
  const [name, setName] = useState("");
  const { availableTriggers, availableActions } =
    useAvailabeTriggersAndActions();
  const [selectedTrigger, setSelectedTrigger] = useState<{
    name: string;
    id: string;
    imageURL?: string;
  }>();
  const [selectedActions, setSelectedActions] = useState<
    {
      imageURL: string;
      index: number;
      availableActionName: string;
      availableActionId: string;
      metadata: any;
    }[]
  >([]);
  const [selectedModalIndex, setSelectedModalIndex] = useState<null | number>(
    null,
  );

  return (
    <main className="flex min-h-screen flex-col">
      <Appbar />
      <div className="flex justify-between px-12 pt-2">
        <div className="mb-[8] rounded-sm border border-slate-400">
          <LinkButton
            onClick={() => {
              router.back();
            }}
          >
            Back
          </LinkButton>
        </div>
        <div className="flex justify-center rounded-md text-center text-2xl font-semibold outline-none">
          <input
            className="border-green flex rounded-md text-center outline-none"
            onChange={(e) => {
              // @ts-ignore
              setName(e.target.value);
            }}
            value={name}
            placeholder="Untitled"
          />
        </div>
        <DarkButton
          onClick={() => {
            axios
              .post(
                `${PRIMARY_BACKEND_URL}/api/v1/zap`,
                {
                  name: name,
                  availableTriggerId: selectedTrigger?.id,
                  triggerMetadata: {},
                  actions: selectedActions.map((a) => ({
                    availabelActionId: a.availableActionId,
                    actionMetadata: a.metadata,
                  })),
                },
                {
                  headers: {
                    Authorization: localStorage.getItem("token"),
                  },
                },
              )
              .then(() => {
                router.push("/dashboard");
              })
              .catch((e) => {
                alert("There was an error publishing the zap");
              });
          }}
        >
          Publish
        </DarkButton>
      </div>
      <div className="flex w-full grow flex-col items-center justify-center gap-2">
        <ZapCell
          imageURL={selectedTrigger?.imageURL}
          onClick={() => setSelectedModalIndex(1)}
          index={1}
          name={selectedTrigger?.name ? selectedTrigger.name : "Trigger"}
        />
        {selectedActions.map((a, i) => (
          <>
            <ZapCell
              imageURL={a?.imageURL}
              onClick={() => setSelectedModalIndex(a.index)}
              index={i + 2}
              name={a.availableActionName ? a.availableActionName : "Action"}
            />
          </>
        ))}
        <LinkButton
          onClick={() => {
            setSelectedActions((a) => [
              ...a,
              {
                imageURL: "",
                index: a.length + 2,
                availableActionId: "",
                availableActionName: "",
                metadata: {},
              },
            ]);
          }}
        >
          <div className="text-2xl">+</div>
        </LinkButton>
      </div>
      {selectedModalIndex && (
        <Modal
          availableItems={
            selectedModalIndex === 1 ? availableTriggers : availableActions
          }
          index={selectedModalIndex}
          onSelect={(
            props: null | {
              name: string;
              id: string;
              imageURL: string;
              metadata: any;
            },
          ) => {
            if (props === null) {
              setSelectedModalIndex(null);
              return;
            }
            if (selectedModalIndex === 1) {
              setSelectedTrigger(() => ({
                imageURL: props.imageURL,
                id: props.id,
                name: props.name,
              }));
            } else {
              setSelectedActions((a) => {
                let newActions = [...a];
                newActions[selectedModalIndex - 2] = {
                  imageURL: props.imageURL,
                  index: selectedModalIndex,
                  availableActionName: props.name,
                  availableActionId: props.id,
                  metadata: props.metadata,
                };
                return newActions;
              });
            }
            setSelectedModalIndex(null);
          }}
        />
      )}
    </main>
  );
}

function Modal({
  index,
  onSelect,
  availableItems,
}: {
  availableItems: { id: string; name: string; imageURL: string }[];
  index: number;
  onSelect: (
    props: null | { name: string; id: string; imageURL: string; metadata: any },
  ) => void;
}) {
  const [step, setStep] = useState(0);
  const isTrigger = index == 1;
  const [selectedAction, setSelectedAction] = useState<{
    id: string;
    name: string;
    imageURL: string;
  }>();

  return (
    <div className="fixed top-0 right-0 left-0 z-50 flex h-[calc(100%-1rem)] max-h-full w-full items-center justify-center bg-slate-100/50 md:inset-0">
      <div className="relative max-h-full w-full max-w-md p-4">
        <div className="relative rounded-lg bg-white shadow-sm">
          <div className="flex items-center justify-between rounded-t border-b border-gray-200 p-4 md:p-5">
            <div className="text-2xl">
              Select {index === 1 ? "Triggers" : "Actions"}
            </div>
            <button
              onClick={() => {
                onSelect(null);
              }}
              type="button"
              className="ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900"
              data-modal-hide="default-modal"
            >
              <svg
                className="h-3 w-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="space-y-4 p-4 md:p-5">
            <div>
              {step === 1 && selectedAction?.name === "email" && (
                <EmailSelector
                  setMetadata={(metadata) => {
                    onSelect({
                      ...selectedAction,
                      metadata,
                    });
                  }}
                />
              )}
            </div>

            <div>
              {step === 1 && selectedAction?.name === "send_solana" && (
                <SolanaSelector
                  setMetadata={(metadata) => {
                    onSelect({
                      ...selectedAction,
                      metadata,
                    });
                  }}
                />
              )}
            </div>
            <div>
              {step === 0 && (
                <div>
                  {availableItems.map((a) => (
                    <div
                      onClick={() => {
                        if (isTrigger) {
                          onSelect({
                            id: a.id,
                            name: a.name,
                            imageURL: a.imageURL,
                            metadata: {},
                          });
                        } else {
                          setStep((s) => s + 1);
                          setSelectedAction({
                            id: a.id,
                            name: a.name,
                            imageURL: a.imageURL,
                          });
                        }
                      }}
                      key={a.id}
                      className="flex cursor-pointer justify-start rounded-md border border-gray-200 px-4 py-2 pl-32 text-xl capitalize hover:bg-slate-100"
                    >
                      <img src={a.imageURL} width={30} />
                      {a.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function useAvailabeTriggersAndActions() {
  const [availableActions, setAvailableActions] = useState([]);
  const [availableTriggers, setAvailableTriggers] = useState([]);

  useEffect(() => {
    axios
      .get(`${PRIMARY_BACKEND_URL}/api/v1/trigger/available`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((response: any) => {
        setAvailableTriggers(response.data.availableTriggers);
      })
      .catch((e) => {
        console.error(e);
        alert("something went wrong ");
      });
    axios
      .get(`${PRIMARY_BACKEND_URL}/api/v1/action/available`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((response: any) => {
        setAvailableActions(response.data.availableActions);
      })
      .catch((e) => {
        console.error(e);
        alert("something went wrong ");
      });
  }, []);

  return { availableTriggers, availableActions };
}
