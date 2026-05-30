import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/lib/auth-context";
import { SiteNav } from "@/components/site-nav";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [{ title: "Sign in — Velvet & Lace" }],
  }),
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [accountType, setAccountType] = useState<"buyer" | "seller">("buyer");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) navigate({ to: "/" });
  }, [user, loading, navigate]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              display_name: displayName || email.split("@")[0],
              account_type: accountType,
            },
          },
        });
        if (error) throw error;
        toast.success(
          accountType === "seller"
            ? "Seller account created. Check your email to confirm, then list your first piece."
            : "Buyer account created. Check your email to confirm."
        );
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function onGoogle() {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) toast.error("Google sign-in failed");
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <div className="max-w-md mx-auto px-6 py-20">
        <span className="text-xs uppercase tracking-[0.3em] text-foreground/40 block mb-3">
          {mode === "signin" ? "Members" : "New here"}
        </span>
        <h1 className="font-serif text-4xl mb-8">
          {mode === "signin" ? (
            <>Welcome <span className="italic text-primary">back</span></>
          ) : (
            <>Join the <span className="italic text-primary">Archive</span></>
          )}
        </h1>

        <button
          onClick={onGoogle}
          className="w-full border border-border py-3 text-sm uppercase tracking-widest hover:bg-card transition-colors mb-6"
        >
          Continue with Google
        </button>

        <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] text-foreground/40 mb-6">
          <div className="h-px flex-1 bg-border" />
          or email
          <div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {mode === "signup" && (
            <>
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-foreground/40 block mb-2">
                  I'm joining as
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {(["buyer", "seller"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setAccountType(t)}
                      className={`border py-3 text-xs uppercase tracking-widest transition-colors ${
                        accountType === t
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border text-foreground/60 hover:text-foreground"
                      }`}
                    >
                      {t === "buyer" ? "Buyer" : "Seller"}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-foreground/40 mt-2 leading-relaxed">
                  {accountType === "seller"
                    ? "Sellers can list pieces and also purchase. Verification required before your first payout."
                    : "Buyers can browse and purchase. You can upgrade to sell anytime from your profile."}
                </p>
              </div>
              <input
                type="text"
                placeholder="Display name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-transparent border border-border px-4 py-3 text-sm outline-none focus:border-primary"
              />
            </>
          )}
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent border border-border px-4 py-3 text-sm outline-none focus:border-primary"
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent border border-border px-4 py-3 text-sm outline-none focus:border-primary"
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary text-primary-foreground py-3 text-sm uppercase tracking-widest hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {submitting ? "…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <p className="text-xs text-foreground/50 mt-6 text-center">
          {mode === "signin" ? "No account yet?" : "Already a member?"}{" "}
          <button
            type="button"
            className="text-foreground underline underline-offset-4"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          >
            {mode === "signin" ? "Sign up" : "Sign in"}
          </button>
        </p>
        <p className="text-center mt-8 text-xs text-foreground/40">
          <Link to="/">← Back to the Archive</Link>
        </p>
      </div>
    </div>
  );
}