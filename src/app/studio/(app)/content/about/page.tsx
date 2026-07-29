import { getAbout, type AboutContent } from "@/studio/lib/content";
import { AboutEditor } from "./AboutEditor";

export const dynamic = "force-dynamic";

export default async function AboutContentPage() {
  let data: AboutContent | null = null;
  let dbError = false;
  try {
    data = await getAbout();
  } catch {
    dbError = true;
  }

  return (
    <>
      <div className="st-head">
        <div>
          <h1 className="st-title">О студии</h1>
          <p className="st-sub">Страница «О студии»: история, принципы, цифры — на трёх языках</p>
        </div>
      </div>

      {dbError || !data ? (
        <div className="st-error">Не удалось загрузить данные. Проверьте подключение к базе.</div>
      ) : (
        <AboutEditor initial={data} />
      )}
    </>
  );
}
