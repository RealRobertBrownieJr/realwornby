import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { toast } from "sonner";

export const Route = createFileRoute("/sell")({
  head: () => ({
    meta: [{ title: "List an item — Velvet & Lace" }],
  }),
  component: SellPage,
});

const FABRICS = ["Silk Satin", "Chantilly Lace", "Leavers Lace", "Mulberry Silk", "Sheer Tulle", "Silk Jacquard", "Other"];
const WEAR = ["New with Tags", "1–4 Hours", "Half Day", "Full Day", "Multi-Day"];
const BODY = ["Petite", "Slim", "Hourglass", "Curvy", "Athletic"];

function SellPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    fabric: FABRICS[0],
    wear_duration: WEAR[0],
    region: "",
    body_type: BODY[0],
    customizable: false,
    customization_fee: "",
    image_url: "",
  });

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [user, loading, navigate]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    try {
      const price_cents = Math.round(parseFloat(form.price) * 100);
      if (!price_cents || price_cents <= 0) throw new Error("Enter a valid price");
      const { error } = await supabase.from("listings").insert({
        seller_id: user.id,
        title: form.title.trim(),
        description: form.description.trim() || null,
        price_cents,
        fabric: form.fabric,
        wear_duration: form.wear_duration,
        region: form.region.trim() || null,
        body_type: form.body_type,
        customizable: form.customizable,
        customization_fee_cents: form.customizable && form.customization_fee
          ? Math.round(parseFloat(form.customization_fee) * 100)
          : 0,
        images: form.image_url ? [form.image_url] : [],
      });
      if (error) throw error;
      toast.success("Listing published.");
      navigate({ to: "/browse" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not publish listing");
    } finally {
      setSubmitting(false);
    }
  }

  function setField<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  const inputCls = "w-full bg-transparent border border-border px-4 py-3 text-sm outline-none focus:border-primary";
  const labelCls = "text-[10px] uppercase tracking-[0.25em] text-foreground/50 block mb-2";

  if (loading || !user) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <div className="max-w-2xl mx-auto px-6 py-16">
        <span className="text-xs uppercase tracking-[0.3em] text-foreground/40 block mb-3">
          The Atelier
        </span>
        <h1 className="font-serif text-5xl mb-10">
          List a <span className="italic text-primary">piece</span>
        </h1>

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className={labelCls}>Title</label>
            <input className={inputCls} required maxLength={120} value={form.title} onChange={(e) => setField("title", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Description</label>
            <textarea rows={4} className={inputCls} maxLength={1500} value={form.description} onChange={(e) => setField("description", e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Price (USD)</label>
              <input className={inputCls} required type="number" min="1" step="0.01" value={form.price} onChange={(e) => setField("price", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Region (city, country)</label>
              <input className={inputCls} placeholder="Paris, FR" value={form.region} onChange={(e) => setField("region", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Fabric</label>
              <select className={inputCls} value={form.fabric} onChange={(e) => setField("fabric", e.target.value)}>
                {FABRICS.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Wear duration</label>
              <select className={inputCls} value={form.wear_duration} onChange={(e) => setField("wear_duration", e.target.value)}>
                {WEAR.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Body type</label>
              <select className={inputCls} value={form.body_type} onChange={(e) => setField("body_type", e.target.value)}>
                {BODY.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Image URL</label>
              <input className={inputCls} type="url" placeholder="https://…" value={form.image_url} onChange={(e) => setField("image_url", e.target.value)} />
            </div>
          </div>

          <div className="border border-border p-5">
            <label className="flex items-center gap-3 text-sm cursor-pointer">
              <input type="checkbox" className="size-4 accent-primary" checked={form.customizable} onChange={(e) => setField("customizable", e.target.checked)} />
              Offer premium customizations (alterations, requests, add-ons)
            </label>
            {form.customizable && (
              <div className="mt-4">
                <label className={labelCls}>Customization fee (USD)</label>
                <input className={inputCls} type="number" min="0" step="0.01" value={form.customization_fee} onChange={(e) => setField("customization_fee", e.target.value)} />
              </div>
            )}
          </div>

          <p className="text-xs text-foreground/50 leading-relaxed">
            A 4% marketplace fee applies on sale, waived for Premium members. All sales are escrow-protected and release 48h after delivery.
          </p>

          <button type="submit" disabled={submitting} className="w-full bg-primary text-primary-foreground py-4 text-sm uppercase tracking-widest hover:bg-primary/90 disabled:opacity-50">
            {submitting ? "Publishing…" : "Publish listing"}
          </button>
        </form>
      </div>
      <SiteFooter />
    </div>
  );
}