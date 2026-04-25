import { useId } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

type ThemeToggleProps = {
  layout?: "header" | "compact";
};

export function ThemeToggle({ layout = "header" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";
  const labelId = useId();

  return (
    <div className={`theme-toggle theme-toggle--${layout}`}>
      <span id={labelId} className="visually-hidden">
        {isLight ? "Switch to dark theme" : "Switch to light theme"}
      </span>
      <button
        type="button"
        className="theme-toggle__btn"
        role="switch"
        aria-checked={isLight}
        aria-labelledby={labelId}
        onClick={toggleTheme}
      >
        <span className="theme-toggle__icons" aria-hidden>
          <span className={`theme-toggle__icon ${!isLight ? "is-on" : ""}`}>☾</span>
          <span className={`theme-toggle__icon ${isLight ? "is-on" : ""}`}>☀</span>
        </span>
        <motion.span
          className="theme-toggle__knob"
          initial={false}
          animate={{ x: isLight ? "1.42rem" : "0rem" }}
          transition={{ type: "spring", stiffness: 420, damping: 32 }}
        />
      </button>
    </div>
  );
}
