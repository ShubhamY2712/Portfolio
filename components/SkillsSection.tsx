"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Braces, BrainCircuit, Database, LayoutTemplate, Lightbulb, Rocket, Server, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SKILL_GROUPS, skillGroupOf } from "@/lib/content";
import type { Skill, SkillGroupKey } from "@/lib/content";

type Track = "all" | "product" | "engineering" | "people";
type Group = (typeof SKILL_GROUPS)[number];

const ICONS: Record<SkillGroupKey, LucideIcon> = {
  product: Lightbulb,
  languages: Braces,
  frontend: LayoutTemplate,
  backend: Server,
  database: Database,
  ai: BrainCircuit,
  tools: Rocket,
  professional: Users,
};

// Bento layout on large screens (4 columns).
const SPAN: Record<SkillGroupKey, string> = {
  product: "lg:col-span-2",
  languages: "",
  frontend: "",
  backend: "",
  database: "",
  ai: "lg:col-span-2",
  tools: "lg:col-span-2",
  professional: "lg:col-span-2",
};

const FILTERS: { key: Track; label: string }[] = [
  { key: "all", label: "All" },
  { key: "product", label: "Product" },
  { key: "engineering", label: "Engineering" },
  { key: "people", label: "People" },
];

/**
 * Skills as an interactive bento grid. Filter tabs (or hovering a card)
 * spotlight one track and dim the rest. A scrolling strip of the tech
 * stack runs above (it stands still with "reduce motion" on).
 */
export default function SkillsSection({ skills }: { skills: Skill[] }) {
  const [track, setTrack] = useState<Track>("all");
  const [hovered, setHovered] = useState<SkillGroupKey | null>(null);

  const byGroup: Record<SkillGroupKey, Skill[]> = SKILL_GROUPS.reduce(
    (acc: Record<SkillGroupKey, Skill[]>, g: Group) => {
      acc[g.key] = skills.filter((s: Skill) => skillGroupOf(s.category) === g.key);
      return acc;
    },
    {} as Record<SkillGroupKey, Skill[]>
  );
  const groups: Group[] = SKILL_GROUPS.filter((g: Group) => byGroup[g.key].length > 0);
  const techLabels: string[] = skills
    .filter((s: Skill) => !["product", "professional"].includes(skillGroupOf(s.category)))
    .map((s: Skill) => s.label);

  const isActive = (g: Group): boolean => {
    if (hovered) return hovered === g.key;
    return track === "all" || g.track === track;
  };

  return (
    <div>
      {/* Tech stack marquee */}
      {techLabels.length > 0 && (
        <div
          aria-hidden="true"
          className="group relative mb-10 overflow-hidden py-2"
          style={{
            maskImage: "linear-gradient(90deg, transparent, black 12%, black 88%, transparent)",
            WebkitMaskImage: "linear-gradient(90deg, transparent, black 12%, black 88%, transparent)",
          }}
        >
          <div className="flex w-max gap-3 motion-safe:animate-marquee group-hover:[animation-play-state:paused]">
            {[...techLabels, ...techLabels].map((label: string, i: number) => (
              <span
                key={label + i}
                className="whitespace-nowrap rounded-full border border-line bg-surface/70 px-4 py-2 font-display text-sm text-ink-soft"
              >
                <span className="mr-2 text-accent">&#9670;</span>
                {label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div role="group" aria-label="Filter skills" className="mb-8 flex flex-wrap justify-center gap-2">
        {FILTERS.map((f: { key: Track; label: string }) => (
          <button
            key={f.key}
            type="button"
            aria-pressed={track === f.key}
            onClick={() => setTrack(f.key)}
            className={
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-300 " +
              (track === f.key
                ? "border-accent bg-primary text-paper"
                : "border-line bg-surface/60 text-ink-soft hover:border-accent/50 hover:text-ink")
            }
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Bento grid */}
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {groups.map((g: Group, i: number) => {
          const Icon: LucideIcon = ICONS[g.key];
          const active: boolean = isActive(g);
          const list: Skill[] = byGroup[g.key];
          return (
            <motion.li
              key={g.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -60px 0px" }}
              transition={{ duration: 0.55, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              onMouseEnter={() => setHovered(g.key)}
              onMouseLeave={() => setHovered(null)}
              className={SPAN[g.key]}
            >
              {/* Dimming lives on this inner box: Motion controls the li's own opacity. */}
              <div
                className={
                  "card-glow group/card h-full p-6 transition duration-300 " +
                  (active ? "border-accent/30 shadow-card-hover" : "opacity-40 saturate-50")
                }
              >
              <div className="mb-5 flex items-center justify-between gap-3">
                <h3 className="flex items-center gap-3 font-display text-lg font-semibold text-ink">
                  <span
                    aria-hidden="true"
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-accent/30 bg-accent-soft text-accent transition-transform duration-300 group-hover/card:-rotate-6 group-hover/card:scale-110"
                  >
                    <Icon size={22} strokeWidth={1.7} />
                  </span>
                  {g.label}
                </h3>
                <span className="rounded-full border border-line px-2 py-0.5 text-xs text-ink-soft">{list.length}</span>
              </div>
              <ul className="flex flex-wrap gap-2">
                {list.map((s: Skill) => (
                  <li
                    key={s.id}
                    className="rounded-full border border-line bg-paper/60 px-3 py-1.5 text-sm text-ink/85 transition-colors duration-300 group-hover/card:border-accent/30 hover:!border-accent hover:text-accent-light"
                  >
                    {s.label}
                  </li>
                ))}
              </ul>
              </div>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
