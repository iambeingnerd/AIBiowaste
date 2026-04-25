import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type TabId = "operations" | "field" | "city";

const TABS: { id: TabId; label: string }[] = [
  { id: "operations", label: "Site operations" },
  { id: "field", label: "Field teams" },
  { id: "city", label: "City view" },
];

const WASTE_TYPES = ["Food prep", "Garden trim", "Compostables", "Mixed organic"] as const;

type LogEntry = {
  id: string;
  created: string;
  type: string;
  kg: string;
  classified?: string;
  confidence?: string;
};

function randomClass(): { label: string; confidence: string } {
  const pool = [
    { label: "Food waste — pre-consumer", confidence: "94%" },
    { label: "Green waste — compost stream", confidence: "91%" },
    { label: "Compostable packaging", confidence: "88%" },
    { label: "Mixed organic — review suggested", confidence: "76%" },
  ];
  return pool[Math.floor(Math.random() * pool.length)]!;
}

export function InteractiveConsole() {
  const [tab, setTab] = useState<TabId>("operations");
  const [kg, setKg] = useState("42");
  const [wasteType, setWasteType] = useState<string>(WASTE_TYPES[0]!);
  const [note, setNote] = useState("");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [pulse, setPulse] = useState(0);

  const kpis = useMemo(() => {
    if (tab === "operations") {
      return [
        { val: "12.4 t", label: "Collected (7 days)" },
        { val: "18", label: "Routes completed" },
        { val: "2.1 t", label: "Emissions avoided (est.)" },
        { val: "4", label: "Sites on schedule" },
      ];
    }
    if (tab === "field") {
      return [
        { val: "7", label: "Active riders" },
        { val: "36 km", label: "Optimized distance saved" },
        { val: "₹4.2k", label: "Today's earnings (pool)" },
        { val: "2", label: "Urgent pickups" },
      ];
    }
    return [
      { val: "214 t", label: "City diverted (MTD)" },
      { val: "62%", label: "Recycling efficiency" },
      { val: "38", label: "Institutions live" },
      { val: "12", label: "Processing partners" },
    ];
  }, [tab]);

  const addLog = () => {
    const id = crypto.randomUUID();
    const entry: LogEntry = {
      id,
      created: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: wasteType,
      kg: kg || "—",
    };
    setLogs((prev) => [entry, ...prev].slice(0, 8));
    setNote("");
    setPulse((p) => p + 1);
  };

  const classify = (id: string) => {
    setBusyId(id);
    window.setTimeout(() => {
      const result = randomClass();
      setLogs((prev) =>
        prev.map((l) =>
          l.id === id ? { ...l, classified: result.label, confidence: result.confidence } : l
        )
      );
      setBusyId(null);
    }, 900);
  };

  return (
    <div className="console glass-panel">
      <div className="console__top">
        <div className="console__dots" aria-hidden>
          <span />
          <span />
          <span />
        </div>
        <span className="console__title">Live operations console</span>
        <motion.span
          key={pulse}
          className="console__live"
          initial={{ opacity: 0.4, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
        >
          <span className="console__live-dot" /> Synced
        </motion.span>
      </div>

      <div className="console__tabs" role="tablist" aria-label="Console view">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            className={`console__tab ${tab === t.id ? "is-active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="console__body">
        <div className="console__main">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              className="kpi-grid"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22 }}
            >
              {kpis.map((k) => (
                <div key={k.label} className="kpi glass-inset">
                  <div className="kpi__val">{k.val}</div>
                  <div className="kpi__lbl">{k.label}</div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

          <div className="map-glass" aria-label="Route activity preview">
            <div className="map-glass__grid" />
            {["24%", "38%", "55%", "62%", "71%"].map((top, i) => (
              <motion.span
                key={i}
                className="map-glass__pin"
                style={{ top, left: `${18 + i * 16}%` }}
                animate={{ y: [0, -6, 0], opacity: [0.65, 1, 0.65] }}
                transition={{ duration: 2.4 + i * 0.2, repeat: Infinity, ease: "easeInOut" }}
              />
            ))}
            <p className="map-glass__caption">Rider positions and route progress update as tasks complete.</p>
          </div>
        </div>

        <aside className="console__side">
          <p className="console__side-title">Log a pickup batch</p>
          <p className="console__side-hint">Try it — entries stay in this session only.</p>
          <label className="field">
            <span>Waste category</span>
            <select value={wasteType} onChange={(e) => setWasteType(e.target.value)}>
              {WASTE_TYPES.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Weight (kg)</span>
            <input type="number" min={0} step={0.5} value={kg} onChange={(e) => setKg(e.target.value)} />
          </label>
          <label className="field">
            <span>Note (optional)</span>
            <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Banquet hall — night shift" />
          </label>
          <button type="button" className="btn btn--primary btn--block" onClick={addLog}>
            Add to queue
          </button>

          <div className="log-list">
            <p className="log-list__title">Session queue</p>
            {logs.length === 0 ? (
              <p className="log-list__empty">No entries yet. Add a batch to see it here.</p>
            ) : (
              <ul>
                {logs.map((l) => (
                  <li key={l.id} className="log-item glass-inset">
                    <div className="log-item__row">
                      <strong>{l.type}</strong>
                      <span className="log-item__meta">
                        {l.kg} kg · {l.created}
                      </span>
                    </div>
                    {l.classified ? (
                      <p className="log-item__ai">
                        <span className="log-item__badge">AI</span> {l.classified}{" "}
                        <span className="log-item__conf">({l.confidence})</span>
                      </p>
                    ) : (
                      <button
                        type="button"
                        className="btn btn--tiny btn--glass"
                        disabled={busyId === l.id}
                        onClick={() => classify(l.id)}
                      >
                        {busyId === l.id ? "Classifying…" : "Run classification"}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="facility glass-inset">
            <p className="facility__title">Processing partners</p>
            <ul>
              <li>
                <span>Composting</span> <em>72% capacity</em>
              </li>
              <li>
                <span>Biogas</span> <em>Accepting</em>
              </li>
              <li>
                <span>Recycling</span> <em>Queue normal</em>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
