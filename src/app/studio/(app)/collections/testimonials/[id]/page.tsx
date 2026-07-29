import Link from "next/link";
import { notFound } from "next/navigation";
import { getTestimonial } from "@/studio/lib/collections";
import { TestimonialEditor } from "./TestimonialEditor";

export const dynamic = "force-dynamic";

export default async function TestimonialEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numId = Number(id);
  if (!Number.isInteger(numId)) notFound();

  const doc = await getTestimonial(numId);
  if (!doc) notFound();

  return (
    <>
      <Link href="/studio/collections/testimonials" className="st-back">← К отзывам</Link>
      <div className="st-head">
        <div>
          <h1 className="st-title">Отзыв №{doc.id}</h1>
          <p className="st-sub">Редактирование отзыва на трёх языках</p>
        </div>
      </div>
      <TestimonialEditor initial={doc} />
    </>
  );
}
