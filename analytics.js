// 訪問・クリック計測（Vercel Analytics）
// - ページビューは Vercel スニペットで自動計測
// - 本ファイルではプレイヤー関連のクリックイベントを送信

(function () {
  'use strict';

  function track(eventName, props) {
    try {
      if (typeof window !== 'undefined' && typeof window.va === 'function') {
        window.va(eventName, props || {});
      } else if (typeof window !== 'undefined' && Array.isArray(window.vaq)) {
        window.vaq.push([eventName, props || {}]);
      }
    } catch {
      // 計測失敗時は握りつぶす（ユーザー体験に影響させない）
    }
  }

  function handleClick(e) {
    const target = e.target;
    if (!target || typeof target.closest !== 'function') return;

    // 1) プレイヤータブ選択（.platform-btn[data-platform]）
    const tabBtn = target.closest('.platform-btn');
    if (tabBtn && tabBtn.dataset && tabBtn.dataset.platform) {
      track('player_tab_select', { platform: tabBtn.dataset.platform });
      return;
    }

    // 2) 各プレイリスト外部リンク
    const apple = target.closest('.apple-music-full-playlist-btn');
    if (apple) {
      track('playlist_outbound_click', { platform: 'apple-music' });
      return;
    }
    const spotify = target.closest('.spotify-full-playlist-btn');
    if (spotify) {
      track('playlist_outbound_click', { platform: 'spotify' });
      return;
    }
    const youtube = target.closest('.youtube-full-playlist-btn');
    if (youtube) {
      track('playlist_outbound_click', { platform: 'youtube' });
      return;
    }
    const others = target.closest('.others-full-playlist-btn');
    if (others) {
      track('playlist_outbound_click', { platform: 'others' });
      return;
    }
    const lineBtn = target.closest('.line-full-playlist-btn');
    if (lineBtn) {
      track('playlist_outbound_click', { platform: 'line-music' });
      return;
    }

    // 3) フッター等のソーシャル/配信リンク
    const social = target.closest('.social-link');
    if (social) {
      let platform = 'other';
      if (social.classList.contains('spotify')) platform = 'spotify';
      else if (social.classList.contains('apple-music')) platform = 'apple-music';
      else if (social.classList.contains('youtube')) platform = 'youtube';
      else if (social.classList.contains('tiktok')) platform = 'tiktok';
      track('social_link_click', { platform: platform });
      return;
    }
  }

  document.addEventListener('click', handleClick, false);
})();
