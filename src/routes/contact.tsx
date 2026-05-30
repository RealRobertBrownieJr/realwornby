import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { Mail, MessageCircle, ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Velvet & Lace" },
      { name: "description", content: "Reach the Velvet & Lace concierge for support, verification queries, or dispute escalation." },
      { property: "og:title", content: "Contact — Velvet & Lace" },
      { property: "og:description", content: "Concierge, verification, and dispute escalation channels." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const channels = [
    { icon: Mail, t: "Concierge", d: "General inquiries, account help, partnership requests.", v: "concierge@velvetandlace.example" },
    { icon: ShieldAlert, t: "Trust & Safety", d: "Report a profile, escalate a dispute, or flag a listing.", v: "trust@velvetandlace.example" },
    { icon: MessageCircle, t: "Press & Press kits", d: "Editorial requests, interviews, and media materials.", v: "press@velvetandlace.example" },
  ];
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <header className="max-w-4xl mx-auto px-6 pt-20 pb-10">
        <span className="text-xs uppercase tracking-[0.3em] text-primary block mb-3">Contact</span>
        <h1 className="font-serif text-5xl lg:text-7xl leading-[0.95] mb-6 text-balance">
          Speak with the <span className="italic text-primary">concierge</span>.
        </h1>
        <p className="text-lg text-foreground/70 max-w-2xl leading-relaxed">
          Every message is read by a human within one business day. For active disputes, use the order page in your ledger to start the formal 48-hour review.
        </p>
      </header>
      <section className="max-w-4xl mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-3 gap-6">
        {channels.map(({ icon: Icon, t, d, v }) => (
          <a
            key={t}
            href={`mailto:${v}`}
            className="border border-border p-6 hover:border-foreground/40 transition-colors block"
          >
            <Icon className="size-5 text-primary mb-4" strokeWidth={1.5} />
            <h2 className="font-serif text-2xl mb-2">{t}</h2>
            <p className="text-sm text-foreground/60 leading-relaxed mb-4">{d}</p>
            <p className="text-xs uppercase tracking-widest text-foreground/80 break-all">{v}</p>
          </a>
        ))}
      </section>
      <SiteFooter />
    </div>
  );
}