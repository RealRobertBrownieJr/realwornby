import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
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
  selected,
  onToggle,
}: {
  title: string;
  options: string[];
  selected: Set<string>;
  onToggle: (value: string) => void;
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
                checked={selected.has(o)}
                onChange={() => onToggle(o)}
              />
              {o}
            </label>
          </li>
        ))}
      </ul>
    </section>
  );
}

type SortKey = "premium" | "newest" | "price-asc" | "price-desc";

function Browse() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("premium");
  const [filters, setFilters] = useState<Record<string, Set<string>>>({
    country: new Set(),
    bodyType: new Set(),
    fabric: new Set(),
    wear: new Set(),
    customizations: new Set(),
  });

  function toggle(group: keyof typeof filters, value: string) {
    setFilters((prev) => {
      const next = new Set(prev[group]);
      next.has(value) ? next.delete(value) : next.add(value);
      return { ...prev, [group]: next };
    });
  }

  const activeCount = Object.values(filters).reduce((n, s) => n + s.size, 0);

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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const out = items.filter((l) => {
      if (q) {
        const hay = `${l.title} ${l.fabric} ${l.region} ${l.seller}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (filters.country.size && ![...filters.country].some((c) => l.region.toLowerCase().includes(c.toLowerCase()))) return false;
      if (filters.bodyType.size && !filters.bodyType.has(l.bodyType)) return false;
      if (filters.fabric.size && !filters.fabric.has(l.fabric)) return false;
      if (filters.wear.size && !filters.wear.has(l.wear)) return false;
      if (filters.customizations.size) {
        const needsCustom = filters.customizations.has("Custom Alterations") || filters.customizations.has("Personal Requests");
        if (needsCustom && !l.customizable) return false;
      }
      return true;
    });
    const sorted = [...out];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    else if (sort === "premium") sorted.sort((a, b) => Number(b.badge === "Premium Listing") - Number(a.badge === "Premium Listing"));
    // "newest" relies on query order (already sorted by created_at desc server-side)
    return sorted;
  }, [items, query, filters, sort]);

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
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="bg-transparent outline-none w-full text-sm placeholder:text-foreground/40"
              />
            </div>
            <button className="md:hidden flex items-center justify-center gap-2 border border-border px-4 py-3 text-xs uppercase tracking-widest">
              <SlidersHorizontal className="size-4" />
              Filters{activeCount > 0 ? ` (${activeCount})` : ""}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-12">
        {/* Filters */}
        <aside className="space-y-10">
          {activeCount > 0 && (
            <button
              onClick={() => setFilters({ country: new Set(), bodyType: new Set(), fabric: new Set(), wear: new Set(), customizations: new Set() })}
              className="text-[10px] uppercase tracking-widest text-primary hover:underline"
            >
              Clear all filters ({activeCount})
            </button>
          )}
          <FilterGroup
            title="Country"
            options={["United Kingdom", "France", "Italy", "Austria", "Japan", "United States"]}
            selected={filters.country}
            onToggle={(v) => toggle("country", v)}
          />
          <FilterGroup
            title="Body Type"
            options={["Petite", "Slim", "Hourglass", "Curvy", "Athletic"]}
            selected={filters.bodyType}
            onToggle={(v) => toggle("bodyType", v)}
          />
          <FilterGroup
            title="Fabric Type"
            options={["Silk Satin", "Chantilly Lace", "Leavers Lace", "Mulberry Silk", "Sheer Tulle"]}
            selected={filters.fabric}
            onToggle={(v) => toggle("fabric", v)}
          />
          <FilterGroup
            title="Wear Duration"
            options={["New with Tags", "1–4 Hours", "Half Day", "Full Day", "Multi-Day"]}
            selected={filters.wear}
            onToggle={(v) => toggle("wear", v)}
          />
          <FilterGroup
            title="Customizations"
            options={["Custom Alterations", "Personal Requests", "Photo Add-on", "Scented Wrap"]}
            selected={filters.customizations}
            onToggle={(v) => toggle("customizations", v)}
          />

          <div className="border border-accent/40 bg-accent/10 p-5">
            <h4 className="font-serif italic text-xl text-foreground mb-2">
              Premium Members First
            </h4>
            <p className="text-[11px] leading-relaxed text-foreground/60 mb-4">
              Listings from Premium sellers are surfaced to the top of every filter set.
            </p>
            <Link
              to="/membership"
              className="block text-center w-full border border-accent py-2 text-[10px] uppercase tracking-widest hover:bg-accent transition-colors"
            >
              Become a Member
            </Link>
          </div>
        </aside>

        {/* Grid */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <p className="text-sm text-foreground/60">
              <span className="text-foreground font-semibold">{filtered.length}</span> verified pieces
            </p>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="bg-transparent border border-border px-3 py-2 text-xs uppercase tracking-widest text-foreground/70"
            >
              <option value="premium">Premium First</option>
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-y-16 gap-x-10">
            {filtered.length === 0 ? (
              <p className="col-span-full text-center text-foreground/40 py-20 text-sm">
                No pieces match your filters. Try clearing a few.
              </p>
            ) : (
              filtered.map((l) => <ListingCard key={l.id} listing={l} />)
            )}
          </div>
        </section>
      </div>

      <SiteFooter />
    </div>
  );
}