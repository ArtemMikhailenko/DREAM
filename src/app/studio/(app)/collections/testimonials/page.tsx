import { listTestimonials, type TestimonialListItem } from "@/studio/lib/collections";
import { createTestimonialAction } from "../actions";
import { TestimonialsTable } from "./TestimonialsTable";

export const dynamic = "force-dynamic";

export default async function TestimonialsListPage() {
  let items: TestimonialListItem[] = [];
  let dbError = false;
  try {
    items = await listTestimonials();
  } catch {
    dbError = true;
  }

  return (
    <>
      <div className="st-head">
        <div>
          <h1 className="st-title">Отзывы</h1>
          <p className="st-sub">Отзывы клиентов на странице /testimonials{items.length ? ` · ${items.length}` : ""}</p>
        </div>
        <form action={createTestimonialAction}>
          <button type="submit" className="st-btn st-btn-primary">+ Новый отзыв</button>
        </form>
      </div>

      {dbError ? (
        <div className="st-error">Не удалось загрузить отзывы. Проверьте подключение к базе.</div>
      ) : items.length === 0 ? (
        <div className="st-card st-empty"><div className="st-empty-ic">💬</div>Отзывов пока нет — создайте первый</div>
      ) : (
        <TestimonialsTable items={items} />
      )}
    </>
  );
}
