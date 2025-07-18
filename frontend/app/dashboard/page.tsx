"use client";

import { Appbar } from "@/components/Appbar";
import { DarkButton, PlusIcon } from "@/components/buttons/DarkButton";
import { useEffect, useState } from "react";
import axios from "axios";
import { HOOKS_URL, PRIMARY_BACKEND_URL } from "../config";
import { LinkButton } from "@/components/buttons/LinkButton";
import { useRouter } from "next/navigation";

interface Zap {
  id: string;
  name: string;
  userId: number;
  trigger: {
    id: string;
    availableTriggerId: string;
    zapId: string;
    type: {
      id: string;
      name: string;
      imageURL: string;
    };
  };
  actions: [
    {
      id: string;
      zapId: string;
      availableActionId: string;
      sortingOrder: number;
      type: {
        id: string;
        name: string;
        imageURL: string;
      };
    },
  ];
}

function useZaps() {
  const [isLoading, setIsLoading] = useState(false);
  const [zaps, setZaps] = useState<Zap[]>([]);
  useEffect(() => {
    axios
      .get(`${PRIMARY_BACKEND_URL}/api/v1/zap`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        // @ts-ignore
        setZaps(response.data?.zaps);
      })
      .catch((e) => {
        alert("couldn't get zaps");
      });
    setIsLoading(false);
  }, []);
  return { isLoading, zaps };
}

export default function () {
  const router = useRouter();
  const { isLoading, zaps } = useZaps();
  return (
    <div>
      <Appbar />
      <div className="flex justify-center pt-10">
        <div className="max-w-screen-lg flex-1">
          <div className="flex justify-between">
            <div className="text-2xl font-bold">My Zaps</div>
            <div className="flex">
              <DarkButton
                onClick={() => {
                  router.push("/zap/create");
                }}
              >
                <PlusIcon /> Create
              </DarkButton>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="w-5xl">
          {isLoading ? "loading..." : <ZapTable zaps={zaps} />}
        </div>
      </div>
    </div>
  );
}

const ZapTable = ({ zaps }: { zaps: Zap[] }) => {
  const router = useRouter();
  return (
    <div className="pt-8">
      <div className="flex gap-x-2 border-b-2 border-gray-200 pb-4 text-center">
        <div className="flex-2/12"></div>
        <div className="flex-5/12 font-semibold">Name</div>
        <div className="flex-2/12 font-semibold">Creatd At</div>
        <div className="flex-2/12 font-semibold">WebHook URL</div>
        <div className="flex-1/12"></div>
      </div>
      {zaps.map((z, i) => (
        <div
          className="flex gap-x-2 border-b border-gray-200 py-3 text-center"
          key={i}
        >
          <div className="flex flex-2/12 items-center gap-x-2 pl-3">
            <img
              src={z.trigger?.type?.imageURL}
              className="h-[30px] w-[30px] rounded-sm border border-stone-400 p-0.5"
            />
            {z.actions.map((a) => (
              <img
                src={a.type?.imageURL}
                className="h-[30px] w-[30px] rounded-sm border border-stone-400 p-0.5"
              />
            ))}
          </div>
          <div className="flex flex-5/12 items-center">
            <div className="flex flex-1 justify-center">{z.name}</div>
          </div>
          <div className="flex flex-2/12 items-center">
            <div className="flex flex-1 justify-center">18 July</div>
          </div>
          <div className="flex-2/12">
            <LinkButton>
              <a
                href={`${HOOKS_URL}/hooks/catch/${z.userId}/${z.id}`}
                target="_blank"
              >
                Click
              </a>
            </LinkButton>
          </div>
          <div className="flex-1/12">
            <LinkButton
              onClick={() => {
                router.push("/zap/" + z.id);
              }}
            >
              Go
            </LinkButton>
          </div>
        </div>
      ))}
    </div>
  );
};
