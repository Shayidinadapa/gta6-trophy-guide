// Renders the roadmap stages and the missables page from the trophy data.
import { gradeLabel } from './data.js';

const STAGES = [
  {
    num: 1,
    title: 'Play the story — and mind Chapter 1',
    time: 'Chapters 1–5 · 60–80 hours',
    points: [
      'Play the 5 chapters and all main missions. Every chapter and mission trophy is automatic and cannot be missed.',
      'Do the first meditation in Chapter 1, at Jason’s house, before you move on — it is the only potentially missable trophy (Positive Mental Attitude).',
      'Scan vehicles and study animals as you travel (WAiNK app, binoculars): 200 vehicle models and 100 animals count toward the 100% checklist later.',
      'Start character questlines as they appear (Andy, Kenton, Billy, Randy, Tyrone, Bret) — they all stay available after the story.',
      'Keep a manual save at the start and end of every chapter. There is no mission replay and no New Game+, and you have 15 manual slots plus 1 autosave.',
    ],
  },
  {
    num: 2,
    title: 'The 100% checklist',
    time: 'After the story · about 100 hours',
    points: [
      'The checklist unlocks after the story (Progress > Stats > 100% Completion). Progress from the story already counts.',
      'It is lenient — close to 60% true completion: any 100 optional missions (200–300+ exist), any 70 of 80 challenges, 300 stunts, 200 vehicles scanned, 100 animals studied.',
      'Finish the count trophies here: 250 stunts, 42 shooting-range gold medals, 14 drone races, 20 race wins, 3 card sets, 100 WAiNK scans, 100 vehicles scanned, 50 challenges, 5 large banks robbed, 1 operation per gang, 500 Criminal Profile actions, $250,000 laundered, $100,000 spent, 8 garages bought, 10 vehicles registered, the whole map explored.',
      'The hardest trophy in the set, A Long Road, pops when the checklist hits 100%.',
    ],
  },
  {
    num: 3,
    title: 'Cleanup — strangers, one-offs and secrets',
    time: 'Free-roam · about 10 hours',
    points: [
      'Finish the 8 Strangers & Freaks strands that count (Kirk, Kyle, Yago, Pilot Pete and more — Moses, Tyrone, Yasmani, Andy, Billy and Eddie do not count).',
      'Sweep the one-off stunts: 4-star wanted escape as a couple, 3 shops in one wanted level, 5 kills in one Combat Focus, plane from a departure terminal, military tank, silent jewelry store, armored truck, 3 valuables at Kingpin Bowling, max Strength with both characters.',
      'Check the five trophies still listed as currently unknown — their unlocks may be published after launch. Do not trust an unverified method.',
      'When the last trophy pops, the platinum — Vice Got a Price! — follows on its own.',
    ],
  },
];

export function renderRoadmap(trophies) {
  const host = document.getElementById('roadmapStages');
  host.innerHTML = '';
  for (const stage of STAGES) {
    const div = document.createElement('div');
    div.className = 'stage';
    const head = document.createElement('div');
    head.className = 'stage-head';
    const num = document.createElement('span');
    num.className = 'stage-num';
    num.textContent = stage.num;
    head.appendChild(num);
    const title = document.createElement('h3');
    title.textContent = stage.title;
    head.appendChild(title);
    const time = document.createElement('span');
    time.className = 'stage-time';
    time.textContent = stage.time;
    head.appendChild(time);
    div.appendChild(head);
    const ul = document.createElement('ul');
    for (const point of stage.points) {
      const li = document.createElement('li');
      li.textContent = point;
      ul.appendChild(li);
    }
    div.appendChild(ul);
    const names = trophies
      .filter((t) => t.stage === stage.num)
      .map((t) => t.name)
      .join(', ');
    const stageTrophies = document.createElement('p');
    stageTrophies.className = 'stage-trophies';
    stageTrophies.textContent = 'Trophies in this stage: ' + names + '.';
    div.appendChild(stageTrophies);
    host.appendChild(div);
  }
}

export function renderMissables(trophies) {
  const host = document.getElementById('missableList');
  host.innerHTML = '';
  const missable = trophies.filter((t) => t.missable);
  for (const t of missable) {
    const card = document.createElement('div');
    card.className = 'missable-card';
    const h = document.createElement('h3');
    h.textContent = '⚠ ' + t.name + ' — ' + gradeLabel(t.grade);
    card.appendChild(h);
    const p = document.createElement('p');
    p.textContent = t.guide;
    card.appendChild(p);
    const src = document.createElement('p');
    src.textContent = 'Sources: ' + t.sources.map((s) => s.label).join(' · ') + '.';
    card.appendChild(src);
    host.appendChild(card);
  }
  if (missable.length === 0) {
    const p = document.createElement('p');
    p.textContent = 'No trophy in the data is flagged missable.';
    host.appendChild(p);
  }
}
