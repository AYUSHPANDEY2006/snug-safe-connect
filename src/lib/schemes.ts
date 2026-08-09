export type SchemeKind = "LOAN" | "SUBSIDY" | "GUARANTEE" | "GRANT";

export type Scheme = {
  id: string;
  name: string;
  nameHi: string;
  kind: SchemeKind;
  summary: string;
  amount: string;
  min: number;
  max: number;
  collateral: string;
  documents: string[];
  applyAt: string;
  tags: string[];
};

const L = 100000;
const CR = 10000000;

export const SCHEMES: Scheme[] = [
  {
    id: "mudra-shishu",
    name: "PM Mudra Yojana — Shishu",
    nameHi: "प्रधानमंत्री मुद्रा योजना — शिशु",
    kind: "LOAN",
    summary:
      "Entry tier for very small or new businesses. Up to 50 thousand with no collateral and light paperwork.",
    amount: "Up to ₹50,000 · 8%–12% p.a.",
    min: 0,
    max: 50000,
    collateral: "No collateral required",
    documents: ["Aadhaar", "PAN", "Business address proof", "2 photographs", "Quotation of goods to be purchased"],
    applyAt: "Any bank branch, MFI, or udyamimitra.in; a CSC centre can fill the form for you",
    tags: ["new", "micro", "retail", "services", "women", "vendor"],
  },
  {
    id: "mudra-kishore",
    name: "PM Mudra Yojana — Kishore",
    nameHi: "प्रधानमंत्री मुद्रा योजना — किशोर",
    kind: "LOAN",
    summary:
      "The most common tier for buying machines or scaling up. Covers 50 thousand to 5 lakh with no collateral.",
    amount: "₹50,000 – ₹5 lakh · 9%–14% p.a.",
    min: 50000,
    max: 5 * L,
    collateral: "No collateral required",
    documents: [
      "Aadhaar",
      "PAN",
      "6-month bank statement",
      "Udyam registration",
      "Machine/stock quotation",
      "Business proof",
    ],
    applyAt: "Bank branch or udyamimitra.in; CSC centre can help fill the form",
    tags: ["machine", "retail", "manufacturing", "services", "women", "existing", "food"],
  },
  {
    id: "mudra-tarun",
    name: "PM Mudra Yojana — Tarun",
    nameHi: "प्रधानमंत्री मुद्रा योजना — तरुण",
    kind: "LOAN",
    summary: "Top Mudra tier, 5 to 10 lakh, for businesses with books and turnover history.",
    amount: "₹5 lakh – ₹10 lakh · 10%–15% p.a.",
    min: 5 * L,
    max: 10 * L,
    collateral: "No collateral (CGTMSE cover may apply)",
    documents: [
      "Aadhaar",
      "PAN",
      "GST returns",
      "ITR (2 years)",
      "12-month bank statement",
      "Udyam registration",
      "Project report",
    ],
    applyAt: "Bank branch (SME desk) or udyamimitra.in",
    tags: ["machine", "manufacturing", "existing", "retail", "food"],
  },
  {
    id: "pmegp",
    name: "PMEGP — Prime Minister's Employment Generation Programme",
    nameHi: "पीएमईजीपी — प्रधानमंत्री रोजगार सृजन कार्यक्रम",
    kind: "SUBSIDY",
    summary:
      "For setting up a brand new unit. Government pays 15%–35% of the project cost as margin money subsidy.",
    amount: "Project up to ₹50 lakh (manufacturing) / ₹20 lakh (service) · 15%–35% subsidy",
    min: 50000,
    max: 50 * L,
    collateral: "No collateral up to ₹10 lakh (CGTMSE covered)",
    documents: [
      "Aadhaar",
      "PAN",
      "Project report",
      "Caste/special category certificate (if claiming higher subsidy)",
      "Education certificate (for projects above ₹10/₹5 lakh)",
      "Population certificate (rural)",
    ],
    applyAt: "kviconline.gov.in/pmegpeportal — through KVIC, KVIB or DIC",
    tags: ["new", "manufacturing", "food", "women", "rural", "sc-st"],
  },
  {
    id: "standup",
    name: "Stand-Up India",
    nameHi: "स्टैंड-अप इंडिया",
    kind: "LOAN",
    summary:
      "Greenfield loans reserved for women and SC/ST entrepreneurs starting a new manufacturing, service or trading unit.",
    amount: "₹10 lakh – ₹1 crore · Base rate + 3% (approx 9%–13% p.a.)",
    min: 10 * L,
    max: 1 * CR,
    collateral: "Primary security; CGFSIL guarantee cover instead of third-party collateral",
    documents: [
      "Aadhaar",
      "PAN",
      "Caste certificate (SC/ST applicants)",
      "Project report",
      "Proof of first-time entrepreneur",
      "Udyam registration",
    ],
    applyAt: "standupmitra.in or any scheduled commercial bank branch",
    tags: ["women", "sc-st", "new", "manufacturing", "retail", "services"],
  },
  {
    id: "cgtmse",
    name: "CGTMSE Credit Guarantee",
    nameHi: "सीजीटीएमएसई ऋण गारंटी",
    kind: "GUARANTEE",
    summary:
      "Not a loan by itself — it guarantees your bank loan so the bank cannot demand collateral or a guarantor.",
    amount: "Cover up to ₹5 crore · 75%–85% of the loan guaranteed",
    min: 0,
    max: 5 * CR,
    collateral: "Removes the collateral requirement",
    documents: ["Udyam registration", "Bank loan application", "Project report", "KYC of promoters"],
    applyAt: "Ask your bank to route the sanction under CGTMSE — you do not apply directly",
    tags: ["collateral", "existing", "new", "manufacturing", "services", "machine"],
  },
  {
    id: "svanidhi",
    name: "PM SVANidhi",
    nameHi: "पीएम स्वनिधि",
    kind: "LOAN",
    summary:
      "Working capital for street vendors and thela/rehri sellers. Repay on time and the next loan gets bigger.",
    amount: "₹10,000 → ₹20,000 → ₹50,000 · 7% interest subsidy + cashback on digital payments",
    min: 0,
    max: 50000,
    collateral: "No collateral required",
    documents: ["Aadhaar", "Vending certificate / ID card from ULB", "Bank account details"],
    applyAt: "pmsvanidhi.mohua.gov.in, ULB office or a CSC centre",
    tags: ["vendor", "micro", "retail", "women", "urban"],
  },
  {
    id: "clcss",
    name: "Credit Linked Capital Subsidy Scheme (CLCSS)",
    nameHi: "सीएलसीएसएस — तकनीकी उन्नयन सब्सिडी",
    kind: "SUBSIDY",
    summary: "Buys down 15% of the cost of new machines when you are upgrading your production technology.",
    amount: "₹1 lakh – ₹1 crore · 15% capital subsidy on eligible plant & machinery (cap ₹15 lakh)",
    min: 1 * L,
    max: 1 * CR,
    collateral: "As per lending bank",
    documents: [
      "Udyam registration",
      "Machinery invoice/quotation",
      "Bank sanction letter",
      "Technology justification",
    ],
    applyAt: "Through your lending bank, routed to the nodal agency (SIDBI/NABARD)",
    tags: ["machine", "manufacturing", "existing", "food"],
  },
  {
    id: "sidbi-wc",
    name: "SIDBI Working Capital / Loan Against Machinery",
    nameHi: "सिडबी कार्यशील पूंजी ऋण",
    kind: "LOAN",
    summary: "For established MSMEs needing larger working capital or machinery finance.",
    amount: "₹10 lakh – ₹3 crore · 9.5%–13% p.a.",
    min: 10 * L,
    max: 3 * CR,
    collateral: "Machinery hypothecation; partial collateral may be asked",
    documents: [
      "Audited financials (2 yrs)",
      "ITR",
      "GST returns",
      "Udyam registration",
      "Machinery details",
    ],
    applyAt: "sidbi.in or SIDBI branch",
    tags: ["machine", "manufacturing", "working-capital", "existing"],
  },
  {
    id: "pmfme",
    name: "PM FME — Micro Food Processing Enterprises",
    nameHi: "पीएम एफएमई — सूक्ष्म खाद्य उद्यम योजना",
    kind: "SUBSIDY",
    summary:
      "35% credit-linked subsidy for masala, achaar, bakery, dairy and other small food processing units.",
    amount: "35% of project cost, up to ₹10 lakh subsidy · plus ₹40,000 seed capital for SHG members",
    min: 50000,
    max: 30 * L,
    collateral: "As per lending bank; CGTMSE cover available",
    documents: [
      "Aadhaar",
      "PAN",
      "Detailed project report",
      "Udyam registration",
      "FSSAI registration (or undertaking)",
      "Land/rent proof",
    ],
    applyAt: "pmfme.mofpi.gov.in with support from the District Resource Person",
    tags: ["food", "manufacturing", "new", "rural", "women"],
  },
  {
    id: "mahila-udyam",
    name: "Udyogini / Mahila Udyam Nidhi",
    nameHi: "उद्योगिनी / महिला उद्यम निधि",
    kind: "LOAN",
    summary:
      "Women-only soft loans for small trade, service and manufacturing units, often with interest concession.",
    amount: "Up to ₹10 lakh · concessional rate, subsidy up to 30% in some states",
    min: 0,
    max: 10 * L,
    collateral: "Usually no collateral up to ₹5 lakh",
    documents: ["Aadhaar", "Income certificate", "Caste certificate (if applicable)", "Project report", "Bank account"],
    applyAt: "State women development corporation, SIDBI or a nationalised bank branch",
    tags: ["women", "new", "retail", "services", "micro"],
  },
  {
    id: "weaver-mudra",
    name: "Weaver MUDRA / Handicraft Artisan Credit",
    nameHi: "बुनकर मुद्रा / हस्तशिल्प ऋण",
    kind: "LOAN",
    summary: "Margin money and concessional credit for handloom weavers, tailors and craft artisans.",
    amount: "Up to ₹5 lakh · 6% effective interest with margin money assistance",
    min: 0,
    max: 5 * L,
    collateral: "No collateral up to ₹2 lakh",
    documents: ["Aadhaar", "Weaver/Artisan ID card", "Bank account", "Quotation for loom/machine"],
    applyAt: "handloom.gov.in or the district handloom/handicraft office",
    tags: ["artisan", "tailoring", "machine", "rural", "women"],
  },
];

