/*
 * MugiSUB - Request Form
 * Pure Vanilla JS + Telegram
 */

(function () {

  var TG_TOKEN   = 'YAHAN_APNA_BOT_TOKEN_DAALEN';
  var TG_CHAT_ID = 'YAHAN_APNA_CHAT_ID_DAALEN';

  var data = {
    anime: {
      label:            'Anime Title',
      titlePlaceholder: 'e.g. Demon Slayer Season 4',
      notePlaceholder:  'Season number, episode range, source (BD/WEB), ya koi aur detail...'
    },
    movie: {
      label:            'Movie Title',
      titlePlaceholder: 'e.g. Your Name (Kimi no Na wa)',
      notePlaceholder:  'Release year, language preference, ya koi aur detail...'
    },
    tv: {
      label:            'TV Show Title',
      titlePlaceholder: 'e.g. Attack on Titan Live Action',
      notePlaceholder:  'Season, episode count, network (Netflix/Crunchyroll etc.), ya koi detail...'
    }
  };

  function update() {
    var cat        = document.getElementById('req-category');
    var titleLabel = document.getElementById('req-title-label');
    var titleInput = document.getElementById('req-title');
    var noteInput  = document.getElementById('req-note');

    if (!cat || !titleLabel || !titleInput || !noteInput) return;

    var val = cat.value;
    var d   = data[val] || data.anime;

    for (var i = 0; i < titleLabel.childNodes.length; i++) {
      if (titleLabel.childNodes[i].nodeType === 3) {
        titleLabel.childNodes[i].nodeValue = d.label + ' ';
        break;
      }
    }
    titleInput.placeholder = d.titlePlaceholder;
    noteInput.placeholder  = d.notePlaceholder;
  }

  function init() {
    var cat  = document.getElementById('req-category');
    var form = document.getElementById('request-form');

    if (!cat || !form) return;

    cat.addEventListener('change', update);
    cat.addEventListener('input',  update);
    update();

    // ── Telegram ─────────────────────────────
    function buildMessage(category, title, link, note) {
      var emoji    = { anime: '🎌', movie: '🎬', tv: '📺' };
      var catLabel = { anime: 'Anime', movie: 'Movie', tv: 'TV Show' };
      var time     = new Date().toLocaleString('en-PK', {
        timeZone:  'Asia/Karachi',
        dateStyle: 'medium',
        timeStyle: 'short'
      });
      var msg = emoji[category] + ' *New ' + catLabel[category] + ' Request*\n';
      msg += '━━━━━━━━━━━━━━━━━━━━\n';
      msg += '📌 *Category:* ' + catLabel[category] + '\n';
      msg += '🎯 *Title:* ' + escMd(title) + '\n';
      if (link && link.trim()) msg += '🔗 *Link:* ' + escMd(link.trim()) + '\n';
      if (note && note.trim()) msg += '📝 *Note:*\n' + escMd(note.trim()) + '\n';
      msg += '━━━━━━━━━━━━━━━━━━━━\n';
      msg += '🕐 *Time:* ' + time + '\n';
      msg += '📡 *Source:* MugiSUB Request Form';
      return msg;
    }

    function escMd(t) {
      return String(t).replace(/[_*[\]()~`>#+\-=|{}.!\\]/g, '\\$&');
    }

    function sendToTelegram(msg) {
      return fetch('https://api.telegram.org/bot' + TG_TOKEN + '/sendMessage', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: TG_CHAT_ID, text: msg, parse_mode: 'MarkdownV2' })
      });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var cat        = document.getElementById('req-category');
      var titleInput = document.getElementById('req-title');
      var noteInput  = document.getElementById('req-note');
      var linkEl     = form.querySelector('input[name="link"]');
      var btn        = form.querySelector('button[type="submit"]');

      var category = cat ? cat.value : 'anime';
      var title    = titleInput ? titleInput.value.trim() : '';
      var link     = linkEl ? linkEl.value : '';
      var note     = noteInput ? noteInput.value.trim() : '';

      if (!title) { if (titleInput) titleInput.focus(); return; }

      btn.disabled    = true;
      btn.textContent = 'Sending...';

      sendToTelegram(buildMessage(category, title, link, note))
        .then(function (r) { return r.json(); })
        .then(function (j) {
          if (j.ok) {
            btn.textContent      = '✓ Request Sent!';
            btn.style.background = '#2e7d4f';
            form.reset();
            update();
            setTimeout(function () {
              btn.disabled         = false;
              btn.textContent      = 'Submit Request';
              btn.style.background = '';
            }, 4000);
          } else throw new Error(j.description);
        })
        .catch(function (err) {
          console.error('MugiSUB:', err);
          btn.disabled    = false;
          btn.textContent = 'Submit Request';
          alert('Request send nahi ho saki. Dobara try karein.');
        });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

}());