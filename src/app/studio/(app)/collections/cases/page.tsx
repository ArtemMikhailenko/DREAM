import { listCases, type CaseListItem } from "@/studio/lib/collections";
import { createCaseAction } from "../actions";
import { CasesTable } from "./CasesTable";

export const dynamic = "force-dynamic";

export default async function CasesListPage() {
  let items: CaseListItem[] = [];
  let dbError = false;
  try {
    items = await listCases();
  } catch {
    dbError = true;
  }

  return (
    <>
      <div className="st-head">
        <div>
          <h1 className="st-title">Портфолио</h1>
          <p className="st-sub">Кейсы на странице /portfolio{items.length ? ` · ${items.length}` : ""}</p>
        </div>
        <form action={createCaseAction}>
          <button type="submit" className="st-btn st-btn-primary">+ Новый кейс</button>
        </form>
      </div>

      {dbError ? (
        <div className="st-error">Не удалось загрузить кейсы. Проверьте подключение к базе.</div>
      ) : items.length === 0 ? (
        <div className="st-card st-empty"><div className="st-empty-ic">🗂️</div>Кейсов пока нет — создайте первый</div>
      ) : (
        <CasesTable items={items} />
      )}
    </>
  );
}
