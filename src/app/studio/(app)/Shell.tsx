"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import type { Session } from "@/studio/lib/auth";
import { logoutAction } from "../login/actions";

const IconOverview = () => (
  <svg className="st-nav-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></svg>
);
const IconInbox = () => (
  <svg className="st-nav-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 13h4l2 3h4l2-3h4" /><path d="M4 13 6 4h12l2 9v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" /></svg>
);
const IconDoc = () => (
  <svg className="st-nav-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 3v5h5" /><path d="M6 3h8l5 5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" /><path d="M9 13h6M9 17h6" /></svg>
);
const IconImage = () => (
  <svg className="st-nav-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></svg>
);

type NavItem = { href: string; label: string; icon: React.FC; badge?: number; soon?: boolean };

export function Shell({ session, newLeads, children }: { session: Session; newLeads: number; children: React.ReactNode }) {
  const pathname = usePathname();
  const initials = (session.name || session.email).trim().charAt(0).toUpperCase();

  const work: NavItem[] = [
    { href: "/studio", label: "Обзор", icon: IconOverview },
    { href: "/studio/leads", label: "Заявки", icon: IconInbox, badge: newLeads || undefined },
    { href: "/studio/media", label: "Медиа", icon: IconImage },
  ];
  const content: NavItem[] = [
    { href: "/studio/content/home", label: "Главная", icon: IconDoc },
    { href: "/studio/content/about", label: "О студии", icon: IconDoc },
    { href: "/studio/content/nav", label: "Навигация", icon: IconDoc },
    { href: "/studio/content/footer", label: "Футер", icon: IconDoc },
    { href: "/studio/content/lead-form", label: "Форма заявки", icon: IconDoc },
  ];
  const collections: NavItem[] = [
    { href: "/studio/collections/testimonials", label: "Отзывы", icon: IconDoc },
    { href: "#", label: "Услуги", icon: IconDoc, soon: true },
    { href: "#", label: "Портфолио", icon: IconDoc, soon: true },
  ];

  const isActive = (href: string) => (href === "/studio" ? pathname === "/studio" : pathname.startsWith(href));

  const renderItem = (it: NavItem) => {
    const cls = `st-nav-item${isActive(it.href) ? " active" : ""}`;
    const inner = (
      <>
        <it.icon />
        <span>{it.label}</span>
        {it.badge ? <span className="st-nav-badge">{it.badge}</span> : null}
        {it.soon ? <span className="st-nav-badge">скоро</span> : null}
      </>
    );
    if (it.soon) return <span key={it.label} className="st-nav-item" style={{ opacity: 0.5, cursor: "default" }}>{inner}</span>;
    return <Link key={it.href} href={it.href} className={cls}>{inner}</Link>;
  };

  return (
    <div className="st-shell">
      <aside className="st-side">
        <div className="st-brand">
          <div>
            <div className="st-brand-mark">dc<em>.</em>prod</div>
            <div className="st-brand-sub">studio</div>
          </div>
        </div>

        <nav className="st-nav">
          <div className="st-nav-label">Работа</div>
          {work.map(renderItem)}
          <div className="st-nav-label">Контент</div>
          {content.map(renderItem)}
          <div className="st-nav-label">Коллекции</div>
          {collections.map(renderItem)}
        </nav>

        <div className="st-side-foot">
          <div className="st-user">
            <div className="st-avatar">{initials}</div>
            <div className="st-user-meta">
              <div className="st-user-name">{session.name || session.email}</div>
              <div className="st-user-role">{session.role === "admin" ? "Администратор" : "Редактор"}</div>
            </div>
          </div>
          <form action={logoutAction}>
            <button type="submit" className="st-btn st-btn-ghost" style={{ width: "100%", justifyContent: "flex-start" }}>Выйти</button>
          </form>
        </div>
      </aside>

      <main className="st-main">{children}</main>
    </div>
  );
}
