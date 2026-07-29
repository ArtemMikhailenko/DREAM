import { getLeadForm, type LeadFormContent } from "@/studio/lib/content";
import { LeadFormEditor } from "./LeadFormEditor";

export const dynamic = "force-dynamic";

export default async function LeadFormContentPage() {
  let data: LeadFormContent | null = null;
  let dbError = false;
  try {
    data = await getLeadForm();
  } catch {
    dbError = true;
  }

  return (
    <>
      <div className="st-head">
        <div>
          <h1 className="st-title">Форма заявки</h1>
          <p className="st-sub">Тексты формы «Получить расчёт» в шапке страниц — на трёх языках</p>
        </div>
      </div>

      {dbError || !data ? (
        <div className="st-error">Не удалось загрузить данные. Проверьте подключение к базе.</div>
      ) : (
        <LeadFormEditor initial={data} />
      )}
    </>
  );
}
