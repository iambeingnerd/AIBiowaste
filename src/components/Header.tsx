import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";

export type NavItem = { id: string; label: string };

type HeaderProps = {
  navItems: readonly NavItem[];
  activeId: string;
};

export function Header({ navItems, activeId }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  };

  return (
    <>
      <header className={`header-shell ${scrolled ? "header-shell--scrolled" : ""}`}>
        <div className="header-glass">
          <a
            href="#overview"
            className="header-logo"
            onClick={(e) => {
              e.preventDefault();
              scrollTo("overview");
            }}
          >
            <span className="header-logo__mark" aria-hidden />
            <span className="header-logo__text">Verdant Flow</span>
          </a>

          <nav className="header-nav" aria-label="Primary">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`header-nav__link ${activeId === item.id ? "is-active" : ""}`}
                onClick={() => scrollTo(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="header-actions">
            <ThemeToggle />
            <button type="button" className="btn btn--glass" onClick={() => scrollTo("contact")}>
              Book a walkthrough
            </button>
            <button
              type="button"
              className="header-burger"
              aria-expanded={menuOpen}
              aria-controls="mobile-drawer"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((o) => !o)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.button
              type="button"
              className="drawer-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              id="mobile-drawer"
              className="drawer-panel glass-panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              role="dialog"
              aria-modal="true"
            >
              <p className="drawer-panel__title">Navigate</p>
              <nav className="drawer-nav" aria-label="Mobile">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`drawer-nav__link ${activeId === item.id ? "is-active" : ""}`}
                    onClick={() => scrollTo(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
              <div className="drawer-theme">
                <span className="drawer-theme__label">Appearance</span>
                <ThemeToggle layout="compact" />
              </div>
              <button type="button" className="btn btn--primary drawer-cta" onClick={() => scrollTo("contact")}>
                Book a walkthrough
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
