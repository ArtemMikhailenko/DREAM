"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/studio/lib/auth";
import { createTestimonial, deleteTestimonial, updateTestimonial, createCase, deleteCase, updateCase, updateService } from "@/studio/lib/collections";
import type { TestimonialDoc } from "@/studio/lib/content";
import type { CaseDoc, ServiceDoc } from "@/studio/lib/collections";

export async function createTestimonialAction(): Promise<void> {
  if (!(await getSession())) throw new Error("unauthorized");
  const id = await createTestimonial();
  revalidatePath("/studio/collections/testimonials");
  redirect(`/studio/collections/testimonials/${id}`);
}

export async function saveTestimonialAction(doc: TestimonialDoc): Promise<{ ok: true }> {
  if (!(await getSession())) throw new Error("unauthorized");
  await updateTestimonial(doc);
  revalidatePath("/", "layout");
  revalidatePath("/studio/collections/testimonials");
  return { ok: true };
}

export async function deleteTestimonialAction(id: number): Promise<void> {
  if (!(await getSession())) throw new Error("unauthorized");
  await deleteTestimonial(id);
  revalidatePath("/", "layout");
  revalidatePath("/studio/collections/testimonials");
  redirect("/studio/collections/testimonials");
}

export async function createCaseAction(): Promise<void> {
  if (!(await getSession())) throw new Error("unauthorized");
  const id = await createCase();
  revalidatePath("/studio/collections/cases");
  redirect(`/studio/collections/cases/${id}`);
}

export async function saveCaseAction(doc: CaseDoc): Promise<{ ok: boolean; error?: string }> {
  if (!(await getSession())) throw new Error("unauthorized");
  try {
    await updateCase(doc);
  } catch (e) {
    if ((e as Error)?.message === "SLUG_TAKEN") return { ok: false, error: "Такой slug уже занят другим кейсом." };
    throw e;
  }
  revalidatePath("/", "layout");
  revalidatePath("/studio/collections/cases");
  return { ok: true };
}

export async function deleteCaseAction(id: number): Promise<void> {
  if (!(await getSession())) throw new Error("unauthorized");
  await deleteCase(id);
  revalidatePath("/", "layout");
  revalidatePath("/studio/collections/cases");
  redirect("/studio/collections/cases");
}

export async function saveServiceAction(doc: ServiceDoc): Promise<{ ok: true }> {
  if (!(await getSession())) throw new Error("unauthorized");
  await updateService(doc);
  revalidatePath("/", "layout");
  revalidatePath("/studio/collections/services");
  return { ok: true };
}
