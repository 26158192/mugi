/*
 * MugiSUB - Image Hover Preview
 * Choti image: img.mugi/poster_img/berserk_img-thumb.jpg
 * Bari image:  img.mugi/poster/berserk_img.jpg
 */

(function () {

  var style = document.createElement('style');
  style.textContent =
    '#mugi-loading {' +
    '  position: fixed;' +
    '  top: 12px;' +
    '  right: 12px;' +
    '  width: 20px;' +
    '  height: 20px;' +
    '  border: 3px solid rgba(255,255,255,0.15);' +
    '  border-top-color: #e18e3c;' +
    '  border-radius: 50%;' +
    '  animation: mugi-spin 0.7s linear infinite;' +
    '  z-index: 99999;' +
    '  display: none;' +
    '}' +
    '@keyframes mugi-spin { to { transform: rotate(360deg); } }' +
    '#imagepreview {' +
    '  position: fixed;' +
    '  z-index: 9999;' +
    '  padding: 3px;' +
    '  pointer-events: auto;' +
    '}' +
    '#imagepreview.hide { display: none !important; }' +
    '#imagepreview img {' +
    '  display: block;' +
    '  width: auto;' +
    '  height: auto;' +
    '  max-width: 500px;' +
    '  max-height: 700px;' +
    '  border-radius: 4px;' +
    '}' +
    '.g_bubble.stripe > div.image div.tooltip { display: none !important; }';

  document.head.appendChild(style);

  var spinner = document.createElement('div');
  spinner.id  = 'mugi-loading';
  document.body.appendChild(spinner);

  function showLoading() { spinner.style.display = 'block'; }
  function hideLoading() { spinner.style.display = 'none';  }

  function smartPosition(preview, imgRect) {
    var pW  = preview.offsetWidth  || 400;
    var pH  = preview.offsetHeight || 500;
    var vW  = window.innerWidth;
    var vH  = window.innerHeight;
    var gap = 12;

    var x;
    if (imgRect.right + gap + pW <= vW) {
      x = imgRect.right + gap;
    } else {
      x = imgRect.left - gap - pW;
    }

    var y = imgRect.top + (imgRect.height / 2) - (pH / 2);
    if (y < gap) y = gap;
    if (y + pH > vH - gap) y = vH - pH - gap;

    preview.style.left = x + 'px';
    preview.style.top  = y + 'px';
  }

  function attachPreview() {
    document.querySelectorAll('img').forEach(function (img) {
      var timer = null;

      img.addEventListener('mouseenter', function () {
        if (window.innerWidth <= 1000) return;
        if (!img.closest('.g_bubble.box')) return;

        var old = document.getElementById('imagepreview');
        if (old && old.parentNode) old.parentNode.removeChild(old);

        var src = img.getAttribute('src') || '';

        /* poster_img/ → poster/, -thumb.jpg → .jpg */
        var fullSrc = src
          .replace('poster_img/', 'poster/')
          .replace('-thumb.jpg', '.jpg');

        var imgRect = img.getBoundingClientRect();

        timer = setTimeout(function () {
          showLoading();

          var preview   = document.createElement('div');
          preview.id    = 'imagepreview';
          preview.className = 'hide g_bubble';

          var bigImg       = document.createElement('img');
          bigImg.className = 'g_image';
          bigImg.alt       = 'Image preview';

          bigImg.addEventListener('load', function () {
            hideLoading();

            var old2 = document.getElementById('imagepreview');
            if (old2 && old2.parentNode) old2.parentNode.removeChild(old2);

            preview.classList.remove('hide');
            preview.appendChild(bigImg);
            document.body.appendChild(preview);

            smartPosition(preview, imgRect);

            if (!img.matches(':hover')) preview.classList.add('hide');
          });

          bigImg.addEventListener('error', function () {
            hideLoading();
            /* Bari image nahi mili — choti hi dikhao */
            if (bigImg.src !== src) bigImg.src = src;
          });

          preview.addEventListener('mouseenter', function () {
            preview.classList.remove('hide');
          });
          preview.addEventListener('mouseleave', function () {
            if (preview.parentNode) preview.parentNode.removeChild(preview);
          });

          bigImg.src = fullSrc;

        }, 300);

        img._mugiTimer = timer;
      });

      img.addEventListener('mouseleave', function () {
        clearTimeout(img._mugiTimer);
        hideLoading();
        var preview = document.getElementById('imagepreview');
        if (preview) preview.classList.add('hide');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachPreview);
  } else {
    attachPreview();
  }

}());