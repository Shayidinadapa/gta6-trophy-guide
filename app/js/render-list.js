// Renders the checklist rows and the header progress summary.
import { gradeLabel, kindLabel } from './data.js';
import { isSpoilerHidden } from './filters.js';

export function renderProgress(trophies, earned) {
  const total = trophies.length;
  const done = earned.size;
  const pct = total ? Math.round((done / total) * 100) : 0;
  document.getElementById('progressCount').textContent = done + ' / ' + total;
  document.getElementById('progressPct').textContent = pct + '%';
  document.getElementById('progressRing').textContent = done + '/' + total;
  document.getElementById('progressRing').setAttribute('aria-label', done + ' of ' + total + ' trophies earned');
  document.getElementById('progressFill').style.width = pct + '%';
  const byGrade = {};
  for (const t of trophies) {
    byGrade[t.grade] = byGrade[t.grade] || { total: 0, done: 0 };
    byGrade[t.grade].total += 1;
    if (earned.has(t.id)) byGrade[t.grade].done += 1;
  }
  const parts = ['platinum', 'gold', 'silver', 'bronze'].map(
    (g) => gradeLabel(g) + ' ' + (byGrade[g] ? byGrade[g].done : 0) + '/' + (byGrade[g] ? byGrade[g].total : 0),
  );
  document.getElementById('progressGrades').textContent = parts.join(' · ');
}

export function renderList(trophies, state, earned, selectedId, onToggle, onSelect) {
  const list = document.getElementById('trophyList');
  list.innerHTML = '';
  for (const t of trophies) {
    const li = document.createElement('li');
    li.className = 'trophy-row' + (earned.has(t.id) ? ' earned' : '') + (t.id === selectedId ? ' selected' : '');
    if (isSpoilerHidden(t, state, earned)) li.classList.add('spoiler-hidden');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = earned.has(t.id);
    checkbox.setAttribute('aria-label', 'Mark ' + t.name + ' as earned');
    checkbox.addEventListener('click', (e) => {
      e.stopPropagation();
      onToggle(t.id, checkbox.checked);
    });

    const medal = document.createElement('span');
    medal.className = 'medal ' + t.grade;
    medal.textContent = t.grade === 'platinum' ? 'P' : t.grade === 'gold' ? 'G' : t.grade === 'silver' ? 'S' : 'B';
    medal.title = gradeLabel(t.grade);

    const body = document.createElement('div');
    body.className = 'trophy-body';
    const name = document.createElement('p');
    name.className = 'trophy-name';
    name.textContent = t.name;
    if (t.missable) {
      const flag = document.createElement('span');
      flag.className = 'flag';
      flag.textContent = 'Missable';
      name.appendChild(flag);
    }
    const desc = document.createElement('p');
    desc.className = 'trophy-desc';
    desc.textContent = t.description;
    const meta = document.createElement('p');
    meta.className = 'trophy-meta';
    meta.textContent = gradeLabel(t.grade) + ' · ' + kindLabel(t.kind);
    if (t.target) {
      const target = document.createElement('span');
      target.className = 'target';
      target.textContent = ' · PSN target: 0/' + t.target.toLocaleString('en-US');
      meta.appendChild(target);
    }
    body.appendChild(name);
    body.appendChild(desc);
    body.appendChild(meta);

    li.appendChild(checkbox);
    li.appendChild(medal);
    li.appendChild(body);
    li.addEventListener('click', () => onSelect(t.id));
    list.appendChild(li);
  }
  document.getElementById('listMeta').textContent =
    trophies.length + ' trophies shown' + (trophies.length !== 55 ? ' of 55' : '') + '.';
}
