"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/studio/lib/auth";
import { uploadImage } from "@/studio/lib/upload";
import { listMedia, type MediaItem } from "@/studio/lib/media";

export async function listMediaAction(): Promise<MediaItem[]> {
  if (!(await getSession())) throw new Error("unauthorized");
  return listMedia();
}

export async function uploadMediaAction(formData: FormData): Promise<{ ok: boolean; error?: string }> {
  if (!(await getSession())) throw new Error("unauthorized");
  const file = formData.get("file");
  if (!(file instanceof File)) return { ok: false, error: "Файл не выбран" };
  try {
    await uploadImage(file);
  } catch (e) {
    return { ok: false, error: (e as Error).message || "Ошибка загрузки" };
  }
  revalidatePath("/studio/media");
  return { ok: true };
}
