import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";

type Ripple = { id: number; x: number; y: number };

const ORBS: { size: number; left: string; top: string; depth: number; hue: "green" | "blue" | "mix" }[] = [
  { size: 320, left: "6%", top: "12%", depth: 56, hue: "green" },
  { size: 240, left: "72%", top: "8%", depth: 44, hue: "blue" },
  { size: 200, left: "58%", top: "52%", depth: 36, hue: "mix" },
  { size: 180, left: "18%", top: "58%", depth: 48, hue: "green" },
  { size: 140, left: "85%", top: "68%", depth: 32, hue: "blue" },
];

const SPECKS = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${(i * 47 + 13) % 92}%`,
  top: `${(i * 61 + 7) % 88}%`,
  depth: 12 + (i % 5) * 8,
  delay: i * 0.22,
  size: 3 + (i % 4),
}));

function ParallaxOrb({
  mx,
  my,
  size,
  left,
  top,
  depth,
  hue,
  index,
}: {
  mx: MotionValue<number>;
  my: MotionValue<number>;
  size: number;
  left: string;
  top: string;
  depth: number;
  hue: "green" | "blue" | "mix";
  index: number;
}) {
  const tx = useTransform(mx, [0, 1], [-depth, depth]);
  const ty = useTransform(my, [0, 1], [-depth * 0.65, depth * 0.65]);

  const hueClass =
    hue === "green" ? "interactive-backdrop__orb--green" : hue === "blue" ? "interactive-backdrop__orb--blue" : "interactive-backdrop__orb--mix";

  return (
    <motion.div
      className={`interactive-backdrop__orb ${hueClass}`}
      style={{
        width: size,
        height: size,
        left,
        top,
        marginLeft: -size / 2,
        marginTop: -size / 2,
        x: tx,
        y: ty,
      }}
      animate={{
        scale: [1, 1.06, 1],
        opacity: [0.35, 0.5, 0.35],
      }}
      transition={{
        duration: 9 + index * 1.4,
        repeat: Infinity,
        ease: "easeInOut",
        delay: index * 0.4,
      }}
    />
  );
}

function ParallaxSpeck({
  mx,
  my,
  left,
  top,
  depth,
  delay,
  size,
}: {
  mx: MotionValue<number>;
  my: MotionValue<number>;
  left: string;
  top: string;
  depth: number;
  delay: number;
  size: number;
}) {
  const tx = useTransform(mx, [0, 1], [-depth, depth]);
  const ty = useTransform(my, [0, 1], [-depth, depth]);

  return (
    <motion.span
      className="interactive-backdrop__speck"
      style={{
        left,
        top,
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
        x: tx,
        y: ty,
      }}
      animate={{ opacity: [0.2, 0.85, 0.2] }}
      transition={{ duration: 4 + (delay % 3), repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

function isInteractiveTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) return false;
  return Boolean(
    target.closest(
      "button, a, input, textarea, select, label, [role='switch'], [role='tab'], [role='dialog'], .header-burger, .drawer-backdrop"
    )
  );
}

function readReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function InteractiveBackdrop() {
  const [reducedMotion, setReducedMotion] = useState(readReducedMotion);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const rippleId = useRef(0);

  const rawMx = useMotionValue(0.5);
  const rawMy = useMotionValue(0.5);
  const mx = useSpring(rawMx, { stiffness: 38, damping: 22, mass: 0.4 });
  const my = useSpring(rawMy, { stiffness: 38, damping: 22, mass: 0.4 });

  const gridRotateX = useTransform(my, [0, 1], [5, -5]);
  const gridRotateY = useTransform(mx, [0, 1], [-6, 6]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const onMove = (e: MouseEvent) => {
      rawMx.set(e.clientX / window.innerWidth);
      rawMy.set(e.clientY / window.innerHeight);
    };
    const onTouch = (e: TouchEvent) => {
      if (!e.touches[0]) return;
      rawMx.set(e.touches[0].clientX / window.innerWidth);
      rawMy.set(e.touches[0].clientY / window.innerHeight);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouch);
    };
  }, [rawMx, rawMy, reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;
    const onClick = (e: MouseEvent) => {
      if (isInteractiveTarget(e.target)) return;
      const id = ++rippleId.current;
      setRipples((r) => [...r.slice(-10), { id, x: e.clientX, y: e.clientY }]);
      window.setTimeout(() => setRipples((r) => r.filter((x) => x.id !== id)), 850);
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, [reducedMotion]);

  return (
    <>
      <div className="interactive-backdrop" aria-hidden>
        <motion.div
          className="interactive-backdrop__grid"
          style={
            reducedMotion
              ? undefined
              : {
                  rotateX: gridRotateX,
                  rotateY: gridRotateY,
                  transformPerspective: 900,
                }
          }
        />

        {!reducedMotion &&
          ORBS.map((orb, i) => <ParallaxOrb key={`${orb.left}-${orb.top}`} mx={mx} my={my} index={i} {...orb} />)}

        {!reducedMotion && SPECKS.map((s) => <ParallaxSpeck key={s.id} mx={mx} my={my} {...s} />)}
      </div>

      {!reducedMotion && (
        <div className="interactive-backdrop-ripples" aria-hidden>
          <AnimatePresence>
            {ripples.map((r) => (
              <motion.span
                key={r.id}
                className="interactive-backdrop__ripple"
                style={{ left: r.x, top: r.y }}
                initial={{ scale: 0, opacity: 0.5 }}
                animate={{ scale: 3.2, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </>
  );
}
