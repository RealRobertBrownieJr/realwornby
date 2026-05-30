import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
          <Link to="/" className="text-2xl font-serif tracking-tight italic">
            Velvet &amp; Lace
          </Link>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 text-[11px] font-medium uppercase tracking-widest text-foreground/40">
            <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link to="/escrow-terms" className="hover:text-foreground">Escrow Terms</Link>
            <Link to="/verification" className="hover:text-foreground">Verification</Link>
            <Link to="/contact" className="hover:text-foreground">Contact</Link>
          </div>
        </div>
        <div className="text-center text-[10px] font-medium uppercase tracking-[0.3em] text-foreground/20">
          &copy; {new Date().getFullYear()} Velvet &amp; Lace. Peer-to-Peer Luxury Consignment.
        </div>
      </div>
    </footer>
  );
}