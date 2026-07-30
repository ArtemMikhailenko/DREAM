import { getHome, getHomeImages, getHomeCards, type HomeContent } from "@/studio/lib/content";
import type { HomeImages, HomeCards } from "@/studio/lib/content-schema";
import { HomeEditor } from "./HomeEditor";

export const dynamic = "force-dynamic";

export default async function HomeContentPage() {
  let data: HomeContent | null = null;
  let images: HomeImages | null = null;
  let cards: HomeCards | null = null;
  let dbError = false;
  try {
    [data, images, cards] = await Promise.all([getHome(), getHomeImages(), getHomeCards()]);
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

      {dbError || !data || !images || !cards ? (
        <div className="st-error">Не удалось загрузить данные. Проверьте подключение к базе.</div>
      ) : (
        <HomeEditor initial={data} initialImages={images} initialCards={cards} />
      )}
    </>
  );
}
