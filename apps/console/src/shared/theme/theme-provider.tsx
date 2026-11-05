import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ThemeContext, type ThemeContextValue, type ThemeMode } from "./theme-context";

const STORAGE_KEY = "Atrium-theme";

function getPreferredTheme(): ThemeMode {
  // Dark is the product default rather than a preference the user has to find.
  // SSR has no storage, so it takes the same default.
  if (typeof window === "undefined") return "dark";

  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved === "light" || saved === "dark") {
    return saved;
  }

  return "dark";
}

function applyThemeClass(theme: ThemeMode) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(() => getPreferredTheme());

  useEffect(() => {
    applyThemeClass(theme);
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme: setThemeState,
      toggleTheme: () => {
        setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
      },
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
