const $ = (id) => document.getElementById(id);
const panes = ["idle", "loading", "results", "error"];
const show = (name) =>
  panes.forEach((p) => $(p).classList.toggle("hidden", p !== name));

let currentDraft = "";

/* ---------------- analysis ---------------- */

function sentencesAround(text, index) {
  const start = Math.max(0, text.lastIndexOf(".", index - 1) + 1);
  let end = text.indexOf(".", index + 40);
  if (end === -1) end = Math.min(text.length, index + 260);
  const quote = text.slice(start, end + 1).replace(/\s+/g, " ").trim();
  return quote.length > 300 ? quote.slice(0, 297) + "…" : quote;
}

function analyze(rawText, source) {
  const text = (rawText || "").replace(/\s+/g, " ");
  const clauses = [];
  let raw = 0;

  for (const rule of RULES) {
    let hit = null;
    for (const pattern of rule.patterns) {
      const m = pattern.exec(text);
      if (m) {
        hit = m;
        break;
      }
    }
    if (!hit) continue;
    raw += rule.weight;
    clauses.push({
      tier: rule.tier,
      title: rule.title,
      plain: rule.plain,
      quote: sentencesAround(text, hit.index),
    });
  }

  const order = { red: 0, yellow: 1, green: 2 };
  clauses.sort((a, b) => order[a.tier] - order[b.tier]);

  const score = Math.max(0, Math.min(100, Math.round(raw * 1.15)));
  return { source, score, clauses };
}

function verdictFor(score) {
  if (score >= 60) return { label: "High risk", tier: "red" };
  if (score >= 30) return { label: "Moderate risk", tier: "yellow" };
  return { label: "Consumer friendly", tier: "green" };
}

function summaryFor(result) {
  const reds = result.clauses.filter((c) => c.tier === "red").length;
  const yellows = result.clauses.filter((c) => c.tier === "yellow").length;
  if (!result.clauses.length)
    return "No known predatory patterns detected in the text on this page.";
  if (reds)
    return `${reds} critical trap${reds > 1 ? "s" : ""} and ${yellows} moderate concern${
      yellows === 1 ? "" : "s"
    } found. Read the red items before you agree.`;
  return `No critical traps, but ${yellows} moderate term${
    yellows === 1 ? "" : "s"
  } could cost you money later.`;
}

function buildDraft(result) {
  const items = result.clauses
    .filter((c) => c.tier !== "green")
    .map((c, i) => `${i + 1}. ${c.title} — ${c.plain}`)
    .join("\n");

  return `Subject: Written Notice of Opt-Out and Objection to Contract Terms

To Whom It May Concern,

I am a customer of your service and I am writing to give formal written notice regarding the terms published at:
${result.source}

Having reviewed the agreement, I object to and hereby opt out of the following provisions to the fullest extent permitted by law:

${items || "1. Any provision limiting my statutory consumer rights."}

Specifically, and within any applicable opt-out window:

- I reject any mandatory or binding arbitration provision and any waiver of my right to participate in a class or representative action. I retain my right to bring a claim in a court of competent jurisdiction, including small claims court.
- I withdraw consent to the sale, licensing or sharing of my personal information with third parties for advertising, profiling or monetisation purposes. Please treat this as a do-not-sell and do-not-share request.
- I direct that my subscription must not renew automatically. Please disable automatic renewal on my account and confirm that no further charges will be made without my express prior authorisation.

Please confirm in writing, within 30 days of the date of this notice, that this opt-out has been recorded against my account and that these provisions will not be enforced against me.

Account / registered email: [YOUR EMAIL]
Full name: [YOUR NAME]
Date: ${new Date().toLocaleDateString()}

Sincerely,
[YOUR NAME]`;
}

/* ---------------- rendering ---------------- */

function render(result) {
  const verdict = verdictFor(result.score);
  $("score").textContent = String(result.score);
  const badge = $("verdict");
  badge.textContent = verdict.label;
  badge.className = `badge ${verdict.tier}`;
  $("summary").textContent = summaryFor(result);

  const count = (t) => result.clauses.filter((c) => c.tier === t).length;
  $("c-red").textContent = count("red");
  $("c-yellow").textContent = count("yellow");
  $("c-green").textContent = count("green");

  const list = $("clauses");
  list.textContent = "";
  if (!result.clauses.length) {
    const p = document.createElement("p");
    p.className = "lede";
    p.textContent = "Nothing flagged. This page may not contain legal terms.";
    list.appendChild(p);
  }
  for (const c of result.clauses) {
    const el = document.createElement("div");
    el.className = `clause ${c.tier}`;
    const h = document.createElement("h3");
    h.textContent = c.title;
    const p = document.createElement("p");
    p.textContent = c.plain;
    el.append(h, p);
    if (c.quote) {
      const q = document.createElement("div");
      q.className = "quote";
      q.textContent = `“${c.quote}”`;
      el.appendChild(q);
    }
    list.appendChild(el);
  }

  currentDraft = buildDraft(result);
  $("draft").textContent = currentDraft;

  const copy = $("copy");
  copy.textContent = "Copy Opt-Out Draft";
  copy.classList.remove("done");

  show("results");
}

function fail(message) {
  $("error-msg").textContent = message;
  show("error");
}

/* ---------------- scanning ---------------- */

async function scan() {
  show("loading");
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id) throw new Error("No active tab.");
    if (/^(chrome|edge|about|chrome-extension):/i.test(tab.url || ""))
      throw new Error("Chrome blocks scanning on browser system pages. Open a website tab and try again.");

    const [injection] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => document.body ? document.body.innerText : "",
    });

    const text = injection && injection.result;
    if (!text || text.trim().length < 200)
      throw new Error("This page has too little text to analyse.");

    render(analyze(text, tab.url || "this page"));
  } catch (e) {
    fail(e && e.message ? e.message : "Could not read this page.");
  }
}

/* ---------------- wiring ---------------- */

$("scan").addEventListener("click", scan);
$("again").addEventListener("click", () => show("idle"));
$("demo").addEventListener("click", () => render(DEMO_RESULT));
$("fallback").addEventListener("click", () => render(DEMO_RESULT));

$("copy").addEventListener("click", async () => {
  const btn = $("copy");
  try {
    await navigator.clipboard.writeText(currentDraft);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = currentDraft;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
  }
  btn.textContent = "Copied to clipboard";
  btn.classList.add("done");
  setTimeout(() => {
    btn.textContent = "Copy Opt-Out Draft";
    btn.classList.remove("done");
  }, 2000);
});
