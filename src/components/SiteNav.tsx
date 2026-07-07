"use client";
import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

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
  const TG = (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M21.9 4.4 18.6 20c-.2 1.1-.9 1.4-1.8.9l-5-3.7-2.4 2.3c-.3.3-.5.5-1 .5l.4-5.1 9.3-8.4c.4-.4-.1-.6-.6-.2L6 12.5l-5-1.5c-1.1-.3-1.1-1.1.2-1.6L20.5 2.8c.9-.3 1.7.2 1.4 1.6z" />
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
          <Link href="/" className="nav-logo" onClick={close}>
            DC.PROD
            <small>{t("studio")}</small>
          </Link>
          <ul className="nav-links">
            <li><Link href="/about">{t("aboutUs")}</Link></li>
            <li><Link href="/services">{t("services")}</Link></li>
            <li><Link href="/portfolio">{t("works")}</Link></li>
            <li><Link href="/#packages">{t("pricing")}</Link></li>
            <li><Link href="/#lead">{t("contacts")}</Link></li>
          </ul>
          <div className="nav-side">
            {LangSwitch}
            <a className="nav-call" href="tel:+1000">{t("callUs")}</a>
            <div className="nav-social">
              <a href="https://wa.me/" target="_blank" rel="noopener" aria-label="WhatsApp">{WA}</a>
              <a href="https://t.me/" target="_blank" rel="noopener" aria-label="Telegram">{TG}</a>
              <a href="https://instagram.com/" target="_blank" rel="noopener" aria-label="Instagram">{IG}</a>
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
      <div className={`nav-drawer${open ? " open" : ""}`}>
        <div className="wrap nav-drawer-inner">
          <ul className="nav-drawer-links">
            <li><Link href="/about" onClick={close}>{t("aboutUs")}</Link></li>
            <li><Link href="/services" onClick={close}>{t("services")}</Link></li>
            <li><Link href="/portfolio" onClick={close}>{t("works")}</Link></li>
            <li><Link href="/#packages" onClick={close}>{t("pricing")}</Link></li>
            <li><Link href="/#lead" onClick={close}>{t("contacts")}</Link></li>
          </ul>
          <div className="nav-drawer-foot">
            {LangSwitch}
            <a className="nav-call" href="tel:+1000">{t("callUs")}</a>
            <div className="nav-social nav-drawer-social">
              <a href="https://wa.me/" target="_blank" rel="noopener" aria-label="WhatsApp">{WA}</a>
              <a href="https://t.me/" target="_blank" rel="noopener" aria-label="Telegram">{TG}</a>
              <a href="https://instagram.com/" target="_blank" rel="noopener" aria-label="Instagram">{IG}</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
