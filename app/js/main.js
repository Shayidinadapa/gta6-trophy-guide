// Boot: loads data, wires the tabs, toolbar, detail pane and progress store.
import { loadTrophies } from './data.js';
import { loadProgress, saveProgress, applyDemo, exportProgress, importProgressFile } from './store.js';
import { createFilterState, applyFilters } from './filters.js';
import { renderProgress, renderList } from './render-list.js';
import { renderDetail } from './render-detail.js';
import { renderRoadmap, renderMissables } from './render-roadmap.js';

const state = createFilterState();
let trophies = [];
let earned = new Set();
let selectedId = null;

function refresh() {
  const filtered = applyFilters(trophies, state, earned);
  renderProgress(trophies, earned);
  renderList(filtered, state, earned, selectedId, toggleEarned, selectTrophy);
  const selected = trophies.find((t) => t.id === selectedId) || null;
  renderDetail(selected, earned, toggleEarned);
}

function toggleEarned(id, value) {
  if (value) earned.add(id);
  else earned.delete(id);
  saveProgress(earned);
  refresh();
}

function selectTrophy(id) {
  selectedId = id;
  const filtered = applyFilters(trophies, state, earned);
  renderList(filtered, state, earned, selectedId, toggleEarned, selectTrophy);
  const selected = trophies.find((t) => t.id === selectedId) || null;
  renderDetail(selected, earned, toggleEarned);
}

function showView(name) {
  for (const btn of document.querySelectorAll('.tab')) {
    btn.classList.toggle('active', btn.dataset.view === name);
  }
  for (const view of document.querySelectorAll('.view')) {
    view.hidden = view.id !== 'view-' + name;
  }
}

function currentView() {
  const active = document.querySelector('.tab.active');
  return active ? active.dataset.view : 'list';
}

async function boot() {
  trophies = await loadTrophies();
  const params = new URLSearchParams(location.search);
  const validIds = new Set(trophies.map((t) => t.id));

  earned = loadProgress();
  if (params.has('demo')) {
    earned = applyDemo();
  }

  const spoilerParam = params.get('spoilers');
  if (spoilerParam === 'on' || spoilerParam === 'off') {
    state.spoilersHidden = spoilerParam === 'on';
  } else {
    state.spoilersHidden = localStorage.getItem('leonida-legend-spoilers') === 'on';
  }

  const trophyParam = parseInt(params.get('trophy') || '', 10);
  if (validIds.has(trophyParam)) selectedId = trophyParam;
  else if (params.has('demo')) selectedId = 28; // Positive Mental Attitude, the missable one.
  else selectedId = trophies[0] ? trophies[0].id : null;

  const hash = location.hash.replace('#', '');
  if (['list', 'roadmap', 'missables', 'sources'].includes(hash)) showView(hash);
  if (hash.startsWith('trophy-')) {
    const id = parseInt(hash.slice(7), 10);
    if (validIds.has(id)) selectedId = id;
    showView('list');
  }

  renderRoadmap(trophies);
  renderMissables(trophies);
  refresh();

  // Tabs.
  for (const btn of document.querySelectorAll('.tab')) {
    btn.addEventListener('click', () => {
      showView(btn.dataset.view);
      history.replaceState(null, '', '#' + btn.dataset.view);
    });
  }

  // Toolbar: search.
  document.getElementById('searchInput').addEventListener('input', (e) => {
    state.query = e.target.value;
    refresh();
  });

  // Toolbar: kind chips.
  for (const chip of document.querySelectorAll('#kindChips .chip')) {
    chip.addEventListener('click', () => {
      state.kind = chip.dataset.kind;
      for (const c of document.querySelectorAll('#kindChips .chip')) {
        c.classList.toggle('active', c === chip);
      }
      refresh();
    });
  }

  // Toolbar: grade select.
  document.getElementById('gradeSelect').addEventListener('change', (e) => {
    state.grade = e.target.value;
    refresh();
  });

  // Toolbar: spoiler toggle.
  const spoilerToggle = document.getElementById('spoilerToggle');
  spoilerToggle.checked = state.spoilersHidden;
  spoilerToggle.addEventListener('change', () => {
    state.spoilersHidden = spoilerToggle.checked;
    localStorage.setItem('leonida-legend-spoilers', state.spoilersHidden ? 'on' : 'off');
    refresh();
  });

  // Data actions: export / import / reset.
  document.getElementById('exportBtn').addEventListener('click', () => exportProgress(earned));
  document.getElementById('importInput').addEventListener('change', async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    try {
      earned = await importProgressFile(file, validIds);
      saveProgress(earned);
      refresh();
      alert('Progress imported: ' + earned.size + ' trophies earned.');
    } catch (err) {
      alert('Could not import that file: ' + err.message);
    }
    e.target.value = '';
  });
  document.getElementById('resetBtn').addEventListener('click', () => {
    if (!confirm('Reset all progress? This clears every tick on this device.')) return;
    earned = new Set();
    saveProgress(earned);
    refresh();
  });
}

boot().catch((err) => {
  document.getElementById('trophyList').innerHTML =
    '<li class="trophy-row"><div class="trophy-body"><p class="trophy-name">Could not load the trophy list</p><p class="trophy-desc">' + err.message + '</p></div></li>';
});
