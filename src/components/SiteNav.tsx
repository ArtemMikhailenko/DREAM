"use client";
import { useState, useEffect, type MouseEvent } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { CONTACTS } from "@/lib/contacts";
import { NavLogo } from "@/components/NavLogo";

export function SiteNav() {
  const t = useTranslations("Nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // lock body scroll while the mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpen(false);

  // "/#packages", "/#lead": on the home page scroll there ourselves (after unlocking the page),
  // elsewhere let the link go to the home page with the hash
  const onHash = (e: MouseEvent, href: string) => {
    const id = href.split("#")[1];
    const el = id ? document.getElementById(id) : null;
    setOpen(false);
    if (!el) return;
    e.preventDefault();
    e.stopPropagation();
    document.body.style.overflow = "";
    window.setTimeout(() => {
      document.body.style.overflow = "";
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: "smooth" });
      history.replaceState(null, "", `#${id}`);
    }, 140);
  };
  const openLead = () => {
    setOpen(false);
    window.setTimeout(() => window.dispatchEvent(new CustomEvent("dc:open-lead")), 80);
  };
  const links = [
    ["/about", t("aboutUs")],
    ["/services", t("services")],
    ["/portfolio", t("works")],
    ["/#packages", t("pricing")],
    ["/#lead", t("contacts")],
  ] as const;
  const cta = ({ ru: "Бесплатный аудит", he: "אודיט חינם" } as Record<string, string>)[locale] ?? "Free audit";
  const ctaSub = ({ ru: "Разберём, где теряются ваши заявки", he: "נבדוק איפה הולכים לאיבוד הלידים שלכם" } as Record<string, string>)[locale] ?? "We'll find where your leads get lost";

  const LangSwitch = (
    <div className="nav-lang" aria-label={t("language")}>
      {routing.locales.map((l) => (
        <Link
          key={l}
          href={pathname}
          locale={l}
          className={`nav-lang-item${l === locale ? " active" : ""}`}
          onClick={close}
        >
          {l}
        </Link>
      ))}
    </div>
  );

  const WA = (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.2-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-1.6-.8-2.6-1.4-3.7-3.2-.3-.5.3-.5.8-1.5.1-.2 0-.4 0-.5 0-.1-.7-1.6-.9-2.2-.2-.5-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4 0 1.4 1 2.8 1.2 3 .1.2 2 3.1 4.9 4.3 1.8.7 2.5.8 3.4.7.5-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.2-.3-.3-.6-.5z" />
      <path d="M20.5 3.5C18.2 1.2 15.2 0 12 0 5.4 0 0 5.4 0 12c0 2.1.6 4.2 1.6 6L0 24l6.2-1.6c1.7.9 3.6 1.4 5.5 1.4h.1c6.6 0 12-5.4 12-12 0-3.2-1.2-6.2-3.3-8.3zM12 21.8h-.1c-1.7 0-3.4-.5-4.9-1.3l-.4-.2-3.7 1 1-3.6-.2-.4c-1-1.5-1.5-3.3-1.5-5.1 0-5.4 4.4-9.8 9.8-9.8 2.6 0 5.1 1 6.9 2.9 1.8 1.9 2.9 4.4 2.9 6.9 0 5.4-4.4 9.8-9.8 9.8z" />
    </svg>
  );
  const FB = (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z" />
    </svg>
  );
  const IG = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );

  return (
    <>
      <nav className="nav" id="top">
        <div className="wrap nav-inner">
          <NavLogo onClick={close} />
          <ul className="nav-links">
            {links.map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="nav-roll" onClick={href.includes("#") ? (e) => onHash(e, href) : undefined}>
                  <span className="nav-roll-in" data-t={label}>{label}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="nav-side">
            {LangSwitch}
            <a className="nav-call" href={`tel:${CONTACTS.phone}`}>{t("callUs")}</a>
            <div className="nav-social">
              <a href={CONTACTS.whatsapp} target="_blank" rel="noopener" aria-label="WhatsApp">{WA}</a>
              <a href={CONTACTS.facebook} target="_blank" rel="noopener" aria-label="Facebook">{FB}</a>
              <a href={CONTACTS.instagram} target="_blank" rel="noopener" aria-label="Instagram">{IG}</a>
            </div>
            <button
              type="button"
              className={`nav-burger${open ? " is-open" : ""}`}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>
      <div className={`nav-drawer${open ? " open" : ""}`} aria-hidden={!open}>
        <div className="wrap nav-drawer-inner">
          <ul className="nav-drawer-links">
            {links.map(([href, label], i) => {
              const here = !href.includes("#") && pathname.startsWith(href);
              return (
                <li key={href} style={{ ["--i" as string]: i }}>
                  <Link
                    href={href}
                    className={here ? "is-here" : undefined}
                    onClick={href.includes("#") ? (e) => onHash(e, href) : close}
                    tabIndex={open ? 0 : -1}
                  >
                    <span className="nd-num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                    <span className="nd-label">{label}</span>
                    <svg className="nd-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="nav-drawer-foot">
            <button type="button" className="nd-cta glass-btn cta-pulse" onClick={openLead} tabIndex={open ? 0 : -1}>
              <span><b>{cta}</b><small>{ctaSub}</small></span>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </button>
            <div className="nd-row">
              <a className="nd-call" href={`tel:${CONTACTS.phone}`} tabIndex={open ? 0 : -1}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z" /></svg>
                {t("callUs")}
              </a>
              <div className="nav-social nav-drawer-social">
                <a href={CONTACTS.whatsapp} target="_blank" rel="noopener" aria-label="WhatsApp" tabIndex={open ? 0 : -1}>{WA}</a>
                <a href={CONTACTS.facebook} target="_blank" rel="noopener" aria-label="Facebook" tabIndex={open ? 0 : -1}>{FB}</a>
                <a href={CONTACTS.instagram} target="_blank" rel="noopener" aria-label="Instagram" tabIndex={open ? 0 : -1}>{IG}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
