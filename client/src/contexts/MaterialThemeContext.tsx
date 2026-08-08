import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { isThemeId, THEMES, type ThemeId } from "../lib/themes";

const STORAGE_KEY = "runbook.theme";

interface MaterialThemeContextValue {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
  cycleTheme: () => void;
}

const MaterialThemeContext = createContext<MaterialThemeContextValue | null>(
  null,
);

function loadTheme(): ThemeId {
  if (typeof window === "undefined") return "glass";
  const saved =
    window.localStorage.getItem(STORAGE_KEY) ??
    window.localStorage.getItem("applyarc.theme");
  return isThemeId(saved) ? saved : "glass";
}

export function MaterialThemeProvider({
  children,
  forcedTheme,
}: {
  children: ReactNode;
  forcedTheme?: ThemeId;
}) {
  const [selectedTheme, setSelectedTheme] = useState<ThemeId>(
    () => forcedTheme ?? loadTheme(),
  );
  const theme = forcedTheme ?? selectedTheme;

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme =
      theme === "spatial" ? "dark" : "light";
    if (!forcedTheme) window.localStorage.setItem(STORAGE_KEY, theme);
  }, [forcedTheme, theme]);

  const setTheme = useCallback(
    (nextTheme: ThemeId) => {
      if (!forcedTheme) setSelectedTheme(nextTheme);
    },
    [forcedTheme],
  );

  const cycleTheme = useCallback(() => {
    if (forcedTheme) return;
    setSelectedTheme((current) => {
      const index = THEMES.findIndex((candidate) => candidate.id === current);
      return THEMES[(index + 1) % THEMES.length].id;
    });
  }, [forcedTheme]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key.toLowerCase() !== "t" ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey
      )
        return;
      const target = event.target as HTMLElement | null;
      if (target?.matches("input, textarea, select, [contenteditable='true']"))
        return;
      cycleTheme();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cycleTheme]);

  const value = useMemo(
    () => ({ theme, setTheme, cycleTheme }),
    [cycleTheme, setTheme, theme],
  );
  return (
    <MaterialThemeContext.Provider value={value}>
      {children}
    </MaterialThemeContext.Provider>
  );
}

export function useMaterialTheme(): MaterialThemeContextValue {
  const context = useContext(MaterialThemeContext);
  if (!context)
    throw new Error(
      "useMaterialTheme must be used inside MaterialThemeProvider",
    );
  return context;
}