export type Parsed = {
  amount: number | null;
  tags: string[];
  hasHindi: boolean;
};

const KEYWORDS: Record<string, string[]> = {
  women: ["woman", "women", "mahila", "female", "lady", "ladies", "aurat", "behen"],
  "sc-st": ["sc/st", "dalit", "scheduled caste", "scheduled tribe", "adivasi"],
  vendor: ["street", "vendor", "thela", "rehri", "hawker", "footpath", "khomcha", "stall"],
  food: ["masala", "achaar", "pickle", "bakery", "food", "dairy", "papad", "namkeen", "sweets", "mithai", "khana", "atta", "flour"],
  tailoring: ["tailor", "tailoring", "silai", "darzi", "stitch", "boutique", "kapda"],
  artisan: ["artisan", "handicraft", "weaver", "bunkar", "handloom", "craft", "pottery", "silai"],
  retail: ["kirana", "shop", "store", "dukan", "dukaan", "retail", "grocery", "general store", "stock", "trading"],
  manufacturing: ["factory", "unit", "manufactur", "production", "packing", "workshop", "karkhana", "udyog"],
  services: ["salon", "parlour", "repair", "service", "tiffin", "catering", "transport", "auto", "taxi", "coaching"],
  machine: ["machine", "machin", "equipment", "loom", "oven", "mashin", "upgrade", "plant"],
  new: ["new", "start", "naya", "nayi", "shuru", "open", "begin", "startup", "kholna"],
  existing: ["existing", "running", "chal raha", "purana", "already", "since"],
  "working-capital": ["working capital", "stock", "raw material", "maal", "inventory", "cash flow", "udhaar"],
  collateral: ["collateral", "guarantee", "guarantor", "security", "gaarantee", "bina property"],
  rural: ["village", "gaon", "rural", "gram"],
  urban: ["city", "shahar", "urban"],
  micro: ["small", "chhota", "chota", "tiny", "micro"],
};

