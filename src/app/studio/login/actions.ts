"use server";

import { redirect } from "next/navigation";
import { authenticate, createSession, destroySession } from "@/studio/lib/auth";

export async function loginAction(_prev: string | null, formData: FormData): Promise<string | null> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return "Введите email и пароль.";

  const session = await authenticate(email, password);
  if (!session) return "Неверный email или пароль.";

  await createSession(session);
  redirect("/studio");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/studio/login");
}
