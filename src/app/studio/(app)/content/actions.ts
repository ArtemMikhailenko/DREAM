"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/studio/lib/auth";
import { saveNav, saveFooter, saveLeadForm, saveAbout, saveHome, saveHomeImages, saveHomeCards, type NavContent, type FooterContent, type LeadFormContent, type AboutContent, type HomeContent } from "@/studio/lib/content";
import type { HomeCards } from "@/studio/lib/content-schema";

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

export async function saveLeadFormAction(content: LeadFormContent): Promise<{ ok: true }> {
  if (!(await getSession())) throw new Error("unauthorized");
  await saveLeadForm(content);
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function saveAboutAction(content: AboutContent): Promise<{ ok: true }> {
  if (!(await getSession())) throw new Error("unauthorized");
  await saveAbout(content);
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function saveHomeAction(content: HomeContent): Promise<{ ok: true }> {
  if (!(await getSession())) throw new Error("unauthorized");
  await saveHome(content);
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function saveHomeImagesAction(bgId: number | null, bgMobileId: number | null): Promise<{ ok: true }> {
  if (!(await getSession())) throw new Error("unauthorized");
  await saveHomeImages(bgId, bgMobileId);
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function saveHomeCardsAction(cards: HomeCards): Promise<{ ok: true }> {
  if (!(await getSession())) throw new Error("unauthorized");
  await saveHomeCards(cards);
  revalidatePath("/", "layout");
  return { ok: true };
}
