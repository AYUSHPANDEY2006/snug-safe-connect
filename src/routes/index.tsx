import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Keyboard, Mic, Send, Square, Volume2 } from "lucide-react";
import { useCallback, useRef, useState } from "react";

import { SchemeCard } from "@/components/setu/SchemeCard";
import { SetuHeader } from "@/components/setu/SetuHeader";
import { buildReply, matchSchemes, type Scheme } from "@/lib/schemes";
import { matchSchemesForQuery } from "@/lib/schemes.functions";
import { useSpeech } from "@/lib/useSpeech";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Setu — Voice Help for MSME Loans & Govt Schemes" },
      {
        name: "description",
        content:
          "Bataiye aapka business kya hai — Setu matches Mudra, PMEGP, Stand-Up India, CGTMSE and PM SVANidhi to your small business, in Hindi or English.",
      },
      { property: "og:title", content: "Setu — Voice Help for MSME Loans & Govt Schemes" },
      {
        property: "og:description",
        content:
          "Speak in Hindi or English and Setu finds the government schemes, subsidies and credit your small business qualifies for.",
      },
    ],
  }),
  component: Index,
});

const SUGGESTIONS = [
  "I have a small tailoring business, I need 3 lakhs for new machines",
  "Mera kirana store hai, stock ke liye loan chahiye",
  "I want to start a new masala packing unit",
  "Kaun sa scheme mahila ke liye best hai?",
];

function Index() {
  const [query, setQuery] = useState("");
  const [reply, setReply] = useState("");
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [typing, setTyping] = useState(false);
  const [thinking, setThinking] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const matchOnServer = useServerFn(matchSchemesForQuery);
  const { supported, listening, speaking, interim, startListening, stopListening, speak, stopSpeaking } =
    useSpeech();

  const submit = useCallback(
    (text: string) => {
      const value = text.trim();
      if (!value) return;
      setQuery(value);
      setThinking(true);
      setSchemes([]);
      setReply("");
      void (async () => {
        let matched: Scheme[];
        let answer: string;
        try {
          const result = await matchOnServer({ data: { query: value } });
          matched = result.schemes;
          answer = result.reply;
        } catch (error) {
          console.error("Scheme lookup failed, using local index", error);
          matched = matchSchemes(value);
          answer = buildReply(value, matched);
        }
        setSchemes(matched);
        setReply(answer);
        setThinking(false);
        speak(answer);
      })();
    },
    [matchOnServer, speak],
  );

  const onMicClick = () => {
    if (speaking) {
      stopSpeaking();
      return;
    }
    if (listening) {
      stopListening();
      return;
    }
    const started = startListening((text) => submit(text));
    if (!started) {
      setTyping(true);
      window.setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const status = speaking
    ? "Setu is speaking"
    : listening
      ? interim || "Sun raha hoon… boliye"
      : thinking
        ? "Schemes dhoondh raha hoon…"
        : supported
          ? "Tap and tell me about your business"
          : "Tap to type about your business";

  return (
    <div className="setu-canvas min-h-screen">
      <SetuHeader />

      <main className="mx-auto w-full max-w-6xl px-6 pb-24">
        <section className="mx-auto max-w-2xl text-center">
          <h1 className="font-display text-4xl leading-[1.15] font-semibold text-balance text-foreground sm:text-5xl">
            Bataiye aapka business kya hai — Setu will find the government scheme you qualify for.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            Mudra, PMEGP, Stand-Up India, CGTMSE, PM SVANidhi and more — explained in plain language, with
            eligibility, documents and where to apply.
          </p>
        </section>

        <section className="mt-14 flex flex-col items-center">
          <button
            type="button"
            onClick={onMicClick}
            aria-label={speaking ? "Stop speaking" : listening ? "Stop listening" : "Start voice input"}
            className={`grid size-28 place-items-center rounded-full text-primary-foreground transition-transform duration-200 hover:scale-[1.03] active:scale-95 ${
              speaking ? "bg-primary/85 setu-pulse" : listening ? "bg-primary setu-pulse" : "bg-primary"
            }`}
          >
            {speaking ? (
              <Volume2 className="size-9" aria-hidden />
            ) : listening ? (
              <Square className="size-8" aria-hidden />
            ) : (
              <Mic className="size-9" aria-hidden />
            )}
          </button>

          <p className="mt-5 text-[15px] text-foreground/80">{status}</p>

          {typing ? (
            <form
              className="mt-5 flex w-full max-w-xl items-center gap-2 rounded-full border border-border bg-card/80 py-2 pr-2 pl-5 shadow-sm backdrop-blur"
              onSubmit={(event) => {
                event.preventDefault();
                const value = inputRef.current?.value ?? "";
                submit(value);
                if (inputRef.current) inputRef.current.value = "";
              }}
            >
              <input
                ref={inputRef}
                type="text"
                placeholder="Mera kirana store hai, 2 lakh chahiye…"
                className="min-w-0 flex-1 bg-transparent text-[15px] text-foreground outline-none placeholder:text-muted-foreground"
              />
              <button
                type="submit"
                aria-label="Send"
                className="grid size-9 place-items-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-90"
              >
                <Send className="size-4" aria-hidden />
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => {
                setTyping(true);
                window.setTimeout(() => inputRef.current?.focus(), 50);
              }}
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-2 text-sm text-foreground/80 backdrop-blur transition-colors hover:bg-card"
            >
              <Keyboard className="size-4" aria-hidden />
              Type instead
            </button>
          )}

          {!reply && !thinking && (
            <div className="mt-10 flex max-w-4xl flex-wrap justify-center gap-3">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => submit(suggestion)}
                  className="rounded-full border border-border bg-card/70 px-4 py-2 text-sm text-foreground/80 backdrop-blur transition-colors hover:border-primary/40 hover:bg-card"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </section>

        {query && (
          <section className="mt-14">
            <div className="flex justify-end">
              <p className="setu-rise max-w-xl rounded-3xl rounded-br-lg bg-primary px-5 py-3 text-[15px] text-primary-foreground">
                {query}
              </p>
            </div>

            {thinking ? (
              <p className="mt-6 text-[15px] text-muted-foreground">Setu soch raha hai…</p>
            ) : (
              reply && (
                <p className="setu-rise mt-6 max-w-2xl text-[17px] leading-relaxed text-foreground">{reply}</p>
              )
            )}
          </section>
        )}

        {schemes.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-2xl font-semibold text-foreground">Schemes matched to you</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Retrieved from the Setu scheme index for your business and amount.
            </p>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {schemes.map((scheme, index) => (
                <SchemeCard key={scheme.id} scheme={scheme} index={index} />
              ))}
            </div>
          </section>
        )}

        <footer className="mt-20 text-center text-xs text-muted-foreground">
          Setu gives general information on public schemes, not financial advice. Always confirm terms with the
          bank or agency before applying.
        </footer>
      </main>
    </div>
  );
}
