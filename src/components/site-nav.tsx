import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";

export function SiteNav() {
  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="text-2xl font-serif tracking-tight italic">
          Velvet &amp; Lace
        </Link>
        <div className="hidden md:flex items-center space-x-8 text-sm uppercase tracking-widest font-medium text-foreground/60">
          <Link to="/browse" className="hover:text-foreground transition-colors" activeProps={{ className: "text-foreground" }}>
            The Archive
          </Link>
          <Link to="/verification" className="hover:text-foreground transition-colors">
            Verification
          </Link>
          <Link to="/membership" className="hover:text-foreground transition-colors">
            Membership
          </Link>
        </div>
        <div className="flex items-center space-x-6">
          <button className="text-sm font-medium hidden sm:block">Sign In</button>
          <button className="bg-accent text-accent-foreground text-sm font-medium py-2 pr-4 pl-3 flex items-center gap-2 ring-1 ring-accent transition-all hover:bg-primary hover:ring-primary">
            <Plus className="size-4 shrink-0" strokeWidth={1.5} />
            Sell Item
          </button>
        </div>
      </div>
    </nav>
  );
}