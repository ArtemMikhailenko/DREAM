import { notFound } from "next/navigation";
import { getGlobal } from "@/studio/lib/globals";
import { GLOBAL_UI } from "@/studio/lib/globals-schema";
import { GlobalEditor } from "./GlobalEditor";

export const dynamic = "force-dynamic";

export default async function GlobalPage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const ui = GLOBAL_UI[key];
  if (!ui) notFound();

  let content = null;
  let dbError = false;
  try {
    content = await getGlobal(key);
  } catch {
    dbError = true;
  }
  if (!dbError && !content) notFound();

  return (
    <>
      <div className="st-head">
        <div>
          <h1 className="st-title">{ui.title}</h1>
          <p className="st-sub">{ui.sub} · на трёх языках</p>
        </div>
      </div>

      {dbError || !content ? (
        <div className="st-error">Не удалось загрузить данные. Проверьте подключение к базе.</div>
      ) : (
        <GlobalEditor globalKey={key} ui={ui} initial={content} />
      )}
    </>
  );
}
