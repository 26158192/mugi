(function () {
  var cat = document.getElementById('req-category');
  var titleLabel = document.getElementById('req-title-label');
  var titleInput = document.getElementById('req-title');
  var noteInput = document.getElementById('req-note');

  if (!cat || !titleLabel || !titleInput || !noteInput) return;

  var data = {
    anime: {
      label: 'Anime Title',
      titlePlaceholder: 'e.g. Demon Slayer Season 4',
      notePlaceholder: 'Season number, episode range, source (BD/WEB), ya koi aur detail...'
    },
    movie: {
      label: 'Movie Title',
      titlePlaceholder: 'e.g. Your Name (Kimi no Na wa)',
      notePlaceholder: 'Release year, language preference, ya koi aur detail...'
    },
    tv: {
      label: 'TV Show Title',
      titlePlaceholder: 'e.g. Attack on Titan Live Action',
      notePlaceholder: 'Season, episode count, network (Netflix/Crunchyroll etc.), ya koi detail...'
    }
  };

  function update() {
    var val = cat.value;
    var d = data[val] || data.anime;
    titleLabel.childNodes[0].nodeValue = d.label + ' ';
    titleInput.placeholder = d.titlePlaceholder;
    noteInput.placeholder = d.notePlaceholder;
  }

  cat.addEventListener('change', update);
  update();

  // ── WYSIBB block: req-note pe initialize na ho ──
  function blockWysibb() {
    var textarea = document.getElementById('req-note');
    if (!textarea) return;

    // Mobile pe keyboard dismiss hone se bachao —
    // agar textarea focused hai to cssText mat chheo
    if (document.activeElement === textarea) return;

    if (typeof jQuery !== 'undefined') {
      try { jQuery(textarea).wysibb('destroy'); } catch (e) {}
      var parent = textarea.parentNode;
      if (parent && parent.classList && parent.classList.contains('wysibb')) {
        parent.parentNode.insertBefore(textarea, parent);
        parent.parentNode.removeChild(parent);
      }
    }

    textarea.removeAttribute('data-wysibb');
    textarea.removeAttribute('data-wbb-id');
    textarea.style.cssText = [
      'display:block','width:100%','padding:6px 8px',
      'background:rgb(30,30,30)','border:1px solid #444',
      'color:#ccc','border-radius:3px','box-sizing:border-box',
      'margin-bottom:0.8em','font-size:inherit','font-family:inherit',
      'resize:vertical','min-height:75px','position:static',
      'visibility:visible','opacity:1','pointer-events:auto'
    ].join(';');
  }

  function patchJQueryWysibb() {
    if (typeof jQuery === 'undefined') return;
    if (typeof jQuery.fn.wysibb === 'undefined') return;
    var _orig = jQuery.fn.wysibb;
    jQuery.fn.wysibb = function (options) {
      var filtered = this.filter(function () {
        return this.id !== 'req-note' &&
               !jQuery(this).closest('#request-form').length;
      });
      if (filtered.length === 0) return this;
      return _orig.apply(filtered, arguments);
    };
  }

  window.addEventListener('load', function () {
    patchJQueryWysibb();
    blockWysibb();
    setTimeout(blockWysibb, 300);
    setTimeout(blockWysibb, 800);
    setTimeout(blockWysibb, 1500);

    var textarea = document.getElementById('req-note');
    if (textarea) {
      textarea.addEventListener('focus', function () {
        var parent = textarea.parentNode;
        if (parent && parent.classList && parent.classList.contains('wysibb')) {
          blockWysibb();
        }
      }, true);
    }
  });

  if (typeof jQuery !== 'undefined') patchJQueryWysibb();

})();