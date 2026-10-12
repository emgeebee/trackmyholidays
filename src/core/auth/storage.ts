import type { AuthState } from "./reducer";

const STORAGE_KEY = "tmh_auth";

function getTokenExpiry(credential: string): number | undefined {
  try {
    const payload = credential.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const { exp } = JSON.parse(json);
    return typeof exp === "number" ? exp * 1000 : undefined;
  } catch {
    return undefined;
  }
}

export function saveAuth(auth: AuthState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
  } catch {
    // storage unavailable (e.g. private mode); fall back to in-memory only
  }
}

export function clearAuth() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function loadAuth(): AuthState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const auth: AuthState = JSON.parse(raw);
    const expiry = auth.credential && getTokenExpiry(auth.credential);
    if (!expiry || expiry <= Date.now()) {
      clearAuth();
      return {};
    }
    return auth;
  } catch {
    clearAuth();
    return {};
  }
}
