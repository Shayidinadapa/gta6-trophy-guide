// Loads the trophy data and offers small helpers for names and labels.
export async function loadTrophies() {
  const res = await fetch('./data/trophies.json');
  if (!res.ok) throw new Error('Could not load trophies.json: ' + res.status);
  const data = await res.json();
  return data.trophies;
}

export const GRADE_ORDER = { platinum: 0, gold: 1, silver: 2, bronze: 3 };

export function gradeLabel(grade) {
  return grade.charAt(0).toUpperCase() + grade.slice(1);
}

export function kindLabel(kind) {
  if (kind === 'story') return 'Story';
  if (kind === 'collectible') return 'Collectible';
  if (kind === 'activity') return 'Activity';
  return kind;
}

// Same normalization the bounty gate uses for official names:
// NFKC, curly quotes straight, dashes to '-', ellipsis to three dots,
// whitespace folded, lowercase.
export function normalizeName(name) {
  return name
    .normalize('NFKC')
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, '-')
    .replace(/…/g, '...')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}
