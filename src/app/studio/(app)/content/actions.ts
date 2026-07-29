"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/studio/lib/auth";
import { saveNav, saveFooter, type NavContent, type FooterContent } from "@/studio/lib/content";

export async function saveNavAction(content: NavContent): Promise<{ ok: true }> {
  if (!(await getSession())) throw new Error("unauthorized");
  await saveNav(content);
  // We wrote past Payload, so its afterChange revalidation never ran. Nav shows on
  // every page, so refresh the whole tree.
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function saveFooterAction(content: FooterContent): Promise<{ ok: true }> {
  if (!(await getSession())) throw new Error("unauthorized");
  await saveFooter(content);
  revalidatePath("/", "layout");
  return { ok: true };
}
