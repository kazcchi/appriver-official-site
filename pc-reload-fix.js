// PC用リロード時のホーム戻り機能
(function () {
  'use strict';

  // デスクトップ/PC判定
  function isDesktop() {
    return window.innerWidth > 768;
  }

  // PCでない場合は処理を停止
  if (!isDesktop()) return;

  // ページロード時の処理
  function handlePageLoad() {
    // リロード検知フラグとスクロール位置をチェック
    const wasReloaded = sessionStorage.getItem('pc_page_reloaded');
    const savedScrollY = sessionStorage.getItem('pc_scroll_position');

    if (wasReloaded) {
      // リロード後の処理
      sessionStorage.removeItem('pc_page_reloaded');
      sessionStorage.removeItem('pc_scroll_position');

      // 保存されたスクロール位置を数値に変換
      const previousScrollY = savedScrollY ? parseInt(savedScrollY, 10) : 0;

      // URLハッシュがある場合は必ずクリア
      if (window.location.hash) {
        history.replaceState(null, null, window.location.pathname + window.location.search);
      }

      // リロード前にスクロールしていた場合、またはハッシュがあった場合は
      // 必ずホームセクションに戻る
      if (previousScrollY > 100 || window.location.hash) {
        setTimeout(() => {
          const homeSection = document.getElementById('home');
          if (homeSection) {
            homeSection.scrollIntoView({ behavior: 'smooth' });
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }, 100);
      } else {
        // トップ付近にいた場合でも確実にトップに戻す
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
      }
    }
  }

  // beforeunload イベントでリロード検知フラグを設定
  function handleBeforeUnload() {
    // F5、Ctrl+R、ブラウザのリロードボタンなどでリロードされる前に実行
    sessionStorage.setItem('pc_page_reloaded', 'true');
    // 現在のスクロール位置も保存
    sessionStorage.setItem('pc_scroll_position', window.scrollY.toString());
  }

  // リサイズ時にデスクトップでなくなった場合はイベントリスナーを削除
  function handleResize() {
    if (!isDesktop()) {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }

  // イベントリスナー設定
  function init() {
    // ページアンロード直前のイベント
    window.addEventListener('beforeunload', handleBeforeUnload);

    // リサイズ監視
    window.addEventListener('resize', handleResize);

    // ページロード時の処理実行
    handlePageLoad();
  }

  // 初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
