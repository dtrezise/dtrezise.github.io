export const siteName = "Trump’s Kampf";
export const siteSubtitle = "Democratic Deconstruction Archive";
export const lastReviewed = "July 17, 2026";
export const mostRecentUpdate = "October 7, 2026";

export function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

export function trailingSlash(path: string) {
  if (path === "/") return path;
  const [pathname, hash] = path.split("#");
  const finalSegment = pathname.split("/").at(-1) ?? "";
  const normalized = pathname.endsWith("/") || finalSegment.includes(".") ? pathname : `${pathname}/`;
  return hash ? `${normalized}#${hash}` : normalized;
}

export function canonical(path: string) {
  return `${siteUrl()}${trailingSlash(path)}`;
}

export function eboxPath(slug: string) {
  return `/evidence/${slug}/`;
}

export function testPath(slug: string, anchor?: string) {
  return `/tests/${slug}/${anchor ? `#${anchor}` : ""}`;
}

export function socialImagePath(slug: string) {
  return `/social/${slug}.svg`;
}
