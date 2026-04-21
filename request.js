/*
 * MugiSUB - Request Form
 * Pure Vanilla JS
 * Telegram Bot Integration Added
 */

(function () {

  // ============================================================
  //  TELEGRAM CONFIG — Yahan apni values daalen
  // ============================================================
  var TG_TOKEN   = 'YAHAN_APNA_BOT_TOKEN_DAALEN';   // BotFather se mila token
  var TG_CHAT_ID = 'YAHAN_APNA_CHAT_ID_DAALEN';     // @userinfobot se mila ID
  // ============================================================

  var cat        = document.getElementById('req-category');
  var titleLabel = document.getElementById('req-title-label');
  var titleInput = document.getElementById('req-title');
  var noteInput  = document.getElementById('req-note');
  var form       = document.getElementById('request-form');

  if (!cat || !titleLabel || !titleInput || !noteInput || !form) return;

  // ── Category data (original — kuch nahi badla) ──────────────
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
    var val = cat.value;
    var d   = data[val] || data.anime;
    titleLabel.childNodes[0].nodeValue = d.label + ' ';
    titleInput.placeholder = d.titlePlaceholder;
    noteInput.placeholder  = d.notePlaceholder;
  }

  cat.addEventListener('change', update);
  update();
  // ── Original code end ────────────────────────────────────────


  // ── Telegram message format ──────────────────────────────────
  function buildMessage(category, title, link, note) {

    var emoji    = { anime: '🎌', movie: '🎬', tv: '📺' };
    var catLabel = { anime: 'Anime', movie: 'Movie', tv: 'TV Show' };
    var time     = new Date().toLocaleString('en-PK', {
      timeZone:   'Asia/Karachi',
      dateStyle:  'medium',
      timeStyle:  'short'
    });

    var msg = '';
    msg += emoji[category] + ' *New ' + catLabel[category] + ' Request*\n';
    msg += '━━━━━━━━━━━━━━━━━━━━\n';
    msg += '📌 *Category:* ' + catLabel[category] + '\n';
    msg += '🎯 *Title:* ' + escMd(title) + '\n';

    if (link && link.trim() !== '') {
      msg += '🔗 *Link:* ' + escMd(link.trim()) + '\n';
    }

    if (note && note.trim() !== '') {
      msg += '📝 *Note:*\n' + escMd(note.trim()) + '\n';
    }

    msg += '━━━━━━━━━━━━━━━━━━━━\n';
    msg += '🕐 *Time:* ' + time + '\n';
    msg += '📡 *Source:* MugiSUB Request Form';

    return msg;
  }

  // Markdown v2 special chars escape karna
  function escMd(text) {
    return String(text).replace(/[_*[\]()~`>#+\-=|{}.!\\]/g, '\\$&');
  }

  // ── Telegram pe send karna ───────────────────────────────────
  function sendToTelegram(message) {
    var url = 'https://api.telegram.org/bot' + TG_TOKEN + '/sendMessage';
    return fetch(url, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id:    TG_CHAT_ID,
        text:       message,
        parse_mode: 'MarkdownV2'
      })
    });
  }

  // ── Submit handler ───────────────────────────────────────────
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var category = cat.value;
    var title    = titleInput.value.trim();
    var link     = form.querySelector('input[name="link"]')
                     ? form.querySelector('input[name="link"]').value
                     : '';
    var note     = noteInput.value.trim();
    var btn      = form.querySelector('button[type="submit"]');

    if (!title) {
      titleInput.focus();
      return;
    }

    // Button disable — double submit rokne ke liye
    btn.disabled    = true;
    btn.textContent = 'Sending...';

    var message = buildMessage(category, title, link, note);

    sendToTelegram(message)
      .then(function (res) { return res.json(); })
      .then(function (json) {
        if (json.ok) {
          // Success
          btn.textContent = '✓ Request Sent!';
          btn.style.background = '#2e7d4f';
          form.reset();
          update(); // placeholders reset
          setTimeout(function () {
            btn.disabled         = false;
            btn.textContent      = 'Submit Request';
            btn.style.background = '';
          }, 4000);
        } else {
          throw new Error(json.description || 'Telegram error');
        }
      })
      .catch(function (err) {
        console.error('MugiSUB Request Error:', err);
        btn.disabled    = false;
        btn.textContent = 'Submit Request';
        alert('Request send nahi ho saki. Dobara try karein.');
      });
  });

}());