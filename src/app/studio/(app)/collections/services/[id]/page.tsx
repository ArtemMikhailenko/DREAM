import Link from "next/link";
import { notFound } from "next/navigation";
import { getService } from "@/studio/lib/collections";
import { ServiceEditor } from "./ServiceEditor";

export const dynamic = "force-dynamic";

export default async function ServiceEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numId = Number(id);
  if (!Number.isInteger(numId)) notFound();

  const doc = await getService(numId);
  if (!doc) notFound();

  return (
    <>
      <Link href="/studio/collections/services" className="st-back">← К услугам</Link>
      <div className="st-head">
        <div>
          <h1 className="st-title">Услуга: {doc.locales.ru.fields.label || doc.slug}</h1>
          <p className="st-sub">/services/{doc.slug}</p>
        </div>
      </div>
      <ServiceEditor initial={doc} />
    </>
  );
}
