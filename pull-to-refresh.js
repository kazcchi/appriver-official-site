// Pull to Refresh functionality for mobile only
(function () {
  'use strict';

  // Check if device is mobile
  function isMobile() {
    return window.innerWidth <= 768;
  }

  // Exit if not mobile
  if (!isMobile()) return;

  const indicator = document.getElementById('pullToRefreshIndicator');
  const pullText = indicator.querySelector('.pull-text');

  let startY = 0;
  let startX = 0;
  let currentY = 0;
  let pullDistance = 0;
  let isPulling = false;
  let isRefreshing = false;
  // 指を置いた時点でページ上部にいたか。途中で判定し直すと、下までスクロールしてから
  // 上端に戻ってきた指の動きを「巨大な引っ張り」と読み違える
  let canPull = false;

  const PULL_THRESHOLD = 120; // Minimum pull distance to trigger refresh (感度を下げるために増加)
  const MAX_PULL_DISTANCE = 180; // Maximum pull distance
  const PULL_START_SLOP = 10; // この距離までは指の震え・タップとみなして引っ張り扱いしない

  // Initialize
  function init() {
    if (!indicator) return;

    // Add touch event listeners
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });

    // Resize listener to disable on desktop
    window.addEventListener('resize', handleResize);
  }

  function handleResize() {
    if (!isMobile()) {
      resetPull();
      removeEventListeners();
    }
  }

  function removeEventListeners() {
    document.removeEventListener('touchstart', handleTouchStart);
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
  }

  function handleTouchStart(e) {
    if (isRefreshing) return;

    // 指を置いた位置は、ページ上部にいるかどうかに関わらず必ず記録する。
    // ページ下部だからと記録を省くと、前のジェスチャーのstartYが残ったままになり、
    // 上端に戻った瞬間に指の絶対位置がそのまま引っ張り量として読まれてしまう
    startY = e.touches[0].pageY;
    startX = e.touches[0].pageX;
    isPulling = false;
    pullDistance = 0;
    canPull = window.pageYOffset <= 0;
  }

  function handleTouchMove(e) {
    if (isRefreshing || !canPull) return;

    currentY = e.touches[0].pageY;
    const rawDistance = currentY - startY;

    // 横方向が優勢な動き(アルバムのスライダー操作など)は引っ張りとして扱わない
    if (Math.abs(e.touches[0].pageX - startX) > Math.abs(rawDistance)) {
      hideIndicator();
      return;
    }

    // Only pull down and when at top of page (指の震え程度では発火させない)
    if (rawDistance > PULL_START_SLOP && window.pageYOffset <= 0) {
      e.preventDefault(); // Prevent default scroll behavior

      isPulling = true;
      // 0.6倍の抵抗を加えて、引っ張るのに少し力を要するようにする
      pullDistance = (rawDistance - PULL_START_SLOP) * 0.6;

      // Limit pull distance
      const clampedDistance = Math.min(pullDistance, MAX_PULL_DISTANCE);
      const _progress = clampedDistance / PULL_THRESHOLD;

      // Show indicator
      indicator.classList.add('visible');

      // Update indicator position and state
      if (clampedDistance >= PULL_THRESHOLD) {
        indicator.classList.add('ready');
        indicator.classList.add('pulling');
        pullText.textContent = '離して更新';
      } else {
        indicator.classList.remove('ready');
        indicator.classList.add('pulling');
        pullText.textContent = '引っ張って更新';
      }

      // Smooth transition effect
      const translateY = Math.min(clampedDistance * 0.5, 40);
      indicator.style.transform = `translateX(-50%) translateY(${translateY}px)`;
    } else {
      // ⚠️ ここでresetPull()を呼ぶとstartYまで0に戻ってしまい、次のtouchmoveで
      // 指の絶対位置が引っ張り量として計算される(軽いタッチでリロードが起きていた原因)。
      // 指を離すまではstartYを保ち、見た目だけ戻す
      hideIndicator();
    }
  }

  function handleTouchEnd(_e) {
    if (isRefreshing) return;

    // Trigger refresh if pulled enough
    if (isPulling && pullDistance >= PULL_THRESHOLD) {
      triggerRefresh();
    } else {
      resetPull();
    }
  }

  function triggerRefresh() {
    isRefreshing = true;

    indicator.classList.add('refreshing');
    indicator.classList.remove('ready', 'pulling');
    pullText.textContent = '更新中...';

    // Keep indicator visible during refresh
    indicator.style.transform = 'translateX(-50%) translateY(0)';

    // Simulate refresh delay then reload
    setTimeout(() => {
      // Store scroll position to prevent jump after reload
      sessionStorage.setItem('pullRefreshReload', 'true');
      // URLハッシュをクリアしてリロード（ホームに確実に戻る）
      const cleanUrl = window.location.href.split('#')[0];
      window.location.href = cleanUrl;
    }, 1000);
  }

  // 見た目だけを元に戻す(指を置いた位置の記録は保つ)。ジェスチャーの途中で呼ぶのはこちら
  function hideIndicator() {
    isPulling = false;
    pullDistance = 0;

    indicator.classList.remove('visible', 'pulling', 'ready', 'refreshing');
    indicator.style.transform = 'translateX(-50%)';
    pullText.textContent = '引っ張って更新';
  }

  // ジェスチャーが終わったときの全消去。指を置いた位置の記録もここで捨てる
  function resetPull() {
    hideIndicator();

    canPull = false;
    startY = 0;
    startX = 0;
    currentY = 0;
  }

  // Handle page load after refresh
  window.addEventListener('load', () => {
    if (sessionStorage.getItem('pullRefreshReload')) {
      sessionStorage.removeItem('pullRefreshReload');
      // Smooth scroll to top after refresh
      window.scrollTo(0, 0);
    }
  });

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
