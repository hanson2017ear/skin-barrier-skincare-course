'use strict';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const normalize = value => value.toLocaleLowerCase().replace(/(\d)\s*(?=[年月日])/g, '$1').replace(/([年月])\s*(?=\d)/g, '$1');
function bindSearch(inputId, selector, statusId, emptyId, noun, extra = () => true) {
  const input = document.getElementById(inputId);
  const items = [...document.querySelectorAll(selector)];
  const update = () => {
    const terms = normalize(input.value.trim()).split(/\s+/).filter(Boolean);
    let count = 0;
    for (const item of items) {
      const matches = terms.every(term => normalize(item.dataset.search).replace(/\s+/g, '').includes(term)) && extra(item);
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
const updateLessons = bindSearch('lesson-search', '.lesson', 'lesson-count', 'no-lessons', '个专题', item => activeDate === 'all' || item.dataset.dates.split(' ').includes(activeDate));
const dateButtons = [...document.querySelectorAll('[data-date-filter]')];
function selectDate(date) {
  activeDate = date;
  for (const button of dateButtons) button.setAttribute('aria-pressed', String(button.dataset.dateFilter === date));
  const notes = {
    all:'9月15日和22日共用三个专题；10月20日为化妆品专题，抗老化日期待核。',
    '2026-09-15':'龚子鉴老师前两次课的合并笔记，共三个专题，未逐日划分。',
    '2026-09-22':'龚子鉴老师前两次课的合并笔记，共三个专题，未逐日划分。',
    '2026-09-29':'夏悦老师：常见损容性皮肤病。',
    '2026-10-20':'张云青老师：化妆品与合理选用。',
    unassigned:'皮肤老化与科学抗衰专题，授课老师及日期待确认。'
  };
  document.getElementById('date-filter-note').textContent = notes[date];
  updateLessons();
}
for (const button of dateButtons) button.addEventListener('click', () => selectDate(button.dataset.dateFilter));
document.getElementById('reset-lessons').addEventListener('click', () => {
  document.getElementById('lesson-search').value = '';
  selectDate('all');
});
bindSearch('reference-search', '.reference', 'ref-count', 'no-references', '篇文献');

function revealTarget() {
  let id;
  try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
  const target = id && document.getElementById(id);
  if (target && target.matches('.lesson')) {
    document.getElementById('lesson-search').value = '';
    selectDate('all');
    target.querySelector('.lesson-detail').open = true;
  }
}
window.addEventListener('hashchange', revealTarget);
revealTarget();

const menu = document.getElementById('mobile-menu');
const menuButton = document.querySelector('.menu-toggle');
function closeMenu() {
  menu.classList.remove('is-open');
  menu.close();
  document.body.classList.remove('menu-open');
  menuButton.setAttribute('aria-expanded','false');
}
menuButton.addEventListener('click', () => {
  menuButton.setAttribute('aria-expanded','true');
  document.body.classList.add('menu-open');
  menu.showModal();
  requestAnimationFrame(() => menu.classList.add('is-open'));
});
menu.querySelector('.menu-close').addEventListener('click',closeMenu);
menu.addEventListener('cancel', event => { event.preventDefault(); closeMenu(); });
for (const a of menu.querySelectorAll('a')) a.addEventListener('click',closeMenu);
const desktop = window.matchMedia('(min-width: 768px)');
desktop.addEventListener('change', event => { if (event.matches && menu.open) closeMenu(); });

const nav = document.querySelector('.site-nav');
new ResizeObserver(() => document.documentElement.style.setProperty('--nav-height', `${nav.offsetHeight + 32}px`)).observe(nav);
const navObserver = new IntersectionObserver(entries => {
  for (const entry of entries) if (entry.isIntersecting) {
    for (const a of document.querySelectorAll('.nav-link')) {
      if (a.hash === '#'+entry.target.id) a.setAttribute('aria-current','location');
      else a.removeAttribute('aria-current');
    }
  }
},{rootMargin:'-15% 0px -65% 0px',threshold:0});
for (const section of document.querySelectorAll('[data-nav]')) navObserver.observe(section);

const image = document.getElementById('hero-motion');
const motionButton = document.getElementById('motion-toggle');
let wantsMotion = !reduceMotion.matches;
let mediaVisible = false;
function renderMotion() {
  const next = wantsMotion && mediaVisible ? image.dataset.animation : image.dataset.poster;
  if (image.getAttribute('src') !== next) image.src = next;
  motionButton.textContent = wantsMotion ? '暂停动画' : '播放动画';
}
motionButton.hidden = false;
motionButton.addEventListener('click', () => { wantsMotion = !wantsMotion; renderMotion(); });
new IntersectionObserver(entries => { mediaVisible = entries[0].isIntersecting; renderMotion(); },{threshold:0.08}).observe(image);

if (!reduceMotion.matches) {
  const reveals = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) {
      entry.target.classList.add('is-revealed');
      reveals.unobserve(entry.target);
    }
  },{threshold:0.04});
  const words = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) {
      const index = Number(entry.target.dataset.wordIndex);
      entry.target.style.transitionDelay = `${index * 70}ms`;
      entry.target.classList.add('is-active');
      words.unobserve(entry.target);
    }
  },{rootMargin:'0px 0px -18% 0px',threshold:0.6});
  document.documentElement.classList.add('motion-ready');
  for (const section of document.querySelectorAll('[data-reveal]')) reveals.observe(section);
  [...document.querySelectorAll('.principle .word')].forEach((word,index) => {word.dataset.wordIndex=index;words.observe(word);});
}
reduceMotion.addEventListener('change', event => {
  if (event.matches) { document.documentElement.classList.remove('motion-ready'); wantsMotion=false;renderMotion(); }
});
