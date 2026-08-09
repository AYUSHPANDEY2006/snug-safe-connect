export function SetuHeader() {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-8">
      <div className="flex items-center gap-3">
        <span
          className="grid size-11 place-items-center rounded-full bg-primary text-lg text-primary-foreground"
          aria-hidden
        >
          स
        </span>
        <div>
          <p className="font-display text-xl leading-none font-semibold text-foreground">Setu</p>
          <p className="mt-1 text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
            सेतु · Loans &amp; schemes, by voice
          </p>
        </div>
      </div>
      <p className="hidden text-sm text-muted-foreground sm:block">Hindi · English · both together</p>
    </header>
  );
}