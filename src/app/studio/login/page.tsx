import { redirect } from "next/navigation";
import { getSession } from "@/studio/lib/auth";
import { LoginForm } from "./LoginForm";

export default async function LoginPage() {
  if (await getSession()) redirect("/studio");
  return (
    <div className="st-login">
      <div className="st-login-card">
        <div className="st-login-brand">dc<em>.</em>prod</div>
        <p className="st-login-sub">Панель управления студии</p>
        <LoginForm />
      </div>
    </div>
  );
}
