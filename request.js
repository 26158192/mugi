(function () {
  var cat = document.getElementById('req-category');
  var titleLabel = document.getElementById('req-title-label');
  var titleInput = document.getElementById('req-title');
  var noteInput = document.getElementById('req-note');

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
})();