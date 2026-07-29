"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/studio/lib/auth";
import { setNote, setStatus, STATUSES, type LeadStatus } from "@/studio/lib/leads";

export async function updateStatusAction(id: number, status: LeadStatus): Promise<void> {
  if (!(await getSession())) throw new Error("unauthorized");
  if (!STATUSES.some((s) => s.value === status)) throw new Error("bad status");
  await setStatus(id, status);
  revalidatePath("/studio/leads");
  revalidatePath(`/studio/leads/${id}`);
  revalidatePath("/studio");
}

export async function saveNoteAction(id: number, note: string): Promise<void> {
  if (!(await getSession())) throw new Error("unauthorized");
  await setNote(id, note.slice(0, 5000));
  revalidatePath(`/studio/leads/${id}`);
}
