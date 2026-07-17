import React from "react";
import { ImageResponse } from "next/og";
import { eboxBySlug, eboxes } from "@/data/eboxes";

export const runtime = "edge";

export function generateStaticParams() {
  return [{ slug: "archive" }, ...eboxes.map((ebox) => ({ slug: ebox.slug }))];
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ebox = eboxBySlug.get(slug);
  const isArchive = slug === "archive";
  if (!ebox && !isArchive) return new Response("Not found", { status: 404 });

  const title = ebox?.title ?? "Compare mechanisms. Preserve differences. Follow the record.";
  const label = ebox?.category ?? "Democratic Deconstruction Archive";
  const footer = ebox?.status ?? "Rhetoric · policy · personnel · elections · institutions · alliances";
  const identifier = ebox?.id ?? "SOURCE-FIRST ARCHIVE";

  return new ImageResponse(
    React.createElement(
      "div",
      { style: { width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#f3efe7", color: "#131b1e", padding: "58px 66px", borderTop: "18px solid #9f2f2f", fontFamily: "serif" } },
      React.createElement("div", { style: { display: "flex", justifyContent: "space-between", fontFamily: "sans-serif", fontSize: 22, letterSpacing: 2.4, textTransform: "uppercase" } }, React.createElement("span", null, "Trump’s Kampf"), React.createElement("span", null, identifier)),
      React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 20 } }, React.createElement("span", { style: { fontFamily: "sans-serif", color: "#9f2f2f", fontSize: 24, letterSpacing: 1.7, textTransform: "uppercase" } }, label), React.createElement("strong", { style: { fontSize: isArchive ? 70 : 56, lineHeight: isArchive ? .96 : 1.02, maxWidth: 1050, letterSpacing: -2 } }, title)),
      React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", fontFamily: "sans-serif", gap: 35 } }, React.createElement("span", { style: { maxWidth: 870, fontSize: 23, lineHeight: 1.25 } }, footer), React.createElement("span", { style: { fontSize: 18, color: "#68645f", whiteSpace: "nowrap" } }, "Evidence · context · tests · sources")),
    ),
    { width: 1200, height: 630 },
  );
}
