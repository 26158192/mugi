/*
 * MugiSUB - Request Form
 * Telegram + Google Sheets
 */

(function () {

  var TG_TOKEN   = '8735133783:AAEiP95_QdW0iG6O6gUDp2obc7YF5GFPx9w';
  var TG_CHAT_ID = '5529862652';
  var SHEETS_URL = 'https://script.google.com/macros/s/AKfycbxtycQ2Knwli51ZWei5DoSZeptGHkCOcDk2seKmRgur1d6gFr9Xyr2c5A_axZkfMKK4/exec';

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
    var d = data[cat.value] || data.anime;
    for (var i = 0; i < titleLabel.childNodes.length; i++) {
      if (titleLabel.childNodes[i].nodeType === 3) {
        titleLabel.childNodes[i].nodeValue = d.label + ' ';
        break;
      }
    }
    titleInput.placeholder = d.titlePlaceholder;
    noteInput.placeholder  = d.notePlaceholder;
  }

  function escMd(t) {
    return String(t).replace(/[_*[\]()~`>#+\-=|{}.!\\]/g, '\\$&');
  }

  function getTime() {
    return new Date().toLocaleString('en-PK', {
      timeZone:  'Asia/Karachi',
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  }

  function sendToTelegram(category, title, link, note) {
    var emoji    = { anime: '🎌', movie: '🎬', tv: '📺' };
    var catLabel = { anime: 'Anime', movie: 'Movie', tv: 'TV Show' };
    var msg = emoji[category] + ' *New ' + catLabel[category] + ' Request*\n';
    msg += '━━━━━━━━━━━━━━━━━━━━\n';
    msg += '📌 *Category:* ' + catLabel[category] + '\n';
    msg += '🎯 *Title:* ' + escMd(title) + '\n';
    if (link) msg += '🔗 *Link:* ' + escMd(link) + '\n';
    if (note) msg += '📝 *Note:*\n' + escMd(note) + '\n';
    msg += '━━━━━━━━━━━━━━━━━━━━\n';
    msg += '🕐 *Time:* ' + getTime() + '\n';
    msg += '📡 *Source:* MugiSUB Request Form';

    return fetch('https://api.telegram.org/bot' + TG_TOKEN + '/sendMessage', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id:    TG_CHAT_ID,
        text:       msg,
        parse_mode: 'MarkdownV2'
      })
    });
  }

  function sendToSheets(category, title, link, note) {
    var catLabel = { anime: 'Anime', movie: 'Movie', tv: 'TV Show' };
    return fetch(SHEETS_URL, {
      method:  'POST',
      mode:    'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: catLabel[category] || category,
        title:    title,
        link:     link || '',
        note:     note || '',
        time:     getTime()
      })
    });
  }

  function init() {
    var cat  = document.getElementById('req-category');
    var form = document.getElementById('request-form');
    if (!cat || !form) return;

    cat.addEventListener('change', update);
    cat.addEventListener('input',  update);
    update();

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      e.stopPropagation();

      var cat        = document.getElementById('req-category');
      var titleInput = document.getElementById('req-title');
      var noteInput  = document.getElementById('req-note');
      var linkEl     = form.querySelector('input[name="link"]');
      var btn        = form.querySelector('button[type="submit"]');

      var category = cat        ? cat.value.trim()        : 'anime';
      var title    = titleInput ? titleInput.value.trim() : '';
      var link     = linkEl     ? linkEl.value.trim()     : '';
      var note     = noteInput  ? noteInput.value.trim()  : '';

      if (!title) { if (titleInput) titleInput.focus(); return; }

      btn.disabled    = true;
      btn.textContent = 'Sending...';

      Promise.all([
        sendToTelegram(category, title, link, note),
        sendToSheets(category, title, link, note)
      ])
        .then(function () {
          btn.textContent      = '✓ Sent!';
          btn.style.background = '#2e7d4f';
          form.reset();
          update();
          setTimeout(function () {
            btn.disabled         = false;
            btn.textContent      = 'Submit Request';
            btn.style.background = '';
          }, 4000);
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