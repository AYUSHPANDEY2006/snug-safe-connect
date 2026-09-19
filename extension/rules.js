// Micro-linguistic rule set. Each rule matches phrasing patterns common in
// consumer contracts and maps them to a plain-English explanation.
const RULES = [
  {
    id: "arbitration",
    tier: "red",
    weight: 22,
    title: "Forced binding arbitration",
    plain:
      "You give up your right to sue in court. Disputes go to a private arbitrator, usually chosen under rules that favour the company.",
    patterns: [
      /binding arbitration/i,
      /agree to arbitrat/i,
      /resolved (?:by|through) arbitration/i,
      /waive .{0,40}(?:right to a )?(?:jury )?trial/i,
    ],
  },
  {
    id: "class-action",
    tier: "red",
    weight: 20,
    title: "Class-action waiver",
    plain:
      "You cannot join other customers in a group lawsuit. Small harms done to thousands of people can never be challenged together.",
    patterns: [
      /class action waiver/i,
      /waive .{0,40}class action/i,
      /(?:not|no).{0,30}class(?:-| )(?:action|wide) basis/i,
      /only on an individual basis/i,
    ],
  },
  {
    id: "data-selling",
    tier: "red",
    weight: 18,
    title: "Broad data selling / monetisation",
    plain:
      "Your personal data can be sold, licensed or shared with partners and advertisers, often without a further notice to you.",
    patterns: [
      /sell .{0,40}(?:personal )?(?:data|information)/i,
      /share .{0,50}(?:with|to) .{0,30}(?:third[- ]part(?:y|ies)|advertis|partners)/i,
      /monetiz(?:e|ation) .{0,30}data/i,
      /for (?:targeted )?advertising purposes/i,
    ],
  },
  {
    id: "unilateral-change",
    tier: "red",
    weight: 16,
    title: "Unilateral changes without notice",
    plain:
      "The company can rewrite this contract at any time. Continuing to use the service counts as you agreeing to the new terms.",
    patterns: [
      /modify these terms at any time/i,
      /change .{0,30}terms .{0,30}(?:at any time|without (?:prior )?notice)/i,
      /(?:sole|absolute) discretion .{0,40}(?:amend|modify|revise)/i,
      /continued use .{0,50}constitutes acceptance/i,
    ],
  },
  {
    id: "auto-renewal",
    tier: "yellow",
    weight: 12,
    title: "Auto-renewal with a strict notice window",
    plain:
      "Your subscription renews and bills automatically. Cancelling late, or by the wrong method, means paying for another full term.",
    patterns: [
      /automatically renew/i,
      /auto[- ]renew/i,
      /renew(?:s|ed)? for (?:successive|additional) (?:terms|periods)/i,
      /written notice .{0,40}(?:\d{1,3}) days .{0,30}(?:prior|before)/i,
    ],
  },
  {
    id: "ip-grant",
    tier: "yellow",
    weight: 10,
    title: "Intellectual property grant-back",
    plain:
      "Anything you upload can be reused, edited and redistributed by the company worldwide, for free, often forever.",
    patterns: [
      /(?:perpetual|irrevocable|worldwide|royalty[- ]free).{0,60}licen[cs]e/i,
      /grant (?:us|the company) .{0,60}licen[cs]e/i,
      /sublicensable/i,
    ],
  },
  {
    id: "liability",
    tier: "yellow",
    weight: 9,
    title: "Liability waiver for service failures",
    plain:
      "If the service breaks, loses your data or costs you money, the company's payout is capped — often at a few dollars or nothing.",
    patterns: [
      /limitation of liability/i,
      /(?:shall )?not be liable for any .{0,60}damages/i,
      /as is.{0,30}without warrant/i,
      /liability .{0,40}(?:shall not exceed|limited to)/i,
    ],
  },
  {
    id: "fees",
    tier: "yellow",
    weight: 9,
    title: "Extra fees and penalties",
    plain:
      "Late fees, restocking charges or price rises can be applied to your account with little warning.",
    patterns: [
      /late fee/i,
      /cancellation fee/i,
      /restocking fee/i,
      /price(?:s)? (?:may|can) (?:be )?(?:increase|change)/i,
    ],
  },
  {
    id: "opt-out",
    tier: "green",
    weight: -12,
    title: "Explicit arbitration opt-out window",
    plain:
      "Good news: you may reject the arbitration clause in writing, usually within 30 days of signing up.",
    patterns: [
      /opt[- ]out of .{0,40}arbitration/i,
      /may reject .{0,40}arbitration/i,
      /within (?:30|thirty) days .{0,40}opt[- ]out/i,
    ],
  },
  {
    id: "easy-cancel",
    tier: "green",
    weight: -10,
    title: "Easy one-click cancellation",
    plain:
      "Good news: you can cancel online at any time without calling, emailing or posting a letter.",
    patterns: [
      /cancel at any time/i,
      /cancel (?:online|in your account settings)/i,
      /no cancellation fee/i,
    ],
  },
  {
    id: "no-sharing",
    tier: "green",
    weight: -10,
    title: "No third-party data sharing",
    plain:
      "Good news: the document promises your personal data is not sold or handed to third parties.",
    patterns: [
      /(?:do|does) not sell your (?:personal )?(?:data|information)/i,
      /never share .{0,40}third part/i,
      /we do not share your (?:personal )?(?:data|information)/i,
    ],
  },
];

// Hardcoded stage-demo dataset: guarantees a clean live demo if the active tab
// cannot be scanned (chrome:// pages, PDF viewers, offline machine).
const DEMO_RESULT = {
  source: "Demo sample — StreamPlus Terms of Service",
  score: 84,
  clauses: [
    {
      tier: "red",
      title: "Forced binding arbitration",
      plain:
        "You give up your right to sue in court. Disputes go to a private arbitrator chosen under the company's rules.",
      quote:
        "Any dispute arising out of these Terms shall be resolved exclusively by final and binding arbitration administered in Santa Clara County.",
    },
    {
      tier: "red",
      title: "Class-action waiver",
      plain:
        "You cannot join other customers in a group lawsuit, even if thousands were charged the same way.",
      quote:
        "You agree that claims may be brought only on an individual basis and not as a plaintiff or class member in any purported class action.",
    },
    {
      tier: "red",
      title: "Broad data selling / monetisation",
      plain:
        "Your viewing history and device data can be sold on to advertising partners.",
      quote:
        "We may share or sell viewing data and device identifiers with our advertising partners for targeted advertising purposes.",
    },
    {
      tier: "yellow",
      title: "Auto-renewal with a strict notice window",
      plain:
        "The plan renews on its own and you must send written notice 45 days ahead to stop it.",
      quote:
        "Your membership will automatically renew for successive 12-month terms unless written notice is received 45 days prior to the renewal date.",
    },
    {
      tier: "yellow",
      title: "Liability waiver for service failures",
      plain:
        "Outages, lost downloads or billing errors are capped at one month of fees.",
      quote:
        "In no event shall our liability exceed the amount paid by you in the one month preceding the claim.",
    },
    {
      tier: "green",
      title: "Explicit arbitration opt-out window",
      plain:
        "You may reject the arbitration clause in writing within 30 days of signing up.",
      quote:
        "You may opt out of arbitration by sending written notice within 30 days of first accepting these Terms.",
    },
  ],
};
