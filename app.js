// =========================================
//   MUGISUB — app.js
//   JavaScript for anime subtitle site
// =========================================

// ─── MODAL DATA ───
const animeData = {
  'solo-leveling-s2': {
    title: 'Solo Leveling Season 2',
    img: 'https://cdn.myanimelist.net/images/anime/1079/138081.jpg',
    meta: 'Ep 1–9 · ASS + SRT · 1080p · Urdu Styled',
    episodes: [
      { num: 'Episode 01 — "The Shadow Monarch"', size: '8.2 MB' },
      { num: 'Episode 02 — "Return of the Hunters"', size: '8.4 MB' },
      { num: 'Episode 03 — "Shadow Army Rises"', size: '7.9 MB' },
      { num: 'Episode 04 — "Gates of Chaos"', size: '8.1 MB' },
      { num: 'Episode 05 — "The Monarch\'s Power"', size: '8.6 MB' },
      { num: 'Episode 06 — "Sung Jin-Woo vs Dragon"', size: '8.0 MB' },
      { num: 'Episode 07 — "Absolute Domain"', size: '8.3 MB' },
      { num: 'Episode 08 — "Beru Awakens"', size: '8.7 MB' },
      { num: 'Episode 09 — "The Final Shadow"', size: '8.5 MB' },
    ]
  },
  'berserk-2025': {
    title: 'Berserk (2025)',
    img: 'https://cdn.myanimelist.net/images/anime/1870/120219.jpg',
    meta: 'Ep 1–6 · ASS · 1080p · Urdu',
    episodes: [
      { num: 'Episode 01 — "The Black Swordsman"', size: '9.1 MB' },
      { num: 'Episode 02 — "Band of the Hawk"', size: '8.8 MB' },
      { num: 'Episode 03 — "The Battle for Doldrey"', size: '9.3 MB' },
      { num: 'Episode 04 — "Casca"', size: '8.9 MB' },
      { num: 'Episode 05 — "Eclipse"', size: '9.5 MB' },
      { num: 'Episode 06 — "Hellfire"', size: '9.0 MB' },
    ]
  }
};

// ─── SHOW MODAL ───
function showModal(animeKey) {
  const overlay = document.getElementById('modalOverlay');
  const data = animeData[animeKey];
  if (!data) return;

  document.getElementById('modalImg').src = data.img;
  document.getElementById('modalTitle').textContent = data.title;
  document.getElementById('modalMeta').textContent = data.meta;

  // Build episode list
  const epList = document.getElementById('episodeList');
  epList.innerHTML = '';
  data.episodes.forEach(ep => {
    const row = document.createElement('div');
    row.className = 'ep-row';
    row.innerHTML = `
      <span class="ep-num">${ep.num}</span>
      <span class="ep-size">${ep.size}</span>
      <div class="ep-btns">
        <a href="#" class="ep-dl">ASS ⬇</a>
        <a href="#" class="ep-dl srt">SRT ⬇</a>
      </div>
    `;
    epList.appendChild(row);
  });

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

// ─── CLOSE MODAL ───
function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

// Close modal with Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

// ─── FILTER CARDS ───
function filterCards(btn, genre) {
  // Update active pill
  document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');

  // Filter anime cards
  document.querySelectorAll('.anime-card').forEach(card => {
    const cardGenres = card.dataset.genre || '';
    if (genre === 'all' || cardGenres.includes(genre)) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });
}

// ─── SEARCH ───
function doSearch() {
  const query = document.getElementById('searchInput').value.toLowerCase().trim();
  if (!query) {
    document.querySelectorAll('.anime-card').forEach(c => c.classList.remove('hidden'));
    return;
  }
  document.querySelectorAll('.anime-card').forEach(card => {
    const name = card.dataset.name || '';
    if (name.includes(query)) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });
}

// Search on Enter key
document.getElementById('searchInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') doSearch();
});

// Live search
document.getElementById('searchInput').addEventListener('input', () => {
  const query = document.getElementById('searchInput').value.toLowerCase().trim();
  if (!query) {
    document.querySelectorAll('.anime-card').forEach(c => c.classList.remove('hidden'));
    return;
  }
  document.querySelectorAll('.anime-card').forEach(card => {
    const name = card.dataset.name || '';
    card.classList.toggle('hidden', !name.includes(query));
  });
});

// ─── SMOOTH SCROLL for nav links ───
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href').slice(1);
    if (!id) return;
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ─── SCROLL REVEAL ANIMATION ───
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.anime-card, .batch-row, .tool-card, .about-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
  observer.observe(el);
});

// ─── HERO CARD CLICK → scroll to anime ───
document.querySelectorAll('.hero-card').forEach(card => {
  card.addEventListener('click', () => {
    document.getElementById('ongoing').scrollIntoView({ behavior: 'smooth' });
  });
});

console.log('%cMugiSUB loaded 🎌', 'color:#e63946;font-size:18px;font-weight:bold;');
