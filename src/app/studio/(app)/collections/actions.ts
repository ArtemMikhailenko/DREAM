"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/studio/lib/auth";
import { createTestimonial, deleteTestimonial, updateTestimonial } from "@/studio/lib/collections";
import type { TestimonialDoc } from "@/studio/lib/content";

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
