
'use strict';
function bindSearch(inputId, selector, statusId, emptyId, noun, extraMatch = () => true) {
  const input = document.getElementById(inputId);
  const items = [...document.querySelectorAll(selector)];
  const update = () => {
    const terms = input.value.trim().toLocaleLowerCase().replace(/(\d)\s*(?=[年月日])/g, '$1').replace(/([年月])\s*(?=\d)/g, '$1').split(/\s+/).filter(Boolean);
    let count = 0;
    for (const item of items) {
      const text = item.dataset.search.toLocaleLowerCase().replace(/\s+/g, '');
      const matches = terms.every(term => text.includes(term)) && extraMatch(item);
      item.hidden = !matches;
      if (matches) count++;
    }
    document.getElementById(statusId).textContent = `${count} ${noun}`;
    document.getElementById(emptyId).hidden = count > 0;
  };
  input.addEventListener('input', update);
  update();
  return update;
}
let activeDate = 'all';
const updateLessons = bindSearch('lesson-search', '.lesson', 'lesson-count', 'no-lessons', '个专题',
  item => activeDate === 'all' || item.dataset.dates.split(' ').includes(activeDate));
const dateButtons = [...document.querySelectorAll('[data-date-filter]')];
const dateNote = document.getElementById('date-filter-note');
function selectDate(date) {
  activeDate = date;
  for (const button of dateButtons) button.setAttribute('aria-pressed', String(button.dataset.dateFilter === date));
  dateNote.textContent = date === '2026-10-20'
    ? '10月20日课表列张云青老师；化妆品专题仅暂归此课，尚未核实。'
    : date === 'unassigned' ? '此专题的授课老师及日期均待核实。'
    : date === '2026-09-29' ? '9月29日夏悦老师的损容性皮肤病课件有署名和日期。'
    : date === 'all' ? '9月15日和22日共用3个专题；化妆品暂归10月20日，抗老化日期待核。'
    : '9月15日和22日共用3个专题，现有笔记未逐日划分。';
  updateLessons();
}
for (const button of dateButtons) button.addEventListener('click', () => selectDate(button.dataset.dateFilter));
document.getElementById('reset-lessons').addEventListener('click', () => {
  document.getElementById('lesson-search').value = '';
  selectDate('all');
});
bindSearch('reference-search', '.reference', 'ref-count', 'no-references', '篇文献');
// Deep links from references or shared notes should reveal their native disclosure.
function revealTarget() {
  const id = decodeURIComponent(location.hash.slice(1));
  const target = id && document.getElementById(id);
  if (target && target.matches('details.lesson')) target.open = true;
}
window.addEventListener('hashchange', revealTarget);
revealTarget();
const motionImage = document.getElementById('hero-motion');
const motionButton = document.getElementById('motion-toggle');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let playing = false;
function setMotion(play) {
  playing = play;
  motionImage.src = play ? motionImage.dataset.animation : motionImage.dataset.poster;
  motionButton.textContent = play ? '暂停动画' : '播放动画';
}
motionButton.hidden = false;
setMotion(!reducedMotion.matches);
motionButton.addEventListener('click', () => setMotion(!playing));
reducedMotion.addEventListener('change', event => { if (event.matches) setMotion(false); });
const header = document.querySelector('.site-header');
new ResizeObserver(() => document.documentElement.style.setProperty('--header-height', `${header.offsetHeight}px`)).observe(header);
