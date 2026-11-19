// Renders the detail pane: official description, own-words guide, sources.
import { gradeLabel, kindLabel } from './data.js';

export function renderDetail(trophy, earned, onToggle) {
  const pane = document.getElementById('detailPane');
  pane.innerHTML = '';
  if (!trophy) {
    const p = document.createElement('p');
    p.className = 'detail-empty';
    p.textContent = 'Select a trophy to read its guide and sources.';
    pane.appendChild(p);
    return;
  }

  const title = document.createElement('h2');
  title.textContent = trophy.name;
  pane.appendChild(title);

  const gradeLine = document.createElement('p');
  gradeLine.className = 'grade-line';
  const pill = document.createElement('span');
  pill.className = 'grade-pill ' + trophy.grade;
  pill.textContent = gradeLabel(trophy.grade);
  gradeLine.appendChild(pill);
  const kind = document.createElement('span');
  kind.className = 'kind-tag';
  kind.textContent = kindLabel(trophy.kind) + (trophy.missable ? ' · Missable' : '') + ' · Stage ' + trophy.stage;
  gradeLine.appendChild(kind);
  if (trophy.target) {
    const target = document.createElement('span');
    target.className = 'kind-tag';
    target.textContent = 'PSN target: 0/' + trophy.target.toLocaleString('en-US');
    gradeLine.appendChild(target);
  }
  pane.appendChild(gradeLine);

  const official = document.createElement('p');
  official.className = 'official';
  official.textContent = '“' + trophy.description + '” — official PSN description';
  pane.appendChild(official);

  const guideHead = document.createElement('h3');
  guideHead.textContent = 'How to earn it';
  pane.appendChild(guideHead);
  const guide = document.createElement('p');
  guide.className = 'guide-text';
  guide.textContent = trophy.guide;
  pane.appendChild(guide);

  const unknown = trophy.guide.startsWith('Currently unknown');
  if (unknown) {
    const note = document.createElement('p');
    note.className = 'unknown';
    note.textContent = 'Honesty note: this trophy has no verified unlock yet (the game released 19 Nov 2026). The guide above is the current state of the public guides — check the sources for updates.';
    pane.appendChild(note);
  }

  const srcHead = document.createElement('h3');
  srcHead.textContent = 'Sources';
  pane.appendChild(srcHead);
  const srcList = document.createElement('ul');
  srcList.className = 'source-list-detail';
  for (const s of trophy.sources) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = s.url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = s.label;
    li.appendChild(a);
    srcList.appendChild(li);
  }
  pane.appendChild(srcList);

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'earn-btn' + (earned.has(trophy.id) ? ' earned' : '');
  btn.textContent = earned.has(trophy.id) ? '✓ Earned — click to unmark' : 'Mark as earned';
  btn.addEventListener('click', () => onToggle(trophy.id, !earned.has(trophy.id)));
  pane.appendChild(btn);
}
