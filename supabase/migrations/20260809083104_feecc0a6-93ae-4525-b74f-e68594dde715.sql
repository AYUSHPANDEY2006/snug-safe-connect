CREATE TABLE public.schemes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_hi TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('LOAN','SUBSIDY','GUARANTEE','GRANT')),
  summary TEXT NOT NULL,
  amount TEXT NOT NULL,
  min_amount BIGINT NOT NULL DEFAULT 0,
  max_amount BIGINT NOT NULL DEFAULT 0,
  collateral TEXT NOT NULL DEFAULT '',
  documents TEXT[] NOT NULL DEFAULT '{}',
  apply_at TEXT NOT NULL DEFAULT '',
  tags TEXT[] NOT NULL DEFAULT '{}',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.schemes TO anon;
GRANT SELECT ON public.schemes TO authenticated;
GRANT ALL ON public.schemes TO service_role;
ALTER TABLE public.schemes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Schemes are publicly readable" ON public.schemes FOR SELECT USING (true);

CREATE TABLE public.scheme_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_text TEXT NOT NULL,
  detected_tags TEXT[] NOT NULL DEFAULT '{}',
  detected_amount BIGINT,
  matched_scheme_ids TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT ALL ON public.scheme_queries TO service_role;
ALTER TABLE public.scheme_queries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "No direct access to scheme queries" ON public.scheme_queries FOR SELECT USING (false);
CREATE INDEX scheme_queries_created_at_idx ON public.scheme_queries (created_at DESC);

