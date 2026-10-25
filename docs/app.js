
'use strict';
function bindSearch(inputId, selector, statusId, emptyId, noun) {
  const input = document.getElementById(inputId);
  const items = [...document.querySelectorAll(selector)];
  const update = () => {
    const terms = input.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    let count = 0;
    for (const item of items) {
      const text = item.dataset.search.toLocaleLowerCase();
      const matches = terms.every(term => text.includes(term));
      item.hidden = !matches;
      if (matches) count++;
    }
    document.getElementById(statusId).textContent = `${count} ${noun}`;
    document.getElementById(emptyId).hidden = count > 0;
  };
  input.addEventListener('input', update);
  update();
}
bindSearch('lesson-search', '.lesson', 'lesson-count', 'no-lessons', '个专题');
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
