import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy — Velvet & Lace" },
      { name: "description", content: "How Velvet & Lace handles personal data, verification documents, and discreet delivery information." },
      { property: "og:title", content: "Privacy — Velvet & Lace" },
      { property: "og:description", content: "Discretion, encryption, and how we handle verification documents." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  const sections = [
    { t: "What we collect", d: "Account email, display name, optional profile metadata (region, body type, age band), uploaded photographs, and identity documents submitted for verification." },
    { t: "How we use it", d: "To operate the marketplace, route escrow payments, deliver discreet shipping notifications, and award the Verified Plus badge." },
    { t: "Identity documents", d: "ID scans are reviewed manually within 48 hours, then encrypted at rest. They are never shared with buyers, sellers, or third parties outside our verification provider." },
    { t: "Discreet delivery", d: "Shipping labels never reference the marketplace name. Tracking events visible to the buyer are limited to status — not seller address." },
    { t: "Your rights", d: "Request export or deletion at any time from your ledger, or email privacy@velvetandlace.example for assisted removal." },
  ];
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <article className="max-w-3xl mx-auto px-6 py-20">
        <span className="text-xs uppercase tracking-[0.3em] text-primary block mb-3">Policy</span>
        <h1 className="font-serif text-5xl lg:text-6xl mb-10">Privacy Notice</h1>
        <p className="text-foreground/60 text-sm mb-12">Last reviewed {new Date().toLocaleDateString("en-GB", { year: "numeric", month: "long" })}.</p>
        <div className="space-y-10">
          {sections.map((s) => (
            <section key={s.t}>
              <h2 className="font-serif text-2xl mb-3">{s.t}</h2>
              <p className="text-foreground/70 leading-relaxed">{s.d}</p>
            </section>
          ))}
        </div>
      </article>
      <SiteFooter />
    </div>
  );
}