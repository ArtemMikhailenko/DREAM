import { getPayload } from "payload";
import config from "@payload-config";
import Link from "next/link";

/**
 * Branded landing panel above Payload's default dashboard.
 *
 * The stock dashboard is just a flat list of collection cards, which reads as
 * generic. This puts the things the team actually opens — new leads, the pages
 * they edit most — one click away, with live counts.
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

type Stat = { label: string; value: number; href: string; accent?: boolean };

async function getStats(): Promise<Stat[]> {
  try {
    const payload = await getPayload({ config });
    const count = async (collection: "leads" | "services" | "cases" | "testimonials", where = {}) =>
      (await payload.count({ collection, where })).totalDocs;

    const [newLeads, leads, services, cases, testimonials] = await Promise.all([
      count("leads", { status: { equals: "new" } }),
      count("leads"),
      count("services"),
      count("cases"),
      count("testimonials"),
    ]);

    return [
      { label: "Новые заявки", value: newLeads, href: "/admin/collections/leads?where[status][equals]=new", accent: true },
      { label: "Всего заявок", value: leads, href: "/admin/collections/leads" },
      { label: "Услуги", value: services, href: "/admin/collections/services" },
      { label: "Кейсы", value: cases, href: "/admin/collections/cases" },
      { label: "Отзывы", value: testimonials, href: "/admin/collections/testimonials" },
    ];
  } catch {
    // A dashboard must never be the thing that breaks the admin.
    return [];
  }
}

const LINKS: { label: string; desc: string; href: string }[] = [
  { label: "Главная", desc: "Первый экран, услуги, цены, FAQ", href: "/admin/globals/home" },
  { label: "Шоурил", desc: "Видеоблок на главной", href: "/admin/globals/showreel" },
  { label: "Услуги", desc: "9 страниц услуг", href: "/admin/collections/services" },
  { label: "Кейсы", desc: "Портфолио", href: "/admin/collections/cases" },
  { label: "Отзывы", desc: "Отзывы клиентов", href: "/admin/collections/testimonials" },
  { label: "О студии", desc: "История, принципы, цифры", href: "/admin/globals/about" },
  { label: "Медиа", desc: "Картинки и видео", href: "/admin/collections/media" },
  { label: "Заявки", desc: "Лиды с сайта", href: "/admin/collections/leads" },
];

export async function Dashboard() {
  const stats = await getStats();

  return (
    <div className="dcp-dash">
      <header className="dcp-dash-hero">
        <div>
          <p className="dcp-dash-kicker">dc.prod</p>
          <h1 className="dcp-dash-title">Панель управления</h1>
          <p className="dcp-dash-sub">
            Тексты сайта на трёх языках. Переключайте язык в правом верхнем углу — он меняет
            только контент, интерфейс остаётся русским.
          </p>
        </div>
        <a className="dcp-dash-site" href={SITE_URL} target="_blank" rel="noopener">
          Открыть сайт <span aria-hidden="true">↗</span>
        </a>
      </header>

      {stats.length > 0 && (
        <div className="dcp-stats">
          {stats.map((s) => (
            <Link key={s.label} href={s.href} className={`dcp-stat${s.accent && s.value > 0 ? " is-hot" : ""}`}>
              <span className="dcp-stat-v">{s.value}</span>
              <span className="dcp-stat-l">{s.label}</span>
            </Link>
          ))}
        </div>
      )}

      <p className="dcp-dash-head">Быстрый переход</p>
      <div className="dcp-links">
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} className="dcp-link">
            <span className="dcp-link-t">{l.label}</span>
            <span className="dcp-link-d">{l.desc}</span>
            <span className="dcp-link-a" aria-hidden="true">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
