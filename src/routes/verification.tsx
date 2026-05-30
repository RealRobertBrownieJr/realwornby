import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { ShieldCheck, FileCheck, BadgeCheck, Lock } from "lucide-react";

export const Route = createFileRoute("/verification")({
  head: () => ({
    meta: [
      { title: "Verification — Velvet & Lace" },
      { name: "description", content: "Our trust framework: identity documents, Verified Plus badges, and fraud prevention for buyers and sellers." },
      { property: "og:title", content: "Verification — Velvet & Lace" },
      { property: "og:description", content: "How we verify identities and award the Verified Plus trust badge." },
    ],
  }),
  component: VerificationPage,
});

function VerificationPage() {
  const steps = [
    { icon: FileCheck, t: "Submit ID", d: "Upload a government-issued document. Reviewed by a human in under 48 hours." },
    { icon: ShieldCheck, t: "Proof of Address", d: "A recent utility bill or bank statement confirms your registered region." },
    { icon: BadgeCheck, t: "Selfie Match", d: "A discreet liveness check confirms the document belongs to you." },
    { icon: Lock, t: "Verified Plus", d: "Receive the permanent badge — buyers see you trust-first across the archive." },
  ];
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <header className="max-w-5xl mx-auto px-6 pt-20 pb-12">
        <span className="text-xs uppercase tracking-[0.3em] text-primary block mb-3">
          Trust Framework
        </span>
        <h1 className="font-serif text-5xl lg:text-7xl leading-[0.95] mb-6 text-balance">
          The <span className="italic text-primary">Verified Plus</span> standard.
        </h1>
        <p className="text-lg text-foreground/70 max-w-2xl leading-relaxed">
          A four-step verification ritual that protects both sides of every transaction. No anonymous sellers. No fraudulent profiles. No exceptions.
        </p>
      </header>
      <section className="border-y border-border bg-card/40">
        <div className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
          {steps.map(({ icon: Icon, t, d }, i) => (
            <div key={t} className="border-t border-border pt-6">
              <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-foreground/40">
                  Step 0{i + 1}
                </span>
                <Icon className="size-5 text-primary" strokeWidth={1.5} />
              </div>
              <h2 className="font-serif text-3xl mb-3">{t}</h2>
              <p className="text-sm text-foreground/60 leading-relaxed max-w-md">{d}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h3 className="font-serif text-3xl lg:text-4xl mb-6">Ready to be seen?</h3>
        <Link
          to="/membership"
          className="inline-block bg-accent text-accent-foreground text-sm font-semibold py-3 px-8 ring-1 ring-accent hover:bg-primary hover:ring-primary transition-colors"
        >
          Start Verification
        </Link>
      </section>
      <SiteFooter />
    </div>
  );
}