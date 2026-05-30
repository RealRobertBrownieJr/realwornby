import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { ListingCard } from "@/components/listing-card";
import { listings as seedListings, type Listing } from "@/data/listings";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Search, SlidersHorizontal } from "lucide-react";

export const Route = createFileRoute("/browse")({
  head: () => ({
    meta: [
      { title: "The Archive — Browse Listings | Velvet & Lace" },
      { name: "description", content: "Browse verified luxury intimate apparel. Filter by country, demographics, fabric, wear duration and custom alterations." },
      { property: "og:title", content: "The Archive — Browse Listings" },
      { property: "og:description", content: "Browse verified luxury intimate apparel by fabric, fit, region, and custom request." },
    ],
  }),
  component: Browse,
});

function FilterGroup({
  title,
  options,
}: {
  title: string;
  options: string[];
}) {
  return (
    <section>
      <h3 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-foreground/40 mb-4">
        {title}
      </h3>
      <ul className="space-y-2.5">
        {options.map((o) => (
          <li key={o}>
            <label className="flex items-center gap-3 text-sm text-foreground/80 hover:text-foreground cursor-pointer">
              <input
                type="checkbox"
                className="size-3.5 border border-border bg-transparent accent-primary"
              />
              {o}
            </label>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Browse() {
  const { data: liveListings } = useQuery({
    queryKey: ["listings", "active"],
    queryFn: async (): Promise<Listing[]> => {
      const { data, error } = await supabase
        .from("listings")
        .select("id, title, price_cents, fabric, wear_duration, region, body_type, customizable, images, is_premium, profiles!listings_seller_profile_fk(display_name, verification)")
        .eq("status", "active")
        .order("is_premium", { ascending: false })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((l: any) => ({
        id: l.id,
        title: l.title,
        price: Math.round(l.price_cents / 100),
        image: l.images?.[0] ?? seedListings[0].image,
        wear: l.wear_duration ?? "—",
        fabric: l.fabric ?? "—",
        region: l.region ?? "—",
        seller: l.profiles?.display_name ?? "Member",
        badge: l.is_premium
          ? "Premium Listing"
          : l.profiles?.verification === "verified_plus"
            ? "Verified Plus"
            : "Verified",
        customizable: l.customizable,
        age: "",
        bodyType: l.body_type ?? "",
      }));
    },
  });

  const items: Listing[] =
    liveListings && liveListings.length > 0 ? liveListings : seedListings;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <span className="text-xs uppercase tracking-[0.3em] text-foreground/40 block mb-3">
            The Archive
          </span>
          <h1 className="font-serif text-5xl lg:text-6xl mb-8">
            Browse <span className="italic text-primary">Verified</span> Listings
          </h1>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 flex items-center gap-3 border border-border px-4 py-3 bg-card/40">
              <Search className="size-4 text-foreground/40" />
              <input
                type="search"
                placeholder="Search by brand, fabric, or seller…"
                className="bg-transparent outline-none w-full text-sm placeholder:text-foreground/40"
              />
            </div>
            <button className="md:hidden flex items-center justify-center gap-2 border border-border px-4 py-3 text-xs uppercase tracking-widest">
              <SlidersHorizontal className="size-4" />
              Filters
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-12">
        {/* Filters */}
        <aside className="space-y-10">
          <FilterGroup
            title="Country"
            options={["United Kingdom", "France", "Italy", "Austria", "Japan", "United States"]}
          />
          <FilterGroup
            title="Seller Age"
            options={["18-24", "25-30", "31-35", "36-45", "45+"]}
          />
          <FilterGroup
            title="Body Type"
            options={["Petite", "Slim", "Hourglass", "Curvy", "Athletic"]}
          />
          <FilterGroup
            title="Fabric Type"
            options={["Silk Satin", "Chantilly Lace", "Leavers Lace", "Mulberry Silk", "Sheer Tulle"]}
          />
          <FilterGroup
            title="Wear Duration"
            options={["New with Tags", "1–4 Hours", "Half Day", "Full Day", "Multi-Day"]}
          />
          <FilterGroup
            title="Customizations"
            options={["Custom Alterations", "Personal Requests", "Photo Add-on", "Scented Wrap"]}
          />

          <div className="border border-accent/40 bg-accent/10 p-5">
            <h4 className="font-serif italic text-xl text-foreground mb-2">
              Premium Members First
            </h4>
            <p className="text-[11px] leading-relaxed text-foreground/60 mb-4">
              Listings from Premium sellers are surfaced to the top of every filter set.
            </p>
            <button className="w-full border border-accent py-2 text-[10px] uppercase tracking-widest hover:bg-accent transition-colors">
              Become a Member
            </button>
          </div>
        </aside>

        {/* Grid */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <p className="text-sm text-foreground/60">
              <span className="text-foreground font-semibold">{items.length}</span> verified pieces
            </p>
            <select className="bg-transparent border border-border px-3 py-2 text-xs uppercase tracking-widest text-foreground/70">
              <option>Premium First</option>
              <option>Newest</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-y-16 gap-x-10">
            {items.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        </section>
      </div>

      <SiteFooter />
    </div>
  );
}