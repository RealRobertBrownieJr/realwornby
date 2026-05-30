import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/escrow-terms")({
  head: () => ({
    meta: [
      { title: "Escrow Terms — Velvet & Lace" },
      { name: "description", content: "How the Velvet & Lace escrow holds funds, the 48-hour release window, the dispute path, and the 4% marketplace fee." },
      { property: "og:title", content: "Escrow Terms — Velvet & Lace" },
      { property: "og:description", content: "Funds are held in escrow until the 48-hour inspection window closes." },
    ],
  }),
  component: EscrowTermsPage,
});

function EscrowTermsPage() {
  const sections = [
    { t: "1. Funds capture", d: "When a buyer confirms a purchase, the full amount — including the optional customization fee and the 4% marketplace fee (waived for Premium sellers) — is captured and held in escrow. No funds reach the seller at this point." },
    { t: "2. Tracked dispatch", d: "The seller must upload a tracking number and mark the order as shipped within 5 business days, or the buyer may cancel and receive an automatic full refund." },
    { t: "3. 48-hour inspection window", d: "Once the buyer marks the package delivered, a 48-hour countdown begins. During this window the buyer may either release the funds early or open a formal dispute." },
    { t: "4. Automatic release", d: "If no dispute is raised within 48 hours, escrow funds are automatically released to the seller and the listing is marked sold." },
    { t: "5. Disputes", d: "A dispute pauses the release. Trust & Safety reviews the evidence (photos, messages, tracking) and decides between full refund, partial refund, or release. Decisions are issued within 5 business days." },
    { t: "6. Fees", d: "A flat 4% marketplace fee is deducted at release. Premium members ($199/year) pay zero marketplace fees for the duration of their membership." },
    { t: "7. Prohibited content", d: "Listings that misrepresent condition, identity, or origin will be removed and the seller's escrow balance frozen pending review." },
  ];
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <article className="max-w-3xl mx-auto px-6 py-20">
        <span className="text-xs uppercase tracking-[0.3em] text-primary block mb-3">Terms</span>
        <h1 className="font-serif text-5xl lg:text-6xl mb-6">Escrow Terms</h1>
        <p className="text-foreground/60 text-sm mb-12">
          The contract that governs every transaction. Pair this with our <Link to="/privacy" className="underline">Privacy Notice</Link>.
        </p>
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