// Filter state for the checklist: kind chip, grade select, search text, spoiler mode.
export function createFilterState() {
  return {
    kind: 'all', // all | story | missable | collectible | activity | online
    grade: 'all', // all | platinum | gold | silver | bronze
    query: '',
    spoilersHidden: false,
  };
}

export function applyFilters(trophies, state, earned) {
  const q = state.query.trim().toLowerCase();
  return trophies.filter((t) => {
    if (state.kind === 'story' && t.kind !== 'story') return false;
    if (state.kind === 'missable' && !t.missable) return false;
    if (state.kind === 'collectible' && t.kind !== 'collectible') return false;
    if (state.kind === 'activity' && t.kind !== 'activity') return false;
    if (state.kind === 'online') return false; // No online trophies in GTA VI.
    if (state.grade !== 'all' && t.grade !== state.grade) return false;
    if (q && !t.name.toLowerCase().includes(q) && !t.description.toLowerCase().includes(q)) return false;
    return true;
  });
}

// A story trophy is spoiler-hidden when the setting is on and it is not earned.
export function isSpoilerHidden(trophy, state, earned) {
  return state.spoilersHidden && trophy.kind === 'story' && !earned.has(trophy.id);
}

export function countByKind(trophies) {
  const counts = { story: 0, missable: 0, collectible: 0, activity: 0, online: 0 };
  for (const t of trophies) {
    if (t.kind === 'story') counts.story += 1;
    if (t.missable) counts.missable += 1;
    if (t.kind === 'collectible') counts.collectible += 1;
    if (t.kind === 'activity') counts.activity += 1;
  }
  return counts;
}
