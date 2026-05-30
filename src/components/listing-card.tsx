import type { Listing } from "@/data/listings";
import { ShoppingBag } from "lucide-react";

export function ListingCard({ listing }: { listing: Listing }) {
  return (
    <article className="group cursor-pointer">
      <div className="relative aspect-[3/4] mb-5 overflow-hidden rounded-[min(1vw,12px)] bg-card">
        <img
          src={listing.image}
          alt={listing.title}
          loading="lazy"
          width={800}
          height={1066}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
        {listing.badge && (
          <div className="absolute top-4 left-4 flex gap-2">
            <span
              className={`text-[10px] font-semibold tracking-widest px-2 py-1 uppercase ${
                listing.badge === "Premium Listing"
                  ? "bg-accent text-accent-foreground"
                  : "bg-background/80 backdrop-blur-sm ring-1 ring-border text-foreground"
              }`}
            >
              {listing.badge}
            </span>
          </div>
        )}
        <div className="absolute bottom-4 right-4">
          <div className="bg-primary size-9 flex items-center justify-center rounded-full opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
            <ShoppingBag className="size-4 text-primary-foreground" strokeWidth={2} />
          </div>
        </div>
      </div>
      <div className="flex justify-between items-start mb-2 gap-4">
        <h3 className="font-serif text-xl leading-tight">{listing.title}</h3>
        <p className="text-lg font-serif shrink-0">${listing.price}</p>
      </div>
      <div className="flex items-center gap-3 text-xs text-foreground/50 font-medium">
        <span>Wear: {listing.wear}</span>
        <span className="size-1 bg-foreground/20 rounded-full" />
        <span>{listing.fabric}</span>
      </div>
      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-5 bg-muted rounded-full ring-1 ring-border" />
          <span className="text-xs tracking-wide">{listing.seller}</span>
        </div>
        {listing.customizable ? (
          <div className="flex items-center gap-1.5">
            <div className="size-1.5 rounded-full bg-emerald-500/80" />
            <span className="text-[10px] uppercase tracking-tighter text-foreground/40">
              Customizable
            </span>
          </div>
        ) : (
          <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 border border-border text-foreground/40">
            {listing.region.split(",")[1]?.trim() ?? listing.region}
          </span>
        )}
      </div>
    </article>
  );
}