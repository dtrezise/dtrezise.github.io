import Link from "next/link";
import { lastReviewed, mostRecentUpdate, siteName, siteSubtitle } from "@/lib/site";

export function SiteHeader({ active = "archive" }: { active?: "archive" | "tests" | "methodology" | "editorial" | "about" }) {
  const links = [
    { id: "archive", label: "Evidence", href: "/" },
    { id: "tests", label: "Tests", href: "/tests/" },
    { id: "methodology", label: "Method", href: "/methodology/" },
    { id: "editorial", label: "Standards", href: "/editorial/" },
    { id: "about", label: "About", href: "/about/" },
  ] as const;

  return (
    <header className="site-header" id="top">
      <Link className="wordmark" href="/" aria-label={`${siteName} home`}>
        <span className="wordmark__title">{siteName}</span>
        <span className="wordmark__subtitle">{siteSubtitle}</span>
      </Link>
      <nav aria-label="Primary navigation">
        {links.map((link) => (
          <Link key={link.id} href={link.href} aria-current={active === link.id ? "page" : undefined}>
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <strong>{siteName}</strong>
        <p>Compare mechanisms. Preserve differences. Follow the record.</p>
      </div>
      <div className="site-footer__meta">
        <span>Latest record review {mostRecentUpdate} · archive baseline {lastReviewed}</span>
        <span>Independent editorial project · Temporary public archive</span>
      </div>
      <a href="#top" aria-label="Back to top">Back to top ↑</a>
    </footer>
  );
}
