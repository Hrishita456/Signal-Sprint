export type StoredHistoryItem = {
  id: string;
  thumbnail: string;
  result: 0 | 1;
  timestamp: string;
  label: string;
  modelVersion: string;
};

const HISTORY_STORAGE_KEY = "signal-sprint-history";
const HISTORY_LIMIT = 50;

export function readHistory(): StoredHistoryItem[] {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as StoredHistoryItem[];
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed;
  } catch {
    return [];
  }
}

export function addHistoryItem(item: StoredHistoryItem): void {
  const existing = readHistory();
  const next = [item, ...existing].slice(0, HISTORY_LIMIT);
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(next));
}

