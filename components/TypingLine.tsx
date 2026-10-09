"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

type Phase = "typing" | "holding" | "deleting";

/**
 * "I'm <phrase>|" with a typewriter effect cycling through phrases.
 * Screen readers get all phrases as plain text; the animated copy is hidden
 * from them. With "reduce motion" on, the first phrase is shown statically.
 * Height is reserved using the longest phrase, so nothing below jumps.
 */
export default function TypingLine({
  prefix = "I'm",
  phrases,
  className = "",
}: {
  prefix?: string;
  phrases: string[];
  className?: string;
}) {
  const reduce: boolean | null = useReducedMotion();
  const [index, setIndex] = useState<number>(0);
  const [text, setText] = useState<string>("");
  const [phase, setPhase] = useState<Phase>("typing");

  const longest: string = phrases.reduce((a: string, b: string) => (b.length > a.length ? b : a), "");

  useEffect(() => {
    if (reduce || phrases.length === 0) return;
    const current: string = phrases[index % phrases.length];
    let timer: ReturnType<typeof setTimeout>;

    if (phase === "typing") {
      if (text.length < current.length) {
        timer = setTimeout(() => setText(current.slice(0, text.length + 1)), 55);
      } else {
        timer = setTimeout(() => setPhase(phrases.length > 1 ? "deleting" : "holding"), 1800);
      }
    } else if (phase === "deleting") {
      if (text.length > 0) {
        timer = setTimeout(() => setText(current.slice(0, text.length - 1)), 28);
      } else {
        setIndex((i: number) => (i + 1) % phrases.length);
        setPhase("typing");
      }
    }
    return () => clearTimeout(timer);
  }, [text, phase, index, phrases, reduce]);

  if (phrases.length === 0) return null;
  const shown: string = reduce ? phrases[0] : text;

  return (
    <p className={className}>
      <span className="sr-only">
        {prefix} {phrases.join(", ")}.
      </span>
      <span aria-hidden="true" className="grid">
        {/* Invisible sizer: reserves space for the longest phrase. */}
        <span className="invisible col-start-1 row-start-1">
          {prefix} {longest}
          <span className="ml-1 inline-block w-[3px]" />
        </span>
        <span className="col-start-1 row-start-1">
          {prefix} <span className="text-accent">{shown}</span>
          <span className="ml-1 inline-block h-[0.9em] w-[3px] translate-y-[0.1em] bg-accent motion-safe:animate-pulse" />
        </span>
      </span>
    </p>
  );
}
