import { Banknote, FileText, IndianRupee, Landmark, MapPin } from "lucide-react";

import type { Scheme } from "@/lib/schemes";

const KIND_STYLES: Record<Scheme["kind"], string> = {
  LOAN: "bg-accent/70 text-accent-foreground",
  SUBSIDY: "bg-accent text-accent-foreground",
  GUARANTEE: "bg-mint/70 text-foreground",
  GRANT: "bg-mint text-foreground",
};

export function SchemeCard({ scheme, index }: { scheme: Scheme; index: number }) {
  return (
    <article
      className="setu-rise rounded-3xl border border-border/70 bg-card/80 p-6 shadow-[0_1px_2px_rgba(60,44,25,0.04),0_12px_28px_-18px_rgba(60,44,25,0.35)] backdrop-blur-sm"
      style={{ animationDelay: `${index * 90}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg leading-snug font-semibold text-foreground">{scheme.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{scheme.nameHi}</p>
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold tracking-wider ${KIND_STYLES[scheme.kind]}`}
        >
          {scheme.kind}
        </span>
      </div>

      <p className="mt-4 text-[15px] leading-relaxed text-foreground/80">{scheme.summary}</p>

      <ul className="mt-4 space-y-3 text-[15px]">
        <li className="flex gap-2.5">
          <IndianRupee className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
          <span className="text-foreground/90">{scheme.amount}</span>
        </li>
        <li className="flex gap-2.5">
          <Landmark className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
          <span className="text-foreground/90">{scheme.collateral}</span>
        </li>
        <li className="flex gap-2.5">
          <FileText className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
          <span className="text-muted-foreground">{scheme.documents.join(" · ")}</span>
        </li>
        <li className="flex gap-2.5">
          <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
          <span className="text-muted-foreground">{scheme.applyAt}</span>
        </li>
      </ul>

      <p className="mt-5 flex items-center gap-2 text-xs text-muted-foreground/80">
        <Banknote className="size-3.5" aria-hidden />
        Confirm the final terms with the bank or agency before applying.
      </p>
    </article>
  );
}