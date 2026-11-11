import { adLabels, currencyFor, money, type AdCampaign } from "@/lib/ad-results";

/** One campaign drawn like an Ads Manager card, in the visitor's language and currency. */
export function AdCard({ c, locale }: { c: AdCampaign; locale: string }) {
  const L = adLabels(locale);
  const cur = currencyFor(locale);
  return (
    <div className="adc" dir="ltr">
      <div className="adc-head">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="adc-thumb" src={c.thumb} alt="" loading="lazy" decoding="async" />
        <i className={`adc-dot${c.active ? " on" : ""}`} aria-hidden="true" />
        <div className="adc-title">
          <b dir="auto">{c.name}</b>
          <span><em className={c.active ? "on" : ""}>{c.active ? L.active : L.off}</em> · {L[c.objective]}</span>
        </div>
      </div>
      <div className="adc-stats">
        <div><b>{c.results}</b><span>{L[c.metric]}</span></div>
        <div><b>{money(c.cost, cur)}</b><span>{c.metric === "reach" ? L.costReach : L.cost}</span></div>
        <div><b>{money(c.spent, cur)}</b><span>{L.spent}</span></div>
      </div>
    </div>
  );
}
