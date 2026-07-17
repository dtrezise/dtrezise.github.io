export type HistoricalLeader = {
  id: "orban" | "putin" | "mussolini" | "hitler" | "mao" | "stalin" | "kim";
  name: string;
  period: string;
  source: { label: string; url: string };
};

export type PlaybookItem = {
  id: string;
  label: string;
  description: string;
  trumpEvidence: string[];
  scores: Record<HistoricalLeader["id"], 0 | 1 | 2 | 3 | 4>;
};

export type PlaybookGroup = {
  id: string;
  label: string;
  items: PlaybookItem[];
};

export const historicalLeaders: HistoricalLeader[] = [
  { id: "orban", name: "Viktor Orbán", period: "Hungary, 2010–2022", source: { label: "Freedom House — Hungary", url: "https://freedomhouse.org/country/hungary/freedom-world/2025" } },
  { id: "putin", name: "Vladimir Putin", period: "Russia, 2000–2004", source: { label: "V-Dem — Democracy Report", url: "https://v-dem.net/documents/61/v-dem-dr__2025_lowres_v2.pdf" } },
  { id: "mussolini", name: "Benito Mussolini", period: "Italy, 1922–1926", source: { label: "Britannica — Benito Mussolini", url: "https://www.britannica.com/biography/Benito-Mussolini" } },
  { id: "hitler", name: "Adolf Hitler", period: "Germany, 1933–1934", source: { label: "USHMM — The Enabling Act", url: "https://encyclopedia.ushmm.org/content/en/article/the-enabling-act" } },
  { id: "mao", name: "Mao Zedong", period: "China, 1949–1976", source: { label: "Britannica — Mao Zedong", url: "https://www.britannica.com/biography/Mao-Zedong" } },
  { id: "stalin", name: "Joseph Stalin", period: "USSR, 1928–1953", source: { label: "Britannica — Joseph Stalin", url: "https://www.britannica.com/biography/Joseph-Stalin" } },
  { id: "kim", name: "Kim Il-sung", period: "North Korea, 1948–1994", source: { label: "Britannica — Kim Il-sung", url: "https://www.britannica.com/biography/Kim-Il-Sung" } },
];

