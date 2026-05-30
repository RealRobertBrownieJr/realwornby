import { ShieldCheck, Clock, Receipt, Truck } from "lucide-react";

const items = [
  { icon: ShieldCheck, label: "Verified Sellers Only" },
  { icon: Clock, label: "48h Dispute Window" },
  { icon: Receipt, label: "4% Marketplace Fee" },
  { icon: Truck, label: "Escrow Protection" },
];

export function TrustStrip() {
  return (
    <section className="bg-foreground text-background py-6">
      <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-between items-center gap-x-8 gap-y-4 text-[11px] font-semibold uppercase tracking-[0.2em]">
        {items.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2">
            <Icon className="size-4 text-accent shrink-0" strokeWidth={2} />
            {label}
          </div>
        ))}
      </div>
    </section>
  );
}