import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { eboxes } from "../data/eboxes";

type SocialRecord = { slug: string; title: string; label: string; footer: string; identifier: string };

const archive: SocialRecord = {
  slug: "archive",
  title: "Compare mechanisms. Preserve differences. Follow the record.",
  label: "Democratic Deconstruction Archive",
  footer: "Rhetoric · policy · personnel · elections · institutions · alliances",
  identifier: "SOURCE-FIRST ARCHIVE",
};

function escapeXml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[character] ?? character);
}

function lines(value: string, maxLength: number) {
  const words = value.split(/\s+/);
  const result: string[] = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length > maxLength && line) { result.push(line); line = word; } else line = candidate;
  }
  if (line) result.push(line);
  return result.slice(0, 4);
}

function render(record: SocialRecord) {
  const titleLines = lines(record.title, record.slug === "archive" ? 34 : 42);
  const title = titleLines.map((line, index) => `<text x="66" y="${260 + index * 68}" class="title">${escapeXml(line)}</text>`).join("");
  return `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><style>.k{font:600 22px Arial,sans-serif;letter-spacing:2.4px}.label{font:600 24px Arial,sans-serif;letter-spacing:1.7px}.title{font:700 56px Georgia,serif}.footer{font:400 23px Arial,sans-serif}.muted{fill:#68645f}</style><rect width="1200" height="630" fill="#f3efe7"/><rect width="1200" height="18" fill="#9f2f2f"/><text x="66" y="82" class="k">TRUMP’S KAMPF</text><text x="1134" y="82" text-anchor="end" class="k">${escapeXml(record.identifier)}</text><text x="66" y="186" class="label" fill="#9f2f2f">${escapeXml(record.label.toUpperCase())}</text>${title}<text x="66" y="566" class="footer">${escapeXml(record.footer)}</text><text x="1134" y="566" text-anchor="end" class="k muted">EVIDENCE · CONTEXT · TESTS · SOURCES</text></svg>`;
}

const outputDirectory = join(process.cwd(), "dist", "client", "social");
await mkdir(outputDirectory, { recursive: true });
const records: SocialRecord[] = [archive, ...eboxes.map((ebox) => ({ slug: ebox.slug, title: ebox.title, label: ebox.category, footer: ebox.status, identifier: ebox.id }))];
await Promise.all(records.map((record) => writeFile(join(outputDirectory, `${record.slug}.svg`), render(record))));
