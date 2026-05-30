import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { Check, Crown } from "lucide-react";

export const Route = createFileRoute("/membership")({
  head: () => ({
    meta: [
      { title: "Premium Membership — Velvet & Lace" },
      { name: "description", content: "Premium sellers waive the 4% marketplace fee and get top-of-page listing priority for a full year." },
      { property: "og:title", content: "Premium Membership — Velvet & Lace" },
      { property: "og:description", content: "Zero fees, priority indexing, and Verified Plus expedite for a full year." },
    ],
  }),
  component: MembershipPage,
});

const tiers = [
  {
    name: "Standard",
    price: "Free",
    cadence: "Always",
    cta: "Open an Account",
    highlight: false,
    features: [
      "Free buyer & seller registration",
      "4% marketplace fee per sale",
      "Standard verification queue",
      "Escrow-protected transactions",
      "Dual-sided ratings & feedback",
    ],
  },
  {
    name: "Premium",
    price: "$199",
    cadence: "per year",
    cta: "Join Premium",
    highlight: true,
    features: [
      "Zero transaction fees — 4% waived all year",
      "Listings pushed to the front page",
      "Top-of-results indexing for matching filters",
      "Expedited Verified Plus review",
      "Custom storefront URL & seller profile",
      "Priority dispute handling",
    ],
  },
];

function MembershipPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <header className="max-w-5xl mx-auto px-6 pt-20 pb-12 text-center">
        <span className="text-xs uppercase tracking-[0.3em] text-primary block mb-3">
          Membership
        </span>
        <h1 className="font-serif text-5xl lg:text-7xl leading-[0.95] mb-6 text-balance">
          One tier of <span className="italic text-primary">elevation</span>.
        </h1>
        <p className="text-lg text-foreground/70 max-w-2xl mx-auto leading-relaxed">
          Open a free account in seconds. Or step into Premium — zero fees, front-page placement, and a Verified Plus expedite.
        </p>
      </header>

      <section className="max-w-5xl mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-2 gap-8">
        {tiers.map((t) => (
          <div
            key={t.name}
            className={`p-10 border ${
              t.highlight ? "border-accent bg-card/60" : "border-border bg-card/20"
            } flex flex-col`}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-3xl">{t.name}</h2>
              {t.highlight && <Crown className="size-5 text-primary" strokeWidth={1.5} />}
            </div>
            <div className="flex items-baseline gap-2 mb-10">
              <span className="font-serif text-5xl">{t.price}</span>
              <span className="text-xs uppercase tracking-widest text-foreground/50">
                {t.cadence}
              </span>
            </div>
            <ul className="space-y-4 mb-10 flex-1">
              {t.features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-foreground/80">
                  <Check
                    className={`size-4 mt-0.5 shrink-0 ${
                      t.highlight ? "text-primary" : "text-foreground/50"
                    }`}
                    strokeWidth={2.5}
                  />
                  {f}
                </li>
              ))}
            </ul>
            <button
              className={`w-full py-3 text-sm font-semibold uppercase tracking-widest transition-colors ${
                t.highlight
                  ? "bg-accent text-accent-foreground ring-1 ring-accent hover:bg-primary hover:ring-primary"
                  : "border border-border hover:border-foreground/40"
              }`}
            >
              {t.cta}
            </button>
          </div>
        ))}
      </section>
      <SiteFooter />
    </div>
  );
}