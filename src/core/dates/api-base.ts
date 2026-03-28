import type { RootState } from "../../types/holiday";

function trimTrailingSlash(url: string): string {
  return url.replace(/\/$/, "");
}

/** Base URL for holiday API calls (no trailing slash); `/holidays` is appended by callers. */
export function getHolidaysApiBase(state: RootState): string {
  const fromConfig = state.config?.data?.api_base_url;
  if (typeof fromConfig === "string" && fromConfig.trim()) {
    return trimTrailingSlash(fromConfig.trim());
  }
  const fromEnv = import.meta.env.VITE_HOLIDAYS_API_BASE;
  if (typeof fromEnv === "string" && fromEnv.trim()) {
    return trimTrailingSlash(fromEnv.trim());
  }
  return "";
}
