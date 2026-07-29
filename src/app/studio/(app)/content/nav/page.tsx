import { getNav, type NavContent } from "@/studio/lib/content";
import { NavEditor } from "./NavEditor";

export const dynamic = "force-dynamic";

export default async function NavContentPage() {
  let data: NavContent | null = null;
  let dbError = false;
  try {
    data = await getNav();
  } catch {
    dbError = true;
  }

  return (
    <>
      <div className="st-head">
        <div>
          <h1 className="st-title">Навигация</h1>
          <p className="st-sub">Пункты меню и подписи в шапке сайта — на трёх языках</p>
        </div>
      </div>

      {dbError || !data ? (
        <div className="st-error">Не удалось загрузить данные. Проверьте подключение к базе.</div>
      ) : (
        <NavEditor initial={data} />
      )}
    </>
  );
}
