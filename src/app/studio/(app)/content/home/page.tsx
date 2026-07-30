import { getHome, getHomeImages, type HomeContent } from "@/studio/lib/content";
import type { HomeImages } from "@/studio/lib/content-schema";
import { HomeEditor } from "./HomeEditor";

export const dynamic = "force-dynamic";

export default async function HomeContentPage() {
  let data: HomeContent | null = null;
  let images: HomeImages | null = null;
  let dbError = false;
  try {
    [data, images] = await Promise.all([getHome(), getHomeImages()]);
  } catch {
    dbError = true;
  }

  return (
    <>
      <div className="st-head">
        <div>
          <h1 className="st-title">Главная</h1>
          <p className="st-sub">Тексты главной страницы — на трёх языках. Карточки услуг, кейсы и картинки — позже.</p>
        </div>
      </div>

      {dbError || !data || !images ? (
        <div className="st-error">Не удалось загрузить данные. Проверьте подключение к базе.</div>
      ) : (
        <HomeEditor initial={data} initialImages={images} />
      )}
    </>
  );
}
