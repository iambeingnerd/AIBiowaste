import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useCountUp } from "../hooks/useCountUp";

const STATS = [
  { end: 85, suffix: "%", label: "Lower operating cost vs. manual programs" },
  { end: 60, suffix: "%", label: "Organic stream routed to beneficial use" },
  { end: 5000, suffix: "+", label: "Field roles supported with transparent pay" },
  { end: 90, suffix: "%+", label: "Target classification confidence" },
] as const;

function StatCell({ end, suffix, label, index }: (typeof STATS)[number] & { index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const n = useCountUp(end, 1400, inView);
  const display =
    suffix === "+%" ? `${n}%+` : suffix === "+" ? `${n.toLocaleString()}+` : `${n}${suffix}`;

  return (
    <motion.div
      ref={ref}
      className="stat-glass"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="stat-glass__value">{display}</div>
      <div className="stat-glass__label">{label}</div>
    </motion.div>
  );
}

export function StatStrip() {
  return (
    <div className="stat-strip-glass">
      {STATS.map((s, index) => (
        <StatCell key={s.label} {...s} index={index} />
      ))}
    </div>
  );
}
