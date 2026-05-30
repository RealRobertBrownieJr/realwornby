import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { toast } from "sonner";

export const Route = createFileRoute("/orders")({
  head: () => ({ meta: [{ title: "Orders — Velvet & Lace" }] }),
  component: OrdersPage,
});

type Tab = "purchases" | "sales";

function OrdersPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("purchases");
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [user, loading, navigate]);

  const { data: orders } = useQuery({
    queryKey: ["orders", user?.id, tab],
    enabled: !!user,
    queryFn: async () => {
      const column = tab === "purchases" ? "buyer_id" : "seller_id";
      const { data, error } = await supabase
        .from("transactions")
        .select("*, listings(title, images), buyer:profiles!transactions_buyer_profile_fk(display_name), seller:profiles!transactions_seller_profile_fk(display_name)")
        .eq(column, user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  if (loading || !user) return null;

  async function update(id: string, patch: Record<string, any>) {
    const { error } = await supabase.from("transactions").update(patch).eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Updated");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    }
  }

  async function markPaid(id: string) {
    // Simulated payment capture for now — Stripe will replace this.
    await update(id, { status: "paid" });
  }

  async function markShipped(id: string) {
    const tracking = prompt("Tracking number?");
    if (!tracking) return;
    await update(id, { status: "shipped", tracking_number: tracking, shipped_at: new Date().toISOString() });
  }

  async function markDelivered(id: string) {
    const now = new Date();
    const due = new Date(now.getTime() + 48 * 60 * 60 * 1000);
    await update(id, { status: "delivered", delivered_at: now.toISOString(), release_due_at: due.toISOString() });
  }

  async function release(id: string) {
    await update(id, { status: "released", released_at: new Date().toISOString() });
  }

  async function dispute(id: string) {
    const reason = prompt("Reason for dispute?");
    if (!reason) return;
    await update(id, { status: "disputed", disputed_at: new Date().toISOString(), dispute_reason: reason });
  }

  const price = (c: number) => `$${(c / 100).toFixed(2)}`;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <div className="max-w-5xl mx-auto px-6 py-16">
        <span className="text-xs uppercase tracking-[0.3em] text-foreground/40 block mb-3">Dashboard</span>
        <h1 className="font-serif text-5xl mb-10">Your <span className="italic text-primary">Ledger</span></h1>

        <div className="flex gap-6 border-b border-border mb-8">
          {(["purchases", "sales"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`pb-3 text-xs uppercase tracking-widest ${tab === t ? "text-foreground border-b border-primary" : "text-foreground/40"}`}
            >
              {t}
            </button>
          ))}
        </div>

        {orders && orders.length === 0 && (
          <p className="text-sm text-foreground/50">No {tab} yet.</p>
        )}

        <div className="space-y-4">
          {orders?.map((o: any) => {
            const isBuyer = tab === "purchases";
            const counterparty = isBuyer ? o.seller?.display_name : o.buyer?.display_name;
            const releaseDue = o.release_due_at ? new Date(o.release_due_at) : null;
            const releaseOverdue = releaseDue && releaseDue < new Date();
            return (
              <div key={o.id} className="border border-border p-5 flex gap-5 items-center">
                {o.listings?.images?.[0] && (
                  <img src={o.listings.images[0]} alt="" className="size-20 object-cover" />
                )}
                <div className="flex-1">
                  <Link to="/listings/$id" params={{ id: o.listing_id }} className="font-serif text-xl hover:underline">
                    {o.listings?.title ?? "Listing"}
                  </Link>
                  <div className="text-xs text-foreground/50 mt-1">
                    {isBuyer ? "Seller" : "Buyer"}: {counterparty} · {price(o.amount_cents)}
                  </div>
                  {o.tracking_number && <div className="text-xs text-foreground/50">Tracking: {o.tracking_number}</div>}
                  {releaseDue && o.status === "delivered" && (
                    <div className="text-xs text-accent mt-1">
                      Auto-release {releaseOverdue ? "due" : "in"} {releaseDue.toLocaleString()}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-[10px] uppercase tracking-widest px-2 py-1 border border-border">{o.status}</span>
                  <div className="flex gap-2">
                    {isBuyer && o.status === "pending" && (
                      <button onClick={() => markPaid(o.id)} className="text-xs uppercase tracking-widest border border-primary px-3 py-1.5 hover:bg-primary hover:text-primary-foreground">
                        Pay (sim)
                      </button>
                    )}
                    {!isBuyer && o.status === "paid" && (
                      <button onClick={() => markShipped(o.id)} className="text-xs uppercase tracking-widest border border-border px-3 py-1.5 hover:bg-card">Mark shipped</button>
                    )}
                    {isBuyer && o.status === "shipped" && (
                      <button onClick={() => markDelivered(o.id)} className="text-xs uppercase tracking-widest border border-border px-3 py-1.5 hover:bg-card">Mark delivered</button>
                    )}
                    {isBuyer && o.status === "delivered" && (
                      <>
                        <button onClick={() => release(o.id)} className="text-xs uppercase tracking-widest border border-primary px-3 py-1.5 hover:bg-primary hover:text-primary-foreground">Release funds</button>
                        <button onClick={() => dispute(o.id)} className="text-xs uppercase tracking-widest border border-destructive text-destructive px-3 py-1.5 hover:bg-destructive hover:text-destructive-foreground">Dispute</button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}