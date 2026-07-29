"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";

export function LoginForm() {
  const [error, action, pending] = useActionState(loginAction, null);
  return (
    <form action={action}>
      {error ? <div className="st-error">{error}</div> : null}
      <div className="st-field">
        <label className="st-label" htmlFor="email">Email</label>
        <input className="st-input" id="email" name="email" type="email" autoComplete="username" required autoFocus />
      </div>
      <div className="st-field">
        <label className="st-label" htmlFor="password">Пароль</label>
        <input className="st-input" id="password" name="password" type="password" autoComplete="current-password" required />
      </div>
      <button className="st-btn st-btn-primary" type="submit" disabled={pending}>
        {pending ? "Входим…" : "Войти"}
      </button>
    </form>
  );
}
