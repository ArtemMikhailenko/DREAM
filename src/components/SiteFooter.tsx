import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CONTACTS } from "@/lib/contacts";

export async function SiteFooter() {
  const t = await getTranslations("Footer");
  const services = t.raw("services") as string[];
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <div className="footer-grid">
          <div className="footer-col footer-brand-col">
            <p className="footer-mark brush">dc.prod</p>
            <p className="footer-tagline">{t("tagline")}</p>
            <div className="footer-social">
              <a href={CONTACTS.whatsapp} target="_blank" rel="noopener" aria-label="WhatsApp">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.2-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-1.6-.8-2.6-1.4-3.7-3.2-.3-.5.3-.5.8-1.5.1-.2 0-.4 0-.5 0-.1-.7-1.6-.9-2.2-.2-.5-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4 0 1.4 1 2.8 1.2 3 .1.2 2 3.1 4.9 4.3 1.8.7 2.5.8 3.4.7.5-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.2-.3-.3-.6-.5z" />
                  <path d="M20.5 3.5C18.2 1.2 15.2 0 12 0 5.4 0 0 5.4 0 12c0 2.1.6 4.2 1.6 6L0 24l6.2-1.6c1.7.9 3.6 1.4 5.5 1.4h.1c6.6 0 12-5.4 12-12 0-3.2-1.2-6.2-3.3-8.3zM12 21.8h-.1c-1.7 0-3.4-.5-4.9-1.3l-.4-.2-3.7 1 1-3.6-.2-.4c-1-1.5-1.5-3.3-1.5-5.1 0-5.4 4.4-9.8 9.8-9.8 2.6 0 5.1 1 6.9 2.9 1.8 1.9 2.9 4.4 2.9 6.9 0 5.4-4.4 9.8-9.8 9.8z" />
                </svg>
              </a>
              <a href={CONTACTS.facebook} target="_blank" rel="noopener" aria-label="Facebook">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z" />
                </svg>
              </a>
              <a href={CONTACTS.instagram} target="_blank" rel="noopener" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                </svg>
              </a>
            </div>
          </div>
          <div className="footer-col">
            <h4 className="footer-h">{t("servicesHead")}</h4>
            <ul className="footer-list">
              {services.map((s) => (
                <li key={s}><Link href="/services">{s}</Link></li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <h4 className="footer-h">{t("studioHead")}</h4>
            <ul className="footer-list">
              <li><Link href="/about">{t("about")}</Link></li>
              <li><Link href="/#process">{t("process")}</Link></li>
              <li><Link href="/portfolio">{t("works")}</Link></li>
              <li><Link href="/#packages">{t("pricing")}</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4 className="footer-h">{t("contactsHead")}</h4>
            <ul className="footer-list">
              <li><a href={`mailto:${CONTACTS.email}`}>{CONTACTS.email}</a></li>
              <li><a href={`tel:${CONTACTS.phone}`}>{CONTACTS.phoneDisplay}</a></li>
              <li><Link href="/#lead">{t("getBrief")} ↗</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-copy">© {year} dc.prod studio · {t("fromIdea")}</p>
          <p className="footer-copy">{t("rights")}</p>
        </div>
      </div>
    </footer>
  );
}
