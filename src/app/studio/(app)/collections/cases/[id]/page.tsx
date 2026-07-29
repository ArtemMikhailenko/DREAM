import Link from "next/link";
import { notFound } from "next/navigation";
import { getCase } from "@/studio/lib/collections";
import { CaseEditor } from "./CaseEditor";

export const dynamic = "force-dynamic";

export default async function CaseEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numId = Number(id);
  if (!Number.isInteger(numId)) notFound();

  const doc = await getCase(numId);
  if (!doc) notFound();

  return (
    <>
      <Link href="/studio/collections/cases" className="st-back">← К портфолио</Link>
      <div className="st-head">
        <div>
          <h1 className="st-title">Кейс №{doc.id}</h1>
          <p className="st-sub">/portfolio/{doc.slug}</p>
        </div>
      </div>
      <CaseEditor initial={doc} />
    </>
  );
}
