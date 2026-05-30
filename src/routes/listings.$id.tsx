import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { toast } from "sonner";
import { ShieldCheck, Clock, Sparkles } from "lucide-react";

export const Route = createFileRoute("/listings/$id")({
  head: () => ({ meta: [{ title: "Listing — Velvet & Lace" }] }),
  component: ListingDetail,
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center text-foreground/60">
      Couldn't load listing: {error.message}
    </div>
  ),
});

function ListingDetail() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [customNotes, setCustomNotes] = useState("");
  const [includeCustom, setIncludeCustom] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { data: listing, isLoading } = useQuery({
    queryKey: ["listing", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("listings")
        .select("*, profiles!listings_seller_profile_fk(display_name, verification, country, avatar_url, premium_until)")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div className="min-h-screen bg-background" />;
  if (!listing) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SiteNav />
        <div className="max-w-2xl mx-auto px-6 py-20 text-center">
          <h1 className="font-serif text-4xl mb-4">Listing not found</h1>
          <Link to="/browse" className="text-primary underline">Back to the Archive</Link>
        </div>
      </div>
    );
  }

  const l: any = listing;
  const isSeller = user?.id === l.seller_id;
  const sellerPremium = l.profiles?.premium_until && new Date(l.profiles.premium_until) > new Date();
  const subtotal = l.price_cents + (includeCustom ? l.customization_fee_cents : 0);
  const fee = sellerPremium ? 0 : Math.round(subtotal * 0.04);
  const total = subtotal + fee;

  async function onBuy() {
    if (!user) {
      navigate({ to: "/auth" });
      return;
    }
    if (isSeller) return;
    setSubmitting(true);
    try {
      const { data, error } = await supabase
        .from("transactions")
        .insert({
          listing_id: l.id,
          buyer_id: user.id,
          seller_id: l.seller_id,
          amount_cents: total,
          fee_cents: fee,
          customization_notes: includeCustom && customNotes ? customNotes : null,
          status: "pending",
        })
        .select("id")
        .single();
      if (error) throw error;
      toast.success("Order placed. Funds held in escrow.");
      navigate({ to: "/orders" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not place order");
    } finally {
      setSubmitting(false);
    }
  }

  const price = (c: number) => `$${(c / 100).toFixed(2)}`;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12">
        <div className="space-y-4">
          {l.images && l.images.length > 0 ? (
            l.images.map((url: string) => (
              <img key={url} src={url} alt={l.title} className="w-full aspect-[3/4] object-cover" />
            ))
          ) : (
            <div className="aspect-[3/4] bg-card" />
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3 text-[10px] uppercase tracking-[0.3em] text-foreground/40">
            {l.is_premium && <Sparkles className="size-3 text-accent" />}
            {l.region ?? "—"}
          </div>
          <h1 className="font-serif text-5xl mb-4">{l.title}</h1>
          <p className="text-3xl font-serif mb-8">{price(l.price_cents)}</p>

          {l.description && (
            <p className="text-sm leading-relaxed text-foreground/70 mb-8 whitespace-pre-wrap">
              {l.description}
            </p>
          )}

          <dl className="grid grid-cols-2 gap-4 mb-8 text-sm border-y border-border py-6">
            <div><dt className="text-[10px] uppercase tracking-widest text-foreground/40 mb-1">Fabric</dt><dd>{l.fabric ?? "—"}</dd></div>
            <div><dt className="text-[10px] uppercase tracking-widest text-foreground/40 mb-1">Wear</dt><dd>{l.wear_duration ?? "—"}</dd></div>
            <div><dt className="text-[10px] uppercase tracking-widest text-foreground/40 mb-1">Body type</dt><dd>{l.body_type ?? "—"}</dd></div>
            <div><dt className="text-[10px] uppercase tracking-widest text-foreground/40 mb-1">Seller</dt><dd>{l.profiles?.display_name ?? "Member"}</dd></div>
          </dl>

          {l.customizable && (
            <div className="border border-border p-4 mb-6">
              <label className="flex items-start gap-3 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-1 size-4 accent-primary"
                  checked={includeCustom}
                  onChange={(e) => setIncludeCustom(e.target.checked)}
                />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span>Add premium customization</span>
                    <span className="font-serif">+{price(l.customization_fee_cents)}</span>
                  </div>
                  {includeCustom && (
                    <textarea
                      rows={3}
                      placeholder="Your request (alterations, photos, scent, etc.)"
                      value={customNotes}
                      onChange={(e) => setCustomNotes(e.target.value)}
                      className="mt-3 w-full bg-transparent border border-border px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                  )}
                </div>
              </label>
            </div>
          )}

          <div className="space-y-2 text-sm mb-6">
            <div className="flex justify-between"><span className="text-foreground/60">Subtotal</span><span>{price(subtotal)}</span></div>
            <div className="flex justify-between">
              <span className="text-foreground/60">Marketplace fee {sellerPremium && "(waived — Premium)"}</span>
              <span>{price(fee)}</span>
            </div>
            <div className="flex justify-between font-serif text-lg pt-2 border-t border-border">
              <span>Total</span><span>{price(total)}</span>
            </div>
          </div>

          <button
            disabled={submitting || isSeller || l.status !== "active"}
            onClick={onBuy}
            className="w-full bg-primary text-primary-foreground py-4 text-sm uppercase tracking-widest hover:bg-primary/90 disabled:opacity-50"
          >
            {isSeller
              ? "This is your listing"
              : l.status !== "active"
              ? "No longer available"
              : submitting
              ? "Placing order…"
              : "Buy with escrow protection"}
          </button>

          <div className="mt-6 space-y-3 text-xs text-foreground/60">
            <div className="flex gap-2"><ShieldCheck className="size-4 text-accent shrink-0" /> Funds held in escrow until delivery confirmed</div>
            <div className="flex gap-2"><Clock className="size-4 text-accent shrink-0" /> 48-hour dispute window after delivery</div>
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}