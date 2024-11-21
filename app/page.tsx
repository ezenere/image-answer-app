import { Collections } from "@/backend/api/collections";
import Link from "next/link";

export default async function Home() {
  const items = await Collections();

  return (
    <div className="max-w-[1200px] m-auto mt-12 grid-container gap-5 pr-3 pl-3">
      {items.map((i) => <Link key={i.id} href={`/${i.id}`} className="border border-black rounded-md p-3 cursor-pointer transition-colors bg-slate-200 hover:bg-slate-300">
        <div className="flex flex-row">
          <div className="flex-1 text-base">{i.name}</div>
          <div className="flex-initial text-xs">{i.quantity} cards</div>
        </div>
        <div className="text-xs mt-2">{i.description}</div>
      </Link>)}
    </div>
  );
}

export const dynamic = 'force-dynamic'