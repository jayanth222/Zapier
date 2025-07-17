import { Appbar } from "@/components/Appbar";
import { Hero } from "@/components/Hero";

export default function Home() {
  return (
    <main className="flex h-screen flex-col">
      <Appbar />
      <div className="mx-30 flex grow flex-col justify-center border-x border-gray-100">
        <Hero />
      </div>
    </main>
  );
}
