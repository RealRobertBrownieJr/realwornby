import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { TrustStrip } from "@/components/trust-strip";
import { ListingCard } from "@/components/listing-card";
import { listings } from "@/data/listings";
import { Check, ShieldCheck, Truck, Clock, Star, Crown } from "lucide-react";
import heroSlip from "@/assets/hero-slip.jpg";
import seal from "@/assets/seal.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Velvet & Lace — Luxury Consignment Marketplace" },
      { name: "description", content: "Curated peer-to-peer marketplace for verified pre-owned luxury intimate apparel. Escrow protection. 48h release. Discreet delivery." },
      { property: "og:title", content: "Velvet & Lace — Luxury Consignment Marketplace" },
      { property: "og:description", content: "Verified sellers. Escrow protection. 48-hour release. The new standard of intimate exchange." },
    ],
  }),
  component: Index,
});

function Index() {
  const featured = listings.slice(0, 3);
  const categories = [
    "All Collections",
    "Age 20-30",
    "Silk & Satin",
    "European Vintage",
    "Custom Requests",
    "Petite Fit",
    "Curvy Selection",
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      {/* Hero */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="lace-overlay absolute inset-0 pointer-events-none opacity-20" />
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 z-10">
            <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-primary mb-6 block">
              Peer-to-Peer Luxury Consignment
            </span>
            <h1 className="text-5xl lg:text-7xl font-serif font-medium leading-[0.95] mb-8 text-balance">
              The New Standard of{" "}
              <span className="italic text-primary">Intimate</span> Exchange
            </h1>
            <p className="text-lg text-foreground/70 max-w-[48ch] mb-10 text-pretty leading-relaxed">
              A curated peer-to-peer marketplace for verified luxury lingerie. Secured by escrow, authenticated by experts, and delivered with discretion.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/browse"
                className="bg-foreground text-background text-sm font-semibold py-3 px-7 ring-1 ring-foreground hover:bg-primary hover:text-primary-foreground hover:ring-primary transition-colors"
              >
                Explore Collection
              </Link>
              <Link
                to="/membership"
                className="border border-border hover:border-foreground/40 text-sm font-medium py-3 px-7 transition-colors"
              >
                Become a Seller
              </Link>
            </div>
          </div>
          <div className="lg:col-span-7 relative">
            <div className="w-full aspect-[4/5] rounded-[min(1vw,12px)] overflow-hidden ring-1 ring-border">
              <img
                src={heroSlip}
                alt="Ivory silk slip dress on a velvet mannequin in low gallery lighting"
                width={1080}
                height={1350}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-accent p-8 max-w-[280px] ring-1 ring-accent hidden md:block">
              <p className="text-xs uppercase tracking-widest text-accent-foreground/70 mb-2">
                Secure Escrow
              </p>
              <p className="text-sm leading-relaxed text-accent-foreground">
                Funds are held safely and only released 48 hours after verified delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      <TrustStrip />

      {/* Category rail */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 overflow-x-auto">
          <div className="flex space-x-10 py-5 whitespace-nowrap text-xs uppercase tracking-widest font-medium text-foreground/40">
            {categories.map((c, i) => (
              <button
                key={c}
                className={`pb-1 transition-colors ${
                  i === 0
                    ? "text-foreground border-b border-primary"
                    : "hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured grid */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-foreground/40 block mb-3">
              Currently in the Archive
            </span>
            <h2 className="font-serif text-4xl lg:text-5xl">Featured Pieces</h2>
          </div>
          <Link
            to="/browse"
            className="hidden sm:inline-block text-xs uppercase tracking-widest border-b border-border pb-1 hover:border-foreground transition-colors"
          >
            Browse All →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-10">
          {featured.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
      </main>

      {/* How it works */}
      <section className="border-t border-border py-24 bg-card/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-16">
            <span className="text-xs uppercase tracking-[0.3em] text-foreground/40 block mb-3">
              Protected, end to end
            </span>
            <h2 className="font-serif text-4xl lg:text-5xl mb-6">
              Every transaction held in <span className="italic text-primary">escrow</span>.
            </h2>
            <p className="text-foreground/60 leading-relaxed">
              We do not use PayPal. A secure custom payment gateway holds funds until you confirm the piece meets the listing standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {[
              { icon: ShieldCheck, n: "01", t: "Verified Profile", d: "Sellers submit identity documents to earn the Verified Plus badge." },
              { icon: Truck, n: "02", t: "Tracked Dispatch", d: "Sellers upload tracking number and proof of postage before funds move." },
              { icon: Clock, n: "03", t: "48h Countdown", d: "Once marked delivered, a 48-hour inspection window opens for the buyer." },
              { icon: Check, n: "04", t: "Escrow Release", d: "No dispute raised? Funds release automatically to the seller's wallet." },
            ].map(({ icon: Icon, n, t, d }) => (
              <div key={n} className="border-t border-border pt-6">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-foreground/40">
                    {n}
                  </span>
                  <Icon className="size-5 text-primary" strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-2xl mb-3">{t}</h3>
                <p className="text-sm text-foreground/60 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Membership */}
      <section className="py-32 border-t border-border relative">
        <div className="lace-overlay absolute inset-0 pointer-events-none opacity-10" />
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <span className="text-primary font-serif italic text-2xl mb-4 block">
              Elevate Your Atelier
            </span>
            <h2 className="text-4xl lg:text-5xl font-serif font-medium leading-tight mb-8 text-balance">
              Premium Membership for Professional Sellers
            </h2>
            <ul className="space-y-6 mb-10">
              {[
                { t: "Zero Transaction Fees", d: "The flat 4% marketplace fee is waived for all sales during your subscription year." },
                { t: "Priority Indexing", d: "Your listings are pushed to the first page and the top of every search result." },
                { t: "Verified Plus Badge", d: "Premium members receive expedited verification review and a permanent trust mark." },
              ].map(({ t, d }) => (
                <li key={t} className="flex items-start gap-4">
                  <span className="size-5 rounded-full bg-accent/30 flex items-center justify-center shrink-0 mt-1 ring-1 ring-accent/50">
                    <Check className="size-3 text-accent-foreground" strokeWidth={3} />
                  </span>
                  <div>
                    <p className="font-medium text-foreground">{t}</p>
                    <p className="text-sm text-foreground/50">{d}</p>
                  </div>
                </li>
              ))}
            </ul>
            <button className="bg-accent text-accent-foreground text-sm font-semibold py-3 px-8 ring-1 ring-accent hover:bg-primary hover:ring-primary transition-colors inline-flex items-center gap-2">
              <Crown className="size-4" strokeWidth={1.5} />
              Join Premium — $199 / Year
            </button>
          </div>
          <div className="relative">
            <div className="w-full aspect-square rounded-full overflow-hidden ring-1 ring-border opacity-90">
              <img
                src={seal}
                alt="Embossed gold wax seal on black silk"
                loading="lazy"
                width={1024}
                height={1024}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -top-4 -right-4 bg-background border border-border px-5 py-3 flex items-center gap-2">
              <Star className="size-4 text-primary fill-primary" />
              <span className="text-[11px] uppercase tracking-widest">Members Only</span>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
