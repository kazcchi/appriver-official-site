// リロードガイドシステム - モバイル専用
(function () {
  // モバイルかどうかをチェック
  function isMobile() {
    return window.innerWidth <= 768;
  }

  // iOS判定
  function isIOS() {
    return typeof window !== 'undefined' && /iP(hone|od|ad)/.test(window.navigator.userAgent);
  }

  // モバイルでない場合は処理を停止
  if (!isMobile()) return;

  const reloadGuide = document.getElementById('reloadGuide');
  if (!reloadGuide) return;

  // リロード完了済みかチェック
  const reloadCompleted = localStorage.getItem('appriver_reload_completed');

  // ガイド表示関数
  function showReloadGuide() {
    if (reloadCompleted) return;

    reloadGuide.style.display = 'block';
    setTimeout(() => {
      reloadGuide.style.opacity = '1';
    }, 100);
  }

  // ガイド非表示関数
  function hideReloadGuide() {
    reloadGuide.style.opacity = '0';
    setTimeout(() => {
      reloadGuide.style.display = 'none';
    }, 500);
    // LocalStorageに完了フラグを設定
    localStorage.setItem('appriver_reload_completed', 'true');
  }

  // ダブルタップ検知
  let lastTap = 0;
  document.addEventListener('touchend', function (e) {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;

    if (tapLength < 500 && tapLength > 0) {
      // ダブルタップ検出
      e.preventDefault();
      hideReloadGuide();
      // 実際のリロード実行
      setTimeout(() => {
        // URLハッシュをクリアしてリロード（ホームに確実に戻る）
        const cleanUrl = window.location.href.split('#')[0];
        window.location.href = cleanUrl;
      }, 300);
    }
    lastTap = currentTime;
  });

  // リサイズ時にモバイルでなくなった場合はガイドを非表示
  window.addEventListener('resize', () => {
    if (!isMobile()) {
      reloadGuide.style.display = 'none';
    }
  });

  // 初期化
  function init() {
    if (!reloadCompleted) {
      // 2秒後にガイド表示
      setTimeout(() => {
        showReloadGuide();
      }, 2000);
    }
  }

  // ページ読み込み完了時に初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // iOS Safari の戻る復帰（bfcache）対策
  // "◀️ appriver" で戻った際に真っ白になるケースを回避するため、
  // bfcache 復帰時は1度だけ自動リロードを行う
  window.addEventListener('pageshow', function (e) {
    try {
      const perf = typeof window !== 'undefined' ? window.performance : null;
      const nav = perf && perf.getEntriesByType ? perf.getEntriesByType('navigation')[0] : null;
      const isBack = (nav && nav.type === 'back_forward') || e.persisted;
      if (isIOS() && isBack) {
        const flag = sessionStorage.getItem('ios_back_reload_done');
        if (!flag) {
          sessionStorage.setItem('ios_back_reload_done', '1');
          // できるだけ早く復帰させる
          window.location.reload();
        } else {
          // 二重リロード防止フラグをクリア
          sessionStorage.removeItem('ios_back_reload_done');
        }
      }
    } catch {
      // 失敗時は何もしない
    }
  });
})();
