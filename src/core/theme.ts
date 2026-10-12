import { useEffect, useState } from "react";

export type ThemePreference = "system" | "light" | "dark";

/** Keep in sync with the inline script in index.html. */
const STORAGE_KEY = "tmh_theme";
const THEME_COLORS = { light: "#0e7490", dark: "#0a3440" };

const systemDark = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches;

export const getThemePreference = (): ThemePreference => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : "system";
  } catch {
    return "system";
  }
};

const applyTheme = (preference: ThemePreference) => {
  const theme =
    preference === "system" ? (systemDark() ? "dark" : "light") : preference;
  document.documentElement.dataset.theme = theme;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", THEME_COLORS[theme]);
};

export const setThemePreference = (preference: ThemePreference) => {
  try {
    if (preference === "system") {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, preference);
    }
  } catch {
    // storage unavailable; the choice still applies for this page load
  }
  applyTheme(preference);
  window.dispatchEvent(new Event("tmh-theme-change"));
};

/** Applies the saved theme and follows OS changes while set to "system". */
export const initTheme = () => {
  applyTheme(getThemePreference());
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => {
      if (getThemePreference() === "system") applyTheme("system");
    });
};

export const useThemePreference = () => {
  const [preference, setPreference] = useState(getThemePreference);

  useEffect(() => {
    const sync = () => setPreference(getThemePreference());
    window.addEventListener("tmh-theme-change", sync);
    return () => window.removeEventListener("tmh-theme-change", sync);
  }, []);

  return [preference, setThemePreference] as const;
};
