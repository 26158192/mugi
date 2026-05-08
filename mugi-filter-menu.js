/*
 * MugiSUB - Side Filter Menu
 * Pure Vanilla JS — no jQuery
 */

(function () {

  var resizeTimer;
  var lastWidth = window.innerWidth;

  /* Global — request.js bhi use kar sake */
  window.mugiFilter = {
    collapse: function () {},
    expand:   function () {}
  };

  function attachFilterMenu() {
    var filter   = document.querySelector('.g_filter');
    if (!filter) return;

    var flap     = filter.querySelector('.flap');
    var content  = filter.querySelector('.content');
    var closeBtn = filter.querySelector('.fancybox-close');

    function collapse() {
      filter.classList.add('folded');
      if (flap)    flap.classList.remove('hide');
      if (content) content.classList.add('hide');
    }

    function expand() {
      filter.classList.remove('folded');
      if (flap)    flap.classList.add('hide');
      if (content) content.classList.remove('hide');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function adjustSize() {
      var w = window.innerWidth;
      if (w < 1024) {
        filter.classList.add('g_overlaymenu');
        if (content) content.classList.add('g_bubble');
        collapse();
      } else {
        filter.classList.remove('g_overlaymenu');
        if (content) content.classList.remove('g_bubble');
        expand();
      }
    }

    if (flap)     flap.addEventListener('click', expand);
    if (closeBtn) closeBtn.addEventListener('click', collapse);

    /* Submit Request ke baad bhi collapse karo */
    var form = document.getElementById('request-form');
    if (form) {
      form.addEventListener('mugi:submitted', function () {
        if (window.innerWidth < 1024) collapse();
      });
    }

    window.addEventListener('resize', function () {
      var currentWidth = window.innerWidth;
      if (currentWidth === lastWidth) return;
      lastWidth = currentWidth;
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(adjustSize, 250);
    });

    /* Global reference expose karo */
    window.mugiFilter.collapse = collapse;
    window.mugiFilter.expand   = expand;

    adjustSize();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachFilterMenu);
  } else {
    attachFilterMenu();
  }

}());