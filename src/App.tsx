import { useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { Header } from "./components/Header";
import { InteractiveConsole } from "./components/InteractiveConsole";
import { InteractiveBackdrop } from "./components/InteractiveBackdrop";
import { ScrollProgress } from "./components/ScrollProgress";
import { StatStrip } from "./components/StatStrip";
import { useActiveSection } from "./hooks/useActiveSection";

const NAV = [
  { id: "overview", label: "Overview" },
  { id: "challenge", label: "Challenge" },
  { id: "platform", label: "Platform" },
  { id: "console", label: "Live console" },
  { id: "partners", label: "Partners" },
  { id: "flow", label: "How it works" },
  { id: "impact", label: "Impact" },
  { id: "contact", label: "Contact" },
] as const;

const SECTION_IDS: string[] = NAV.map((n) => n.id);

const PROBLEMS = [
  {
    p: "Massive daily waste generation",
    i: "Overflowing bins, unhygienic conditions",
    s: "Tonnes per day across urban India",
  },
  {
    p: "Inefficient collection systems",
    i: "Missed pickups, delayed disposal",
    s: "Manual scheduling, no live optimization",
  },
  {
    p: "Environmental damage",
    i: "Methane, soil and water pollution",
    s: "Accelerating urban degradation",
  },
  {
    p: "~40% waste loss",
    i: "Economic loss, lost recycling value",
    s: "Systemic collection failure",
  },
  {
    p: "Zero transparency",
    i: "Field teams and finance teams misaligned",
    s: "No trustworthy chain of custody",
  },
  {
    p: "High operational costs",
    i: "Institutions absorb avoidable expense",
    s: "Higher emissions per tonne moved",
  },
] as const;

const MODULES = [
  {
    icon: "◆",
    title: "Intelligent classification",
    body: "Camera or manual capture at the dock. Models suggest waste category, flag anomalies, and keep humans in the loop when confidence dips.",
  },
  {
    icon: "◇",
    title: "Adaptive routing",
    body: "Shift plans that respect urgency, vehicle load, traffic reality, and partner capacity—recalculated when new pickups land mid-route.",
  },
  {
    icon: "○",
    title: "Field network",
    body: "Structured onboarding, live tasking, proof-of-pickup, and earnings that are visible the same day—not reconciled weeks later.",
  },
  {
    icon: "◎",
    title: "Operations cockpit",
    body: "Role-aware dashboards for site leads, dispatch, and city teams. One place for KPIs, exceptions, and audit history.",
  },
  {
    icon: "✦",
    title: "Facility fit",
    body: "Every load is steered toward composting, biogas, or recycling partners based on material, contracts, and real-time capacity.",
  },
  {
    icon: "✧",
    title: "Impact reporting",
    body: "Automated diversion, emissions, and recycling narratives for finance and ESG—exportable when leadership needs the numbers.",
  },
] as const;

const PERSONAS = [
  {
    role: "Property & kitchen leads",
    need: "Predictable pickups, hygiene, and finance-grade reporting.",
    pain: "Missed collections, opaque disposal, unpredictable cost.",
  },
  {
    role: "Collection partners",
    need: "Fair routes, clear instructions, and fast payout visibility.",
    pain: "Informal coordination, disputed tickets, idle time.",
  },
  {
    role: "Program owners",
    need: "Onboarding, SLAs, and performance across many sites.",
    pain: "Spreadsheets, phone trees, and delayed incident response.",
  },
  {
    role: "City & sustainability teams",
    need: "Aggregate diversion, compliance evidence, and partner accountability.",
    pain: "Fragmented sources, landfill pressure, manual audits.",
  },
] as const;

const FLOW = [
  {
    title: "Capture",
    desc: "Sites log batches from web or mobile—weight, category, and location in seconds.",
  },
  {
    title: "Understand",
    desc: "Classification and policy checks run automatically; exceptions route to a reviewer.",
  },
  {
    title: "Dispatch",
    desc: "Optimized assignments reach field teams with context and navigation.",
  },
  {
    title: "Recover value",
    desc: "Material moves to the right processing partner with a digital chain of custody.",
  },
  {
    title: "Report",
    desc: "Live KPIs and scheduled exports keep operators and executives aligned.",
  },
] as const;

const reveal = {
  initial: { opacity: 0, y: 44, filter: "blur(14px)", scale: 0.96 },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)", scale: 1 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.72, ease: [0.16, 1, 0.3, 1] },
};

const goalContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.08 },
  },
};

const goalItem = {
  hidden: { opacity: 0, y: 36, skewY: -2 },
  show: {
    opacity: 1,
    y: 0,
    skewY: 0,
    transition: { duration: 0.58, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function App() {
  const heroRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroTextY = useTransform(heroProgress, [0, 1], [0, 72]);
  const heroTextOpacity = useTransform(heroProgress, [0, 0.55], [1, 0.2]);
  const heroChipsY = useTransform(heroProgress, [0, 1], [0, 36]);
  const heroStatsY = useTransform(heroProgress, [0, 1], [0, 56]);
  const heroGlow = useTransform(heroProgress, [0, 1], [1, 0.45]);

  const activeId = useActiveSection(SECTION_IDS);
  const [openProblem, setOpenProblem] = useState<number | null>(0);
  const [flowStep, setFlowStep] = useState(0);
  const [form, setForm] = useState({ name: "", org: "", email: "", message: "" });
  const [formStatus, setFormStatus] = useState<"idle" | "sent" | "error">("idle");

  const submitContact = (e: FormEvent) => {
    e.preventDefault();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
    if (!form.name.trim() || !emailOk || !form.message.trim()) {
      setFormStatus("error");
      return;
    }
    setFormStatus("sent");
    setForm({ name: "", org: "", email: "", message: "" });
  };

  return (
    <div className="app">
      <ScrollProgress />
      <motion.div className="app__aurora" aria-hidden style={{ opacity: heroGlow }} />
      <InteractiveBackdrop />

      <Header navItems={NAV} activeId={activeId} />

      <main>
        <section ref={heroRef} id="overview" className="hero" aria-labelledby="hero-title">
          <div className="hero__inner">
            <motion.div
              className="hero__parallax"
              style={{ y: heroTextY, opacity: heroTextOpacity }}
              initial={{ opacity: 0, y: 56, filter: "blur(16px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="hero__eyebrow">Bio-waste operations for modern institutions</p>
              <h1 id="hero-title" className="hero__title">
                Turn organic waste into measurable progress.
              </h1>
              <p className="hero__subtitle">
                One platform for classification, routing, field execution, and impact reporting—built for hostels, hotels,
                central kitchens, and city programs that cannot afford another missed pickup.
              </p>
              <div className="hero__actions">
                <motion.span className="hero__action-hit" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <button type="button" className="btn btn--primary" onClick={() => document.getElementById("platform")?.scrollIntoView({ behavior: "smooth" })}>
                    Explore the platform
                  </button>
                </motion.span>
                <motion.span className="hero__action-hit" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <button type="button" className="btn btn--glass" onClick={() => document.getElementById("console")?.scrollIntoView({ behavior: "smooth" })}>
                    Open live console demo
                  </button>
                </motion.span>
              </div>
            </motion.div>

            <motion.dl
              className="hero__chips"
              style={{ y: heroChipsY }}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div className="glass-chip" whileHover={{ y: -4, transition: { duration: 0.2 } }}>
                <dt>Built for</dt>
                <dd>High-volume kitchens &amp; campuses</dd>
              </motion.div>
              <motion.div className="glass-chip" whileHover={{ y: -4, transition: { duration: 0.2 } }}>
                <dt>Delivery</dt>
                <dd>Web console + mobile field apps</dd>
              </motion.div>
              <motion.div className="glass-chip" whileHover={{ y: -4, transition: { duration: 0.2 } }}>
                <dt>Deployment</dt>
                <dd>Single site to multi-city programs</dd>
              </motion.div>
            </motion.dl>

            <motion.div className="hero__stats-wrap" style={{ y: heroStatsY }} initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28, duration: 0.65 }}>
              <StatStrip />
            </motion.div>
          </div>
        </section>

        <section id="challenge" className="section" aria-labelledby="challenge-title">
          <div className="section__inner">
            <motion.div {...reveal}>
              <p className="section__label">The challenge</p>
              <h2 id="challenge-title" className="section__title">
                Organic waste still moves like it is 2005.
              </h2>
              <p className="section__lead">
                Without live telemetry, intelligent routing, and source-level sorting, every tonne costs more than it should—and too much still leaks to landfill.
              </p>
            </motion.div>

            <div className="problem-accord">
              {PROBLEMS.map((row, i) => {
                const open = openProblem === i;
                return (
                  <motion.div
                    key={row.p}
                    className={`problem-accord__item glass-panel ${open ? "is-open" : ""}`}
                    initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ delay: i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <button
                      type="button"
                      className="problem-accord__trigger"
                      aria-expanded={open}
                      onClick={() => setOpenProblem(open ? null : i)}
                    >
                      <span className="problem-accord__chevron" aria-hidden>
                        {open ? "−" : "+"}
                      </span>
                      <span className="problem-accord__title">{row.p}</span>
                    </button>
                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div
                          key="panel"
                          className="problem-accord__panel"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.28 }}
                        >
                          <p className="problem-accord__impact">{row.i}</p>
                          <p className="problem-accord__scale">{row.s}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>

            <motion.div className="root-glass glass-panel" {...reveal}>
              <h3 className="root-glass__title">What keeps the system stuck</h3>
              <ul className="root-glass__list">
                <li>No shared operational picture across sites, finance, and field teams.</li>
                <li>Dispatch decisions made from memory instead of live constraints.</li>
                <li>Waste streams arrive unlabeled, forcing downstream guesswork.</li>
                <li>No durable record from dock door to processing gate.</li>
              </ul>
            </motion.div>
          </div>
        </section>

        <section id="platform" className="section section--mesh" aria-labelledby="platform-title">
          <div className="section__inner section__inner--perspective">
            <motion.div {...reveal}>
              <p className="section__label">Platform</p>
              <h2 id="platform-title" className="section__title">
                Outcomes operators can defend in a boardroom.
              </h2>
              <p className="section__lead">
                Every module pushes the same levers: lower cost per tonne, higher diversion, happier field teams, and reporting that does not require a weekend in Excel.
              </p>
            </motion.div>

            <motion.div className="goals-grid" variants={goalContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
              {[
                { g: "Shrink organic waste spend", m: "Up to 85% lower program cost vs. fully manual models" },
                { g: "Increase beneficial use", m: "60%+ of collected organics routed to compost, biogas, or recycling" },
                { g: "Formalize green jobs", m: "5,000+ field roles with transparent schedules and earnings" },
                { g: "Prove carbon story", m: "Tonnes diverted translated into CO₂e narratives you can audit" },
                { g: "Scale geography", m: "Repeatable playbooks from flagship properties to entire cities" },
              ].map((row) => (
                <motion.div key={row.g} className="goal-card glass-panel" variants={goalItem}>
                  <strong>{row.g}</strong>
                  <span>{row.m}</span>
                </motion.div>
              ))}
            </motion.div>

            <div className="card-grid card-grid--lift">
              {MODULES.map((m, i) => (
                <motion.article
                  key={m.title}
                  className="card glass-panel"
                  initial={{ opacity: 0, y: 40, rotateX: -6, filter: "blur(8px)" }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: i * 0.07, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -8, rotateX: 2, transition: { duration: 0.22 } }}
                >
                  <div className="card__icon" aria-hidden>
                    {m.icon}
                  </div>
                  <h3>{m.title}</h3>
                  <p>{m.body}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section id="console" className="section" aria-labelledby="console-title">
          <div className="section__inner">
            <motion.div {...reveal}>
              <p className="section__label">Live console</p>
              <h2 id="console-title" className="section__title">
                Interact with the operations surface.
              </h2>
              <p className="section__lead">
                Switch between site, field, and city lenses, log a pickup batch, and run a simulated classification pass—no backend required for this preview.
              </p>
            </motion.div>
            <motion.div
              transformPerspective={1100}
              initial={{ opacity: 0, y: 48, scale: 0.97, rotateX: 4 }}
              whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            >
              <InteractiveConsole />
            </motion.div>
          </div>
        </section>

        <section id="partners" className="section section--mesh" aria-labelledby="partners-title">
          <div className="section__inner">
            <motion.div {...reveal}>
              <p className="section__label">Partners</p>
              <h2 id="partners-title" className="section__title">
                Designed with every seat at the table.
              </h2>
            </motion.div>
            <div className="card-grid card-grid--lift">
              {PERSONAS.map((u, i) => (
                <motion.article
                  key={u.role}
                  className="card glass-panel persona-card"
                  initial={{ opacity: 0, y: 36, x: i % 2 === 0 ? -12 : 12 }}
                  whileInView={{ opacity: 1, y: 0, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: i * 0.08, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ scale: 1.02, y: -4 }}
                >
                  <p className="card__role">{u.role}</p>
                  <h3>What they need</h3>
                  <p>{u.need}</p>
                  <h3 className="persona-card__sub">Friction today</h3>
                  <p>{u.pain}</p>
                </motion.article>
              ))}
            </div>
            <motion.p className="sectors-line" {...reveal}>
              Hostels and universities · Hotels and F&amp;B groups · Cloud kitchens · Municipal programs · Corporate campuses reporting ESG outcomes
            </motion.p>
          </div>
        </section>

        <section id="flow" className="section" aria-labelledby="flow-title">
          <div className="section__inner">
            <motion.div {...reveal}>
              <p className="section__label">How it works</p>
              <h2 id="flow-title" className="section__title">
                A straight line from dock to diversion.
              </h2>
              <p className="section__lead">Select a stage to focus the narrative—teams onboard faster when the story is sequential and concrete.</p>
            </motion.div>

            <div className="flow-interactive">
              <div className="flow-rail glass-panel">
                {FLOW.map((s, i) => (
                  <button
                    key={s.title}
                    type="button"
                    className={`flow-rail__btn ${flowStep === i ? "is-active" : ""}`}
                    onClick={() => setFlowStep(i)}
                  >
                    <span className="flow-rail__idx">{String(i + 1).padStart(2, "0")}</span>
                    <span className="flow-rail__label">{s.title}</span>
                  </button>
                ))}
              </div>
              <motion.div
                key={flowStep}
                className="flow-detail glass-panel"
                initial={{ opacity: 0, x: 28, filter: "blur(8px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                transition={{ type: "spring", stiffness: 260, damping: 28 }}
              >
                <h3>{FLOW[flowStep]!.title}</h3>
                <p>{FLOW[flowStep]!.desc}</p>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="impact" className="section section--mesh" aria-labelledby="impact-title">
          <div className="section__inner">
            <motion.div {...reveal}>
              <p className="section__label">Impact</p>
              <h2 id="impact-title" className="section__title">
                Proof over promises.
              </h2>
            </motion.div>
            <div className="two-col">
              <motion.div className="glass-panel impact-narrative" {...reveal}>
                <h3>Why teams adopt</h3>
                <ul>
                  <li>Field partners gain predictable income visibility and digital receipts.</li>
                  <li>Communities see cleaner loading bays and fewer nuisance odors.</li>
                  <li>Finance receives defensible diversion metrics without manual stitching.</li>
                  <li>Programs unlock new revenue streams across the waste-to-value chain.</li>
                </ul>
              </motion.div>
              <motion.div className="table-glass glass-panel" {...reveal}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Indicator</th>
                      <th>Target</th>
                      <th>Horizon</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Operating cost reduction</td>
                      <td>85%</td>
                      <td>Year one</td>
                    </tr>
                    <tr>
                      <td>Beneficial use rate</td>
                      <td>60%</td>
                      <td>Year one</td>
                    </tr>
                    <tr>
                      <td>Field roles supported</td>
                      <td>5,000+</td>
                      <td>Year two</td>
                    </tr>
                    <tr>
                      <td>Live partner sites</td>
                      <td>100+</td>
                      <td>Year one</td>
                    </tr>
                    <tr>
                      <td>Metro programs</td>
                      <td>3–5</td>
                      <td>Year two</td>
                    </tr>
                  </tbody>
                </table>
              </motion.div>
            </div>

            <motion.div className="roadmap-glass glass-panel" {...reveal}>
              <h3 className="roadmap-glass__title">What comes next</h3>
              <ul className="roadmap-glass__list">
                <li>
                  <strong>Sensor-aware bins</strong> that request pickup before overflow.
                </li>
                <li>
                  <strong>Deeper traceability</strong> for regulators and enterprise procurement.
                </li>
                <li>
                  <strong>Specialized streams</strong> for industrial and clinical organics with compliance guardrails.
                </li>
                <li>
                  <strong>City-scale partnerships</strong> aligned with national cleanliness and smart-city investments.
                </li>
              </ul>
            </motion.div>
          </div>
        </section>

        <section id="contact" className="section section--cta" aria-labelledby="contact-title">
          <div className="section__inner contact-grid">
            <motion.div {...reveal}>
              <p className="section__label">Contact</p>
              <h2 id="contact-title" className="section__title">
                Ready to run a disciplined organic program?
              </h2>
              <p className="section__lead">
                Tell us about your sites, volumes, and timelines. We will respond with a tailored walkthrough—usually within one business day.
              </p>
            </motion.div>
            <motion.form className="contact-form glass-panel" onSubmit={submitContact} {...reveal}>
              <label className="field">
                <span>Name</span>
                <input
                  required
                  name="name"
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => {
                    setForm({ ...form, name: e.target.value });
                    setFormStatus("idle");
                  }}
                  placeholder="Priya Sharma"
                />
              </label>
              <label className="field">
                <span>Organization</span>
                <input
                  name="org"
                  autoComplete="organization"
                  value={form.org}
                  onChange={(e) => setForm({ ...form, org: e.target.value })}
                  placeholder="Company or municipality"
                />
              </label>
              <label className="field">
                <span>Work email</span>
                <input
                  required
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => {
                    setForm({ ...form, email: e.target.value });
                    setFormStatus("idle");
                  }}
                  placeholder="you@company.com"
                />
              </label>
              <label className="field">
                <span>What should we know?</span>
                <textarea
                  required
                  name="message"
                  rows={4}
                  value={form.message}
                  onChange={(e) => {
                    setForm({ ...form, message: e.target.value });
                    setFormStatus("idle");
                  }}
                  placeholder="Sites, daily organic tonnes, current process, goals…"
                />
              </label>
              {formStatus === "error" && <p className="form-hint form-hint--error">Please add your name, a valid email, and a short message.</p>}
              {formStatus === "sent" && (
                <motion.p className="form-hint form-hint--ok" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                  Thanks—your note is recorded for this demo. In production this would route to your inbox.
                </motion.p>
              )}
              <button type="submit" className="btn btn--primary btn--block">
                Send message
              </button>
            </motion.form>
          </div>
        </section>
      </main>

      <motion.footer className="site-footer glass-panel" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }}>
        <p>
          <strong>Verdant Flow</strong> — bio-waste intelligence for teams that operate at scale.
        </p>
        <p>© {new Date().getFullYear()} Demo experience. Names and metrics are illustrative.</p>
      </motion.footer>
    </div>
  );
}
