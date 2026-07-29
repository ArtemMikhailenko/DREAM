"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/studio/lib/auth";
import { saveGlobal, type GlobalContent } from "@/studio/lib/globals";

export async function saveGlobalAction(key: string, content: GlobalContent): Promise<{ ok: true }> {
  if (!(await getSession())) throw new Error("unauthorized");
  await saveGlobal(key, content);
  revalidatePath("/", "layout");
  return { ok: true };
}
