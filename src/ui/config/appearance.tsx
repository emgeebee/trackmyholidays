import { ThemePreference, useThemePreference } from "../../core/theme";

const OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

export const AppearanceSettings = () => {
  const [preference, setPreference] = useThemePreference();

  return (
    <div className="config-panel">
      <section className="config-section">
        <h4 className="config-section__title" id="theme-label">
          Theme
        </h4>
        <p className="config-section__hint">
          System follows your device's light or dark setting. Saved on this
          device only.
        </p>
        <div className="segmented" role="radiogroup" aria-labelledby="theme-label">
          {OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={preference === value}
              className={`month-grid__btn${
                preference === value ? " month-grid__btn--active" : ""
              }`}
              onClick={() => setPreference(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
