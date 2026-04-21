// Navigation: back-to-top, mobile sidebar, smooth scroll
(function() {
  var scroller = document.getElementById('contentScroller');
  var backTop = document.getElementById('backTop');
  var mobileToggle = document.getElementById('mobileToggle');
  var sidebar = document.getElementById('sidebar');
  var overlay = document.getElementById('sidebarOverlay');

  if (scroller) {
    scroller.addEventListener('scroll', function() {
      if (backTop) backTop.classList.toggle('visible', scroller.scrollTop > 300);
    });
  }
  if (backTop) {
    backTop.addEventListener('click', function() {
      if (scroller) scroller.scrollTo({ top: 0, behavior: 'smooth' });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  if (mobileToggle && sidebar) {
    mobileToggle.addEventListener('click', function() {
      sidebar.classList.toggle('open');
      if (overlay) overlay.classList.toggle('visible');
    });
  }
  if (overlay) {
    overlay.addEventListener('click', function() {
      if (sidebar) sidebar.classList.remove('open');
      overlay.classList.remove('visible');
    });
  }
})();
