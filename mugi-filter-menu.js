/*
 * MugiSUB - Side Filter Menu
 * Pure Vanilla JS — jQuery bilkul nahi chahiye
 */

(function () {

  var resizeTimer;
  var lastWidth = window.innerWidth; /* sirf width track karo */

  function attachFilterMenu() {
    var filter  = document.querySelector('.g_filter');
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
    }

    function adjustSize() {
      var w = window.innerWidth;
      if (w < 1270) {
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

    window.addEventListener('resize', function () {
      var currentWidth = window.innerWidth;

      /* Sirf width change hone pe adjustSize karo */
      /* Height change (mobile keyboard) ignore karo */
      if (currentWidth === lastWidth) return;
      lastWidth = currentWidth;

      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(adjustSize, 250);
    });

    adjustSize();
  }

  document.addEventListener('DOMContentLoaded', attachFilterMenu);

}());