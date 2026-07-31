/* ── Carousel ── */
const cards     = [...document.querySelectorAll('.card')];
const dots      = [...document.querySelectorAll('.dot')];
const leftArrow  = document.querySelector('.carousel-arrow.left');
const rightArrow = document.querySelector('.carousel-arrow.right');
const TOTAL = 7;
let current = 1, animating = false;  // start at 1 → all 3 cards visible from the start

/*  offset → CSS position class  (7 cards need 7 slots)
    0=center  1=right  2=off-right  3=hidden  4=hidden  5=off-left  6=left   */
const POS = ['pos-center','pos-right','pos-off-right','pos-hidden','pos-hidden','pos-off-left','pos-left'];
const ALL_POS = [...POS, 'landing', 'from-right', 'from-left'];

function updateArrows() {
  /* Standard direction: right = next (current+1), left = previous (current-1) */
  rightArrow.disabled = (current === TOTAL - 1);
  leftArrow.disabled  = (current === 0);
}

function updateCarousel(dir) {
  /*  dir = +1 → right arrow (current++) → right card becomes center, from-right
      dir = -1 → left  arrow (current--) → left  card becomes center, from-left
      dir =  0 → init, no animation                                              */
  const newCenter = cards.find((_, i) => (i - current + TOTAL) % TOTAL === 0);
  const isStart   = current === 0;          // no left card
  const isEnd     = current === TOTAL - 1;  // no right card

  cards.forEach((card, i) => {
    const offset = (i - current + TOTAL) % TOTAL;
    card.classList.remove(...ALL_POS);
    card.style.zIndex = '';

    if (card === newCenter && dir !== 0) {
      /* Landing animation: from right when dir=+1, from left when dir=-1 */
      const fromClass = dir > 0 ? 'from-right' : 'from-left';
      card.classList.add('pos-center', 'landing', fromClass);
      card.addEventListener('animationend', () => {
        card.classList.remove('landing', 'from-right', 'from-left');
        animating = false;
      }, { once: true });
    } else {
      let posClass = POS[offset];
      if (offset === 6 && isStart) posClass = 'pos-hidden';     // no left card at start
      if (offset === 1 && isEnd)   posClass = 'pos-off-right';  // no right card at end
      card.classList.add(posClass);
      if (dir !== 0 && offset !== 0) {
        card.style.zIndex = '0';
        setTimeout(() => { card.style.zIndex = ''; }, 560);
      }
    }
  });

  updateArrows();
  dots.forEach((d, i) => d.classList.toggle('active', i === current));
}

function goTo(idx) {
  if (animating) return;
  const next = Math.max(0, Math.min(TOTAL - 1, idx));
  if (next === current) return;
  const diff = next - current;
  animating = true;
  current = next;
  updateCarousel(Math.sign(diff));
}

/* Right → next (current+1), Left → previous (current-1) */
rightArrow.addEventListener('click', () => goTo(current + 1));
leftArrow.addEventListener('click',  () => goTo(current - 1));
dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));

updateCarousel(0); // initialise without animation

/* ── Page search ── */
const searchOverlay = document.getElementById('searchOverlay');
const searchInput   = document.getElementById('searchInput');
const searchCount   = document.getElementById('searchCount');
const searchClose   = document.getElementById('searchClose');
const searchToggle  = document.getElementById('searchToggle');

function openSearch() {
  searchOverlay.classList.add('open');
  searchInput.focus();
  searchInput.select();
}
function closeSearch() {
  searchOverlay.classList.remove('open');
  clearHighlights();
  searchCount.textContent = '';
  searchInput.value = '';
}