export function parseQuery(input: string): Parsed {
  const text = input.toLowerCase();
  const tags: string[] = [];
  for (const [tag, words] of Object.entries(KEYWORDS)) {
    if (words.some((w) => text.includes(w))) tags.push(tag);
  }
  return { amount: parseAmount(text), tags, hasHindi: /[\u0900-\u097F]/.test(input) };
}

export function parseAmount(text: string): number | null {
  const m = text.match(/(\d+(?:[.,]\d+)?)\s*(crore|cr|lakh|lac|lakhs|lakhon|hazaar|hazar|thousand|k)?/g);
  if (!m) return null;
  for (const chunk of m) {
    const num = parseFloat(chunk.replace(/[^\d.]/g, ""));
    if (!Number.isFinite(num) || num === 0) continue;
    if (/crore|cr\b/.test(chunk)) return num * CR;
    if (/lakh|lac/.test(chunk)) return num * L;
    if (/hazaar|hazar|thousand|\bk\b/.test(chunk)) return num * 1000;
    if (num >= 1000) return num;
  }
  return null;
}

const GATED: Record<string, string[]> = {
  standup: ["women", "sc-st"],
  "mahila-udyam": ["women"],
  "weaver-mudra": ["artisan", "tailoring"],
  svanidhi: ["vendor"],
  pmfme: ["food"],
};

