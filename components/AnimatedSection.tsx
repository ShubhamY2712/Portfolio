"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Section-level scroll reveal. Used once per section (not per element).
 * Reduced-motion visitors get a plain fade via MotionProvider.
 */
export default function AnimatedSection({
  children,
  className = "",
  delay = 0,
  id,
  ariaLabelledby,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  id?: string;
  ariaLabelledby?: string;
}) {
  return (
    <motion.section
      id={id}
      aria-labelledby={ariaLabelledby}
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.section>
  );
}
