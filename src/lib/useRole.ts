import { useSyncExternalStore } from 'react';
import type { RoleId } from '../data/roles';

/**
 * The reader's own role, saved in this browser. It tailors the home page,
 * the "Role guides" link and which sections component pages show first.
 * null means "show everything".
 */
const KEY = 'a11y-hub:role';
const IDS: RoleId[] = ['content', 'design', 'frontend', 'qa'];
const listeners = new Set<() => void>();

function read(): RoleId | null {
  try {
    const v = localStorage.getItem(KEY);
    return IDS.includes(v as RoleId) ? (v as RoleId) : null;
  } catch {
    return null;
  }
}

let current = read();

export function setRole(role: RoleId | null) {
  current = role;
  try {
    if (role) localStorage.setItem(KEY, role);
    else localStorage.removeItem(KEY);
  } catch {
    /* storage unavailable: keep it for this visit only */
  }
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      current = read();
      l();
    }
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(l);
    window.removeEventListener('storage', onStorage);
  };
}

export function useRole(): [RoleId | null, (role: RoleId | null) => void] {
  const role = useSyncExternalStore(subscribe, () => current);
  return [role, setRole];
}