export function matchSchemes(input: string, limit = 4): Scheme[] {
  const { amount, tags } = parseQuery(input);
  const scored = SCHEMES.map((scheme) => {
    let score = 0;
    const gate = GATED[scheme.id];
    if (gate && !gate.some((tag) => tags.includes(tag))) return { scheme, score: 0 };
    for (const tag of tags) if (scheme.tags.includes(tag)) score += 3;
    if (amount != null) {
      if (amount >= scheme.min && amount <= scheme.max) {
        score += 8;
        // Prefer schemes sized for the amount over very broad umbrella schemes.
        if (scheme.max <= amount * 6) score += 4;
      }
      else if (amount < scheme.min) score -= 2;
      else score -= 1;
    }
    if (tags.includes("women") && scheme.tags.includes("women")) score += 2;
    if (tags.includes("vendor") && scheme.id === "svanidhi") score += 4;
    if (tags.includes("food") && scheme.id === "pmfme") score += 3;
    if (tags.includes("new") && !tags.includes("machine") && scheme.id === "pmegp") score += 3;
    if (tags.includes("machine") && scheme.tags.includes("machine")) score += 2;
    return { scheme, score };
  })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  const picked = scored.slice(0, limit).map((s) => s.scheme);
  if (picked.length === 0) {
    return [
      SCHEMES.find((s) => s.id === "mudra-kishore")!,
      SCHEMES.find((s) => s.id === "pmegp")!,
      SCHEMES.find((s) => s.id === "cgtmse")!,
      SCHEMES.find((s) => s.id === "svanidhi")!,
    ];
  }
  return picked;
}

export function formatAmount(value: number): string {
  if (value >= CR) return `${+(value / CR).toFixed(2)} crore`;
  if (value >= L) return `${+(value / L).toFixed(2)} lakh`;
  if (value >= 1000) return `${+(value / 1000).toFixed(0)} hazaar`;
  return String(value);
}

export function buildReply(input: string, schemes: Scheme[]): string {
  const { amount, tags } = parseQuery(input);
  const bits: string[] = ["Namaste!"];

  if (tags.includes("vendor")) bits.push("Aap street vending karte hain,");
  else if (tags.includes("food")) bits.push("Aapka food processing ka kaam hai,");
  else if (tags.includes("tailoring")) bits.push("Aapka silai/tailoring ka kaam hai,");
  else if (tags.includes("retail")) bits.push("Aapki dukaan chal rahi hai,");
  else if (tags.includes("manufacturing")) bits.push("Aapka manufacturing unit hai,");

  if (amount != null) bits.push(`aapko ${formatAmount(amount)} rupaye chahiye.`);
  else bits.push("aapke kaam ke hisaab se maine schemes dekhi hain.");

  if (tags.includes("women")) bits.push("Mahila entrepreneurs ke liye alag benefits milte hain.");
  if (tags.includes("machine")) bits.push("Machine kharidne par subsidy bhi mil sakti hai.");
  if (tags.includes("new") && !tags.includes("machine"))
    bits.push("Naya kaam shuru karne par subsidy wali scheme better rehti hai.");

  bits.push(
    `Maine ${schemes.length} scheme nikali hain — sabse upar ${schemes[0]?.name ?? "Mudra"} hai. Kya aapki business Udyam registered hai?`,
  );
  return bits.join(" ");
}