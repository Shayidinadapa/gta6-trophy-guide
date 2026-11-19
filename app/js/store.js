// Progress storage: localStorage on this device only, plus export / import.
// Demo mode (?demo) seeds a fixed, plausible set of 13 earned trophies so the
// tracker can be previewed at a glance.
const STORAGE_KEY = 'leonida-legend-progress-v1';

export const DEMO_EARNED_IDS = [2, 3, 8, 15, 16, 20, 21, 33, 35, 42, 46, 53, 55];

export function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const ids = JSON.parse(raw);
    if (!Array.isArray(ids)) return new Set();
    return new Set(ids.filter((n) => Number.isInteger(n)));
  } catch (_e) {
    return new Set();
  }
}

export function saveProgress(earned) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...earned].sort((a, b) => a - b)));
  } catch (_e) {
    // Storage full or unavailable (private mode): progress still works in memory.
  }
}

export function applyDemo() {
  const earned = new Set(DEMO_EARNED_IDS);
  saveProgress(earned);
  return earned;
}

export function exportProgress(earned) {
  const payload = {
    app: 'Leonida Legend — GTA VI trophy tracker',
    exportedAt: new Date().toISOString(),
    earned: [...earned].sort((a, b) => a - b),
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'gta6-trophy-progress.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export async function importProgressFile(file, validIds) {
  const text = await file.text();
  const data = JSON.parse(text);
  const ids = Array.isArray(data) ? data : data.earned;
  if (!Array.isArray(ids)) throw new Error('File does not contain a list of trophy ids.');
  const earned = new Set();
  for (const n of ids) {
    if (Number.isInteger(n) && validIds.has(n)) earned.add(n);
  }
  return earned;
}
