export type TicketStatus = "Open" | "In Progress" | "Resolved";

export type GeoTag = {
  latitude: number;
  longitude: number;
  ward: string;
};

export type TicketInfo = {
  caseId: string;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
};

export type FeedbackInfo = {
  isWrong: boolean;
  correctedLabel?: 0 | 1;
  updatedAt: string;
};

export type StoredHistoryItem = {
  id: string;
  thumbnail: string;
  result: 0 | 1;
  timestamp: string;
  label: string;
  modelVersion: string;
  geoTag?: GeoTag;
  ticket?: TicketInfo;
  feedback?: FeedbackInfo;
};

const HISTORY_STORAGE_KEY = "signal-sprint-history";
const HISTORY_LIMIT = 100;

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

function writeHistory(history: StoredHistoryItem[]): void {
  let candidate = [...history];

  while (candidate.length > 0) {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(candidate));
      return;
    } catch {
      // If quota is exceeded, drop oldest entries and retry.
      candidate = candidate.slice(0, -1);
    }
  }

  // Final fallback in case storage is very constrained.
  localStorage.removeItem(HISTORY_STORAGE_KEY);
}

export function addHistoryItem(item: StoredHistoryItem): void {
  const existing = readHistory();
  const next = [item, ...existing].slice(0, HISTORY_LIMIT);
  writeHistory(next);
}

export function clearHistory(): void {
  localStorage.removeItem(HISTORY_STORAGE_KEY);
}

export function updateHistoryItem(
  id: string,
  update: (item: StoredHistoryItem) => StoredHistoryItem,
): StoredHistoryItem | null {
  const existing = readHistory();
  let changed: StoredHistoryItem | null = null;

  const next = existing.map((item) => {
    if (item.id !== id) {
      return item;
    }
    changed = update(item);
    return changed;
  });

  writeHistory(next);
  return changed;
}

export function getHistoryItemById(id: string): StoredHistoryItem | null {
  const existing = readHistory();
  return existing.find((item) => item.id === id) ?? null;
}

export function createCaseId(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `DMC-${y}${m}${d}-${random}`;
}

const IITK_BOUNDS = {
  minLat: 26.4975,
  maxLat: 26.5219,
  minLon: 80.2236,
  maxLon: 80.2498,
};

function isWithinIITKBounds(latitude: number, longitude: number): boolean {
  return (
    latitude >= IITK_BOUNDS.minLat &&
    latitude <= IITK_BOUNDS.maxLat &&
    longitude >= IITK_BOUNDS.minLon &&
    longitude <= IITK_BOUNDS.maxLon
  );
}

export function classifyWard(latitude: number, longitude: number): string {
  if (!isWithinIITKBounds(latitude, longitude)) {
    return "Outside IIT Kanpur";
  }

  const latMid = (IITK_BOUNDS.minLat + IITK_BOUNDS.maxLat) / 2;
  const lonMid = (IITK_BOUNDS.minLon + IITK_BOUNDS.maxLon) / 2;

  if (latitude >= latMid && longitude < lonMid) {
    return "Academic Core";
  }
  if (latitude >= latMid && longitude >= lonMid) {
    return "Faculty Zone";
  }
  if (latitude < latMid && longitude < lonMid) {
    return "Hall Area";
  }
  return "Main Gate Zone";
}

export function normalizeIITKPoint(latitude: number, longitude: number): { x: number; y: number } {
  const x = ((longitude - IITK_BOUNDS.minLon) / (IITK_BOUNDS.maxLon - IITK_BOUNDS.minLon)) * 100;
  const y = ((IITK_BOUNDS.maxLat - latitude) / (IITK_BOUNDS.maxLat - IITK_BOUNDS.minLat)) * 100;

  return {
    x: Math.max(0, Math.min(100, x)),
    y: Math.max(0, Math.min(100, y)),
  };
}
