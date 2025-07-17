"use client";
import { useRouter } from "next/navigation";
// import { Feature } from "./Feature";
import { PrimaryButton } from "./buttons/PrimaryButton";
// import { SecondaryButton } from "./buttons/SecondaryButton";

export const Hero = () => {
  const router = useRouter();
  return (
    <main className="flex items-center justify-between">
      <div className="flex flex-col">
        <div className="flex justify-center">
          <div className="max-w-xl pt-8 text-center text-5xl font-semibold">
            Automate as fast as you can type
          </div>
        </div>
        <div className="flex justify-center pt-2">
          <div className="max-w-2xl pt-8 text-center text-xl">
            AI gives you automation superpowers, and Zapier puts them to work.
            Pairing AI and Zapier helps you turn ideas into workflows and bots
            that work for you.
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <div className="flex">
            <PrimaryButton
              onClick={() => {
                router.push("/signup");
              }}
              size="big"
            >
              Start free with email
            </PrimaryButton>
            <div className="pl-4"></div>
          </div>
        </div>
      </div>
      <div>
        <img
          className="h-xl w-xl"
          src="https://res.cloudinary.com/zapier-media/image/upload/f_auto/q_auto/v1745602193/Homepage/hero-illo_orange_ilrzpu.png"
          alt=""
        />
      </div>
    </main>
  );
};
