"use client";

import { Appbar } from "@/components/Appbar";
import { DarkButton, PlusIcon } from "@/components/buttons/DarkButton";
import { useEffect, useState } from "react";
import axios from "axios";
import { PRIMARY_BACKEND_URL } from "../config";
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
      };
    },
  ];
}

function useZaps() {
  const [isLoading, setIsLoading] = useState(false);
  const [zaps, setZaps] = useState<Zap[]>([
    {
      id: "c6c6f2fe-e913-49b9-87d5-5443ab593a97",
      name: "zap 11",
      userId: 3,
      trigger: {
        id: "2263c372-1fba-45b7-8a52-688ff85f1f5e",
        availableTriggerId: "d00bf36d-db5e-4961-bb6d-ac27e9ad0665",
        zapId: "c6c6f2fe-e913-49b9-87d5-5443ab593a97",
        type: {
          id: "d00bf36d-db5e-4961-bb6d-ac27e9ad0665",
          name: "webhook",
        },
      },
      actions: [
        {
          id: "19e9d4f8-294c-4234-8474-c1dc67034da5",
          zapId: "c6c6f2fe-e913-49b9-87d5-5443ab593a97",
          availableActionId: "3b92b309-11cf-40c6-a7a7-ef70865905d5",
          sortingOrder: 0,
          type: {
            id: "3b92b309-11cf-40c6-a7a7-ef70865905d5",
            name: "email",
          },
        },
      ],
    },
    {
      id: "ca8ecf37-2cd1-47e1-9f70-b6c7de12ecb4",
      name: "zap 12",
      userId: 3,
      trigger: {
        id: "3e73e4f1-f173-4377-99ad-b14c4cabfd53",
        availableTriggerId: "d00bf36d-db5e-4961-bb6d-ac27e9ad0665",
        zapId: "ca8ecf37-2cd1-47e1-9f70-b6c7de12ecb4",
        type: {
          id: "d00bf36d-db5e-4961-bb6d-ac27e9ad0665",
          name: "webhook",
        },
      },
      actions: [
        {
          id: "7f6600d7-6b08-4815-840d-e01576286647",
          zapId: "ca8ecf37-2cd1-47e1-9f70-b6c7de12ecb4",
          availableActionId: "3b92b309-11cf-40c6-a7a7-ef70865905d5",
          sortingOrder: 0,
          type: {
            id: "3b92b309-11cf-40c6-a7a7-ef70865905d5",
            name: "email",
          },
        },
      ],
    },
  ]);
  // useEffect(() => {
  //   axios
  //     .get(`${PRIMARY_BACKEND_URL}/api/v1/zap`, {
  //       headers: {
  //         Authorization: localStorage.getItem("token"),
  //       },
  //     })
  //     .then((response) => {
  //       // @ts-ignore
  //       setZaps(response.data?.zaps);
  //     })
  //     .catch((e) => {
  //       alert("couldn't get zaps");
  //     });
  // setIsLoading(false);
  // }, []);
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
      <div className="flex border-b-2 border-gray-200 pb-4">
        <div className="flex-3/12"></div>
        <div className="flex-6/12 font-semibold">Name</div>
        <div className="flex-2/12 font-semibold">Last Edit</div>
        <div className="flex-1/12"></div>
      </div>
      {zaps.map((z, i) => (
        <div className="flex border-b border-gray-200" key={i}>
          <div className="flex-3/12">
            {z.trigger.type.name}
            {z.actions.map((a) => a.type.name)}
          </div>
          <div className="flex-6/12">{z.name}</div>
          <div className="flex-2/12">18 July</div>
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
