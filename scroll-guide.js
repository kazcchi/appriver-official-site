// スクロールガイドシステム - モバイル専用
(function () {
  // モバイルかどうかをチェック
  function isMobile() {
    return window.innerWidth <= 768;
  }

  // モバイルでない場合は処理を停止
  if (!isMobile()) return;

  const scrollGuide = document.getElementById('scrollGuide');
  if (!scrollGuide) return;

  // スクロール完了済みかチェック
  const scrollCompleted = localStorage.getItem('appriver_scroll_completed');

  // ガイド表示関数
  function showScrollGuide() {
    if (scrollCompleted) return;

    scrollGuide.style.display = 'block';
    setTimeout(() => {
      scrollGuide.style.opacity = '1';
    }, 100);
  }

  // ガイド非表示関数
  function hideScrollGuide() {
    scrollGuide.style.opacity = '0';
    setTimeout(() => {
      scrollGuide.style.display = 'none';
    }, 500);
    // LocalStorageに完了フラグを設定
    localStorage.setItem('appriver_scroll_completed', 'true');
  }

  // スクロール検知
  function handleScroll() {
    const scrollY = window.scrollY || window.pageYOffset;

    if (scrollY > 100) {
      hideScrollGuide();
      // イベントリスナー削除
      window.removeEventListener('scroll', handleScroll);
    }
  }

  // スクロールイベント追加
  window.addEventListener('scroll', handleScroll, { passive: true });

  // リサイズ時にモバイルでなくなった場合はガイドを非表示
  window.addEventListener('resize', () => {
    if (!isMobile()) {
      scrollGuide.style.display = 'none';
    }
  });

  // 初期化
  function init() {
    if (!scrollCompleted) {
      // 3秒後にガイド表示
      setTimeout(() => {
        showScrollGuide();
      }, 3000);
    }
  }

  // ページ読み込み完了時に初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