searchToggle.addEventListener('click', openSearch);
searchClose.addEventListener('click', closeSearch);
searchOverlay.addEventListener('click', e => { if (e.target === searchOverlay) closeSearch(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSearch(); });

function clearHighlights() {
  document.querySelectorAll('mark.search-hl').forEach(m => {
    m.replaceWith(...m.childNodes);
  });
  document.body.normalize();
}

function highlightText(query) {
  clearHighlights();
  if (!query) { searchCount.textContent = ''; return; }
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const el = node.parentElement;
      if (!el || el.closest('#searchOverlay, header, script, style')) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);

  const re = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
  let count = 0;
  nodes.forEach(node => {
    if (!re.test(node.textContent)) return;
    re.lastIndex = 0;
    const frag = document.createDocumentFragment();
    let last = 0, match;
    while ((match = re.exec(node.textContent)) !== null) {
      frag.appendChild(document.createTextNode(node.textContent.slice(last, match.index)));
      const mark = document.createElement('mark');
      mark.className = 'search-hl';
      mark.textContent = match[0];
      frag.appendChild(mark);
      last = match.index + match[0].length;
      count++;
    }
    frag.appendChild(document.createTextNode(node.textContent.slice(last)));
    node.parentNode.replaceChild(frag, node);
  });

  const first = document.querySelector('mark.search-hl');
  if (first) first.scrollIntoView({ behavior:'smooth', block:'center' });
  searchCount.textContent = count > 0 ? `${count} resultaat${count === 1 ? '' : 'en'} gevonden` : 'Geen resultaten';
}

searchInput.addEventListener('input', () => highlightText(searchInput.value.trim()));

/* ── Contact popup ── */
const contactOverlay = document.getElementById('contactOverlay');
const contactClose   = document.getElementById('contactClose');
const contactForm    = document.getElementById('contactForm');
const contactThanks  = document.getElementById('contactThanks');
const ctaContact     = document.getElementById('ctaContact');

function openContact() { contactOverlay.classList.add('open'); }
function closeContact() {
  contactOverlay.classList.remove('open');
  setTimeout(() => {
    contactForm.style.display = '';
    contactThanks.style.display = 'none';
    contactForm.reset();
  }, 280);
}

ctaContact.addEventListener('click', e => { e.preventDefault(); openContact(); });
contactClose.addEventListener('click', closeContact);
contactOverlay.addEventListener('click', e => { if (e.target === contactOverlay) closeContact(); });

contactForm.addEventListener('submit', e => {
  e.preventDefault();
  contactForm.style.display = 'none';
  contactThanks.style.display = 'block';
});

/* ── Scroll: reveal "Ateljee Mir" in nav when header leaves view ── */
const siteHeader = document.querySelector('header');
const navEl = document.querySelector('nav');
new IntersectionObserver(
  entries => navEl.classList.toggle('nav-scrolled', !entries[0].isIntersecting),
  { threshold: 0 }
).observe(siteHeader);

/* ── Behold widget: show when loaded, hide placeholder ── */
(function() {
  const widget = document.querySelector('behold-widget');
  const placeholder = document.getElementById('instaPlaceholder');
  const overlay = document.querySelector('.insta-ph-overlay');
  if (!widget) return;
  const feedId = widget.getAttribute('feed-id');
  if (feedId && feedId !== 'YOUR_FEED_ID') {
    widget.style.display = 'block';
    widget.addEventListener('load', () => {
      if (placeholder) placeholder.style.display = 'none';
      if (overlay) overlay.style.display = 'none';
    });
  }
})();

/* ── Over Miriam popup ── */
const miriamOverlay = document.getElementById('miriamOverlay');
const miriamClose   = document.getElementById('miriamClose');
const miriamToggle  = document.getElementById('miriamToggle');
const titleStar     = document.getElementById('titleStar');

function openMiriam() { miriamOverlay.classList.add('open'); }
function closeMiriam() { miriamOverlay.classList.remove('open'); }

miriamToggle.addEventListener('click', openMiriam);
titleStar.addEventListener('click', openMiriam);
const navBrandStar = document.getElementById('navBrandStar');
if (navBrandStar) navBrandStar.addEventListener('click', e => { e.stopPropagation(); openMiriam(); });
miriamClose.addEventListener('click', closeMiriam);
miriamOverlay.addEventListener('click', e => { if (e.target === miriamOverlay) closeMiriam(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMiriam(); });
