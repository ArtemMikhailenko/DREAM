import { listMedia, type MediaItem } from "@/studio/lib/media";
import { MediaGrid } from "./MediaGrid";

export const dynamic = "force-dynamic";

export default async function MediaPage() {
  let items: MediaItem[] = [];
  let dbError = false;
  try {
    items = await listMedia();
  } catch {
    dbError = true;
  }

  return (
    <>
      <div className="st-head">
        <div>
          <h1 className="st-title">Медиа</h1>
          <p className="st-sub">Библиотека изображений сайта{items.length ? ` · ${items.length}` : ""}. Загрузка новых — скоро.</p>
        </div>
      </div>

      {dbError ? (
        <div className="st-error">Не удалось загрузить медиатеку. Проверьте подключение к базе.</div>
      ) : (
        <MediaGrid items={items} />
      )}
    </>
  );
}
