import { listServices, type ServiceListItem } from "@/studio/lib/collections";
import { ServicesTable } from "./ServicesTable";

export const dynamic = "force-dynamic";

export default async function ServicesListPage() {
  let items: ServiceListItem[] = [];
  let dbError = false;
  try {
    items = await listServices();
  } catch {
    dbError = true;
  }

  return (
    <>
      <div className="st-head">
        <div>
          <h1 className="st-title">Услуги</h1>
          <p className="st-sub">Страницы услуг /services/…{items.length ? ` · ${items.length}` : ""}. Адрес (slug) привязан к коду — меняется только в разработке.</p>
        </div>
      </div>

      {dbError ? (
        <div className="st-error">Не удалось загрузить услуги. Проверьте подключение к базе.</div>
      ) : items.length === 0 ? (
        <div className="st-card st-empty"><div className="st-empty-ic">🧩</div>Услуг нет</div>
      ) : (
        <ServicesTable items={items} />
      )}
    </>
  );
}