export const playbookGroups: PlaybookGroup[] = [
  {
    id: "opposition", label: "Political opposition & state power", items: [
      { id: "enemy", label: "Internal-enemy framing", description: "Opponents or ideological classes cast as threats outside ordinary civic competition.", trumpEvidence: ["global-radical-left-counterterrorism-campaign-2026", "nspm-7-domestic-terrorism-strategy-2025", "enemy-within-military-opposition-rhetoric"], scores: { orban: 3, putin: 2, mussolini: 3, hitler: 3, mao: 2, stalin: 3, kim: 2 } },
      { id: "retaliation", label: "Pressure on named critics", description: "State tools or directives directed at identifiable political opponents, lawyers, or former officials.", trumpEvidence: ["krebs-taylor-presidential-retaliatory-investigations", "law-firm-retaliation-orders-court-defeat", "comey-james-prosecutions-unlawful-prosecutor"], scores: { orban: 3, putin: 3, mussolini: 2, hitler: 2, mao: 2, stalin: 3, kim: 3 } },
    ],
  },
  {
    id: "elections", label: "Elections & democratic continuity", items: [
      { id: "administration", label: "Election administration pressure", description: "Federal leverage, data demands, or executive direction affecting state election administration.", trumpEvidence: ["election-integrity-narrative-and-executive-control-2025-2026", "ice-polling-place-threat-conflicting-statements-2026"], scores: { orban: 3, putin: 2, mussolini: 2, hitler: 1, mao: 0, stalin: 0, kim: 0 } },
      { id: "legitimacy", label: "Election legitimacy narratives", description: "Claims or acts that preemptively weaken confidence in lawful results or political competition.", trumpEvidence: ["election-integrity-narrative-and-executive-control-2025-2026", "january-6-mass-clemency-political-violence"], scores: { orban: 3, putin: 2, mussolini: 2, hitler: 2, mao: 1, stalin: 1, kim: 1 } },
    ],
  },
  {
    id: "institutions", label: "Executive control & institutions", items: [
      { id: "personnel", label: "Civil-service capture", description: "Loyalty-sensitive control of professional personnel, removals, or policy-facing posts.", trumpEvidence: ["project-2025-schedule-policy-career-implementation", "mass-inspector-general-firings-unlawful", "senior-military-jag-leadership-removals"], scores: { orban: 4, putin: 3, mussolini: 2, hitler: 2, mao: 3, stalin: 3, kim: 4 } },
      { id: "independence", label: "Independent-agency control", description: "Direct executive supervision of bodies designed to retain statutory or professional independence.", trumpEvidence: ["presidential-control-independent-agencies-2025", "eric-adams-case-dismissal-immigration-cooperation"], scores: { orban: 3, putin: 3, mussolini: 2, hitler: 2, mao: 2, stalin: 3, kim: 4 } },
      { id: "courts", label: "Judicial pressure", description: "Threats or political pressure directed at judges after adverse rulings.", trumpEvidence: ["judicial-impeachment-pressure-adverse-rulings"], scores: { orban: 2, putin: 2, mussolini: 2, hitler: 2, mao: 1, stalin: 2, kim: 3 } },
    ],
  },
  {
    id: "knowledge", label: "Press, knowledge & civil society", items: [
      { id: "media", label: "Media control & access", description: "Use of access, funding, licensing, or public-media authority to pressure independent reporting.", trumpEvidence: ["associated-press-access-viewpoint-retaliation", "voice-of-america-usagm-shutdown-court-order", "npr-pbs-viewpoint-funding-order-blocked", "broadcast-license-threats-election-speech"], scores: { orban: 4, putin: 3, mussolini: 3, hitler: 2, mao: 4, stalin: 4, kim: 4 } },
      { id: "civil-society", label: "Universities, counsel & civil society", description: "Funding, immigration, or regulatory pressure that can narrow institutional dissent.", trumpEvidence: ["harvard-funding-freeze-academic-coercion", "student-protester-deportation-speech-campaign", "law-firm-retaliation-orders-court-defeat"], scores: { orban: 3, putin: 2, mussolini: 2, hitler: 1, mao: 3, stalin: 3, kim: 3 } },
    ],
  },
  {
    id: "coercion", label: "Immigration, detention & coercive capacity", items: [
      { id: "enforcement", label: "Militarized immigration enforcement", description: "National enforcement capacity, local deputization, detention growth, and accountability limits.", trumpEvidence: ["ice-expansion-nationwide-coercive-capacity", "immigration-detention-expansion-oversight-failures", "homan-more-bloodshed-shut-their-mouth-ice-critics"], scores: { orban: 2, putin: 2, mussolini: 2, hitler: 1, mao: 2, stalin: 3, kim: 3 } },
      { id: "exception", label: "Exceptional detention or removal", description: "Wartime or exceptional categories used to accelerate removal or narrow ordinary process.", trumpEvidence: ["alien-enemies-act-cecot-summary-removal", "doj-denaturalization-maximal-priority"], scores: { orban: 2, putin: 2, mussolini: 2, hitler: 2, mao: 3, stalin: 4, kim: 3 } },
      { id: "military", label: "Domestic military deployment", description: "Federal military force deployed around protest or immigration-enforcement functions.", trumpEvidence: ["los-angeles-national-guard-domestic-military-deployment"], scores: { orban: 2, putin: 2, mussolini: 3, hitler: 2, mao: 3, stalin: 2, kim: 2 } },
    ],
  },
  {
    id: "belonging", label: "Race, identity & national destiny", items: [
      { id: "race", label: "Racialized national belonging", description: "Blood, genes, selective welcome, or white-nationalist frames shaping civic membership.", trumpEvidence: ["poisoning-blood-bad-genes-racialized-belonging", "afrikaner-refugee-priority-racial-asymmetry", "stephen-miller-white-nationalist-source-traffic-current-power"], scores: { orban: 2, putin: 1, mussolini: 3, hitler: 4, mao: 1, stalin: 1, kim: 1 } },
      { id: "religion", label: "Sacred national identity", description: "Christian-nationalist political legitimation and moral sorting of the polity.", trumpEvidence: ["official-christian-nationalist-legitimation-2025-2026"], scores: { orban: 3, putin: 2, mussolini: 3, hitler: 1, mao: 2, stalin: 1, kim: 4 } },
      { id: "territory", label: "Territorial revisionism", description: "Claims or pressure suggesting that strategic necessity permits acquisition or rule over other places.", trumpEvidence: ["canada-greenland-venezuela-cuba-expansionism"], scores: { orban: 2, putin: 3, mussolini: 3, hitler: 3, mao: 3, stalin: 3, kim: 3 } },
    ],
  },
];

export function leaderScore(leaderId: HistoricalLeader["id"]) {
  const scores = playbookGroups.flatMap((group) => group.items.map((item) => item.scores[leaderId]));
  return Math.round((scores.reduce<number>((total, score) => total + score, 0) / (scores.length * 4)) * 100);
}

export function scoreLabel(score: number) {
  return ["None", "Low", "Limited", "Material", "Strong"][score];
}
