import { CollectionsBase } from "@/backend/api/collections";
import Link from "next/link";

export default async function Home() {
  const items = await CollectionsBase();

  return (
    <div className="max-w-[1200px] m-auto flex mt-12 gap-5">
      {items.map((i) => (
        <Link key={i.CollectionId} href={`/${i.CollectionId}`} className="w-[30%] border border-black rounded-md p-3 cursor-pointer transition-colors bg-slate-200 hover:bg-slate-300">
          <div className="flex flex-row">
            <div className="flex-1 text-base">{i.CollectionName}</div>
            <div className="flex-initial text-xs">{i.CollectionQuantity} cards</div>
          </div>
          <div className="text-xs mt-2">{i.CollectionDescription}</div>
        </Link>
      ))}
    </div>
  );
}

export const dynamic = 'force-dynamic'