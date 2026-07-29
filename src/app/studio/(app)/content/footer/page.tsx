import { getFooter, type FooterContent } from "@/studio/lib/content";
import { FooterEditor } from "./FooterEditor";

export const dynamic = "force-dynamic";

export default async function FooterContentPage() {
  let data: FooterContent | null = null;
  let dbError = false;
  try {
    data = await getFooter();
  } catch {
    dbError = true;
  }

  return (
    <>
      <div className="st-head">
        <div>
          <h1 className="st-title">Футер</h1>
          <p className="st-sub">Нижний блок сайта: колонки, список услуг и копирайт — на трёх языках</p>
        </div>
      </div>

      {dbError || !data ? (
        <div className="st-error">Не удалось загрузить данные. Проверьте подключение к базе.</div>
      ) : (
        <FooterEditor initial={data} />
      )}
    </>
  );
}