INSERT INTO public.schemes (id, name, name_hi, kind, summary, amount, min_amount, max_amount, collateral, documents, apply_at, tags, sort_order) VALUES
('mudra-shishu', 'PM Mudra Yojana — Shishu', 'प्रधानमंत्री मुद्रा योजना — शिशु', 'LOAN', 'Entry tier for very small or new businesses. Up to 50 thousand with no collateral and light paperwork.', 'Up to ₹50,000 · 8%–12% p.a.', 0, 50000, 'No collateral required', ARRAY['Aadhaar','PAN','Business address proof','2 photographs','Quotation of goods to be purchased']::text[], 'Any bank branch, MFI, or udyamimitra.in; a CSC centre can fill the form for you', ARRAY['new','micro','retail','services','women','vendor']::text[], 0),
('mudra-kishore', 'PM Mudra Yojana — Kishore', 'प्रधानमंत्री मुद्रा योजना — किशोर', 'LOAN', 'The most common tier for buying machines or scaling up. Covers 50 thousand to 5 lakh with no collateral.', '₹50,000 – ₹5 lakh · 9%–14% p.a.', 50000, 500000, 'No collateral required', ARRAY['Aadhaar','PAN','6-month bank statement','Udyam registration','Machine/stock quotation','Business proof']::text[], 'Bank branch or udyamimitra.in; CSC centre can help fill the form', ARRAY['machine','retail','manufacturing','services','women','existing','food']::text[], 1),
('mudra-tarun', 'PM Mudra Yojana — Tarun', 'प्रधानमंत्री मुद्रा योजना — तरुण', 'LOAN', 'Top Mudra tier, 5 to 10 lakh, for businesses with books and turnover history.', '₹5 lakh – ₹10 lakh · 10%–15% p.a.', 500000, 1000000, 'No collateral (CGTMSE cover may apply)', ARRAY['Aadhaar','PAN','GST returns','ITR (2 years)','12-month bank statement','Udyam registration','Project report']::text[], 'Bank branch (SME desk) or udyamimitra.in', ARRAY['machine','manufacturing','existing','retail','food']::text[], 2),
('pmegp', 'PMEGP — Prime Minister''s Employment Generation Programme', 'पीएमईजीपी — प्रधानमंत्री रोजगार सृजन कार्यक्रम', 'SUBSIDY', 'For setting up a brand new unit. Government pays 15%–35% of the project cost as margin money subsidy.', 'Project up to ₹50 lakh (manufacturing) / ₹20 lakh (service) · 15%–35% subsidy', 50000, 5000000, 'No collateral up to ₹10 lakh (CGTMSE covered)', ARRAY['Aadhaar','PAN','Project report','Caste/special category certificate (if claiming higher subsidy)','Education certificate (for projects above ₹10/₹5 lakh)','Population certificate (rural)']::text[], 'kviconline.gov.in/pmegpeportal — through KVIC, KVIB or DIC', ARRAY['new','manufacturing','food','women','rural','sc-st']::text[], 3),
('standup', 'Stand-Up India', 'स्टैंड-अप इंडिया', 'LOAN', 'Greenfield loans reserved for women and SC/ST entrepreneurs starting a new manufacturing, service or trading unit.', '₹10 lakh – ₹1 crore · Base rate + 3% (approx 9%–13% p.a.)', 1000000, 10000000, 'Primary security; CGFSIL guarantee cover instead of third-party collateral', ARRAY['Aadhaar','PAN','Caste certificate (SC/ST applicants)','Project report','Proof of first-time entrepreneur','Udyam registration']::text[], 'standupmitra.in or any scheduled commercial bank branch', ARRAY['women','sc-st','new','manufacturing','retail','services']::text[], 4),
('cgtmse', 'CGTMSE Credit Guarantee', 'सीजीटीएमएसई ऋण गारंटी', 'GUARANTEE', 'Not a loan by itself — it guarantees your bank loan so the bank cannot demand collateral or a guarantor.', 'Cover up to ₹5 crore · 75%–85% of the loan guaranteed', 0, 50000000, 'Removes the collateral requirement', ARRAY['Udyam registration','Bank loan application','Project report','KYC of promoters']::text[], 'Ask your bank to route the sanction under CGTMSE — you do not apply directly', ARRAY['collateral','existing','new','manufacturing','services','machine']::text[], 5),
('svanidhi', 'PM SVANidhi', 'पीएम स्वनिधि', 'LOAN', 'Working capital for street vendors and thela/rehri sellers. Repay on time and the next loan gets bigger.', '₹10,000 → ₹20,000 → ₹50,000 · 7% interest subsidy + cashback on digital payments', 0, 50000, 'No collateral required', ARRAY['Aadhaar','Vending certificate / ID card from ULB','Bank account details']::text[], 'pmsvanidhi.mohua.gov.in, ULB office or a CSC centre', ARRAY['vendor','micro','retail','women','urban']::text[], 6),
('clcss', 'Credit Linked Capital Subsidy Scheme (CLCSS)', 'सीएलसीएसएस — तकनीकी उन्नयन सब्सिडी', 'SUBSIDY', 'Buys down 15% of the cost of new machines when you are upgrading your production technology.', '₹1 lakh – ₹1 crore · 15% capital subsidy on eligible plant & machinery (cap ₹15 lakh)', 100000, 10000000, 'As per lending bank', ARRAY['Udyam registration','Machinery invoice/quotation','Bank sanction letter','Technology justification']::text[], 'Through your lending bank, routed to the nodal agency (SIDBI/NABARD)', ARRAY['machine','manufacturing','existing','food']::text[], 7),
('sidbi-wc', 'SIDBI Working Capital / Loan Against Machinery', 'सिडबी कार्यशील पूंजी ऋण', 'LOAN', 'For established MSMEs needing larger working capital or machinery finance.', '₹10 lakh – ₹3 crore · 9.5%–13% p.a.', 1000000, 30000000, 'Machinery hypothecation; partial collateral may be asked', ARRAY['Audited financials (2 yrs)','ITR','GST returns','Udyam registration','Machinery details']::text[], 'sidbi.in or SIDBI branch', ARRAY['machine','manufacturing','working-capital','existing']::text[], 8),
('pmfme', 'PM FME — Micro Food Processing Enterprises', 'पीएम एफएमई — सूक्ष्म खाद्य उद्यम योजना', 'SUBSIDY', '35% credit-linked subsidy for masala, achaar, bakery, dairy and other small food processing units.', '35% of project cost, up to ₹10 lakh subsidy · plus ₹40,000 seed capital for SHG members', 50000, 3000000, 'As per lending bank; CGTMSE cover available', ARRAY['Aadhaar','PAN','Detailed project report','Udyam registration','FSSAI registration (or undertaking)','Land/rent proof']::text[], 'pmfme.mofpi.gov.in with support from the District Resource Person', ARRAY['food','manufacturing','new','rural','women']::text[], 9),
('mahila-udyam', 'Udyogini / Mahila Udyam Nidhi', 'उद्योगिनी / महिला उद्यम निधि', 'LOAN', 'Women-only soft loans for small trade, service and manufacturing units, often with interest concession.', 'Up to ₹10 lakh · concessional rate, subsidy up to 30% in some states', 0, 1000000, 'Usually no collateral up to ₹5 lakh', ARRAY['Aadhaar','Income certificate','Caste certificate (if applicable)','Project report','Bank account']::text[], 'State women development corporation, SIDBI or a nationalised bank branch', ARRAY['women','new','retail','services','micro']::text[], 10),
('weaver-mudra', 'Weaver MUDRA / Handicraft Artisan Credit', 'बुनकर मुद्रा / हस्तशिल्प ऋण', 'LOAN', 'Margin money and concessional credit for handloom weavers, tailors and craft artisans.', 'Up to ₹5 lakh · 6% effective interest with margin money assistance', 0, 500000, 'No collateral up to ₹2 lakh', ARRAY['Aadhaar','Weaver/Artisan ID card','Bank account','Quotation for loom/machine']::text[], 'handloom.gov.in or the district handloom/handicraft office', ARRAY['artisan','tailoring','machine','rural','women']::text[], 11)
ON CONFLICT (id) DO NOTHING;