import type { Metadata, Viewport } from "next";
import "./globals.css";
import { canonical, siteName } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(canonical("/")),
  title: { default: `${siteName} — Democratic Deconstruction Archive`, template: `%s | ${siteName}` },
  description: "A structured, source-first archive of democratic deconstruction risks and institutional guardrails.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, colorScheme: "light", themeColor: "#f3efe7" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
