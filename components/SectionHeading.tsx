import type { ReactNode } from "react";
import { Squiggle } from "@/components/Illustrations";

/** Eyebrow + display heading used at the top of each homepage section. */
export default function SectionHeading({
  id,
  eyebrow,
  title,
  align = "left",
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  align?: "left" | "center";
  children?: ReactNode;
}) {
  const centered: boolean = align === "center";
  return (
    <div className={"mb-10 sm:mb-14 " + (centered ? "text-center" : "")}>
      <p className={"eyebrow mb-3 flex items-center gap-3 " + (centered ? "justify-center" : "")}>
        <span aria-hidden="true" className="h-px w-6 bg-accent" />
        {eyebrow}
        {centered && <span aria-hidden="true" className="h-px w-6 bg-accent" />}
      </p>
      <h2 id={id} className="font-display text-display-sm font-bold text-ink sm:text-display-md">
        {title}
      </h2>
      <Squiggle className={"mt-3 block h-3 w-24 text-accent " + (centered ? "mx-auto" : "")} />
      {children}
    </div>
  );
}
