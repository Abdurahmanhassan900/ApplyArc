import { Check, RefreshCw } from "lucide-react";
import { useMaterialTheme } from "../contexts/MaterialThemeContext";
import { THEMES } from "../lib/themes";

export function ThemeSwitcher() {
  const { theme, setTheme, cycleTheme } = useMaterialTheme();
  const current =
    THEMES.find((candidate) => candidate.id === theme) ?? THEMES[0];

  return (
    <section className="theme-switcher" aria-labelledby="material-label">
      <div className="section-kicker" id="material-label">
        MATERIAL / {current.specimen}
      </div>
      <div className="theme-current-row">
        <div>
          <strong>{current.name}</strong>
          <p>{current.blurb}</p>
        </div>
        <button
          className="icon-button mat-control"
          type="button"
          onClick={cycleTheme}
          aria-label="Cycle visual theme"
          title="Cycle theme (T)"
        >
          <RefreshCw size={15} />
        </button>
      </div>
      <div className="theme-tray" role="list" aria-label="Visual themes">
        {THEMES.map((candidate) => (
          <button
            key={candidate.id}
            type="button"
            className={candidate.id === theme ? "is-selected" : ""}
            onClick={() => setTheme(candidate.id)}
            title={candidate.name}
            aria-label={`Use ${candidate.name} theme`}
            aria-pressed={candidate.id === theme}
          >
            <span style={{ background: candidate.swatch }} />
            {candidate.id === theme && <Check size={12} />}
          </button>
        ))}
      </div>
      <div className="theme-hint">
        <kbd>T</kbd> cycles material
      </div>
    </section>
  );
}
