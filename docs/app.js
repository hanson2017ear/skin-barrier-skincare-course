
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
