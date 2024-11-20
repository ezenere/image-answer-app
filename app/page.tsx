import { Collections } from "@/backend/api/collections";
import Link from "next/link";

export default async function Home() {
  const items = await Collections();

  return (
    <div className="max-w-[1200px] m-auto flex mt-12 gap-5">
      {items.map((i) => <Link key={i.id} href={`/${i.id}`} className="w-[30%] border border-black rounded-md p-3 cursor-pointer transition-colors bg-slate-200 hover:bg-slate-300">
        <div className="flex flex-row">
          <div className="flex-1 text-base">{i.name}</div>
          <div className="flex-initial text-xs">{i.quantity} cards</div>
        </div>
        <div className="text-xs mt-2">{i.description}</div>
      </Link>)}
    </div>
  );
}
