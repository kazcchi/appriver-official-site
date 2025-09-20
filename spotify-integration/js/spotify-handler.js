// appriver Spotify Player Handler
// Spotify埋め込みプレイヤーの制御とエラーハンドリング

document.addEventListener('DOMContentLoaded', function () {
  console.log('Spotify Player Handler loaded');

  // プレイヤーの読み込み状態を監視
  initializePlayerMonitoring();

  // エラーハンドリング設定
  setupErrorHandling();

  // レスポンシブ対応
  setupResponsiveHandling();
});

/**
 * プレイヤー監視の初期化
 */
function initializePlayerMonitoring() {
  // 将来の実装用：実際の埋め込みプレイヤーが追加されたら有効化
  console.log('Player monitoring initialized');

  // プレイヤー読み込み完了の検知
  window.addEventListener('message', function (event) {
    if (event.origin !== 'https://open.spotify.com') return;

    // Spotifyからのメッセージを処理
    handleSpotifyMessage(event.data);
  });
}

/**
 * Spotifyからのメッセージ処理
 */
function handleSpotifyMessage(data) {
  console.log('Spotify message received:', data);

  // プレイヤーの状態に応じた処理
  if (data.type === 'ready') {
    showPlayerReady();
  } else if (data.type === 'error') {
    showPlayerError(data.error);
  }
}

/**
 * プレイヤー準備完了時の処理
 */
function showPlayerReady() {
  console.log('Spotify player ready');

  // 読み込み中プレースホルダーを非表示
  const placeholder = document.querySelector('.loading-placeholder');
  if (placeholder) {
    placeholder.style.display = 'none';
  }
}

/**
 * プレイヤーエラー時の処理
 */
function showPlayerError(error) {
  console.error('Spotify player error:', error);

  const placeholder = document.querySelector('.loading-placeholder');
  if (placeholder) {
    placeholder.innerHTML = `
            <p style="color: #ff6b6b;">プレイヤーの読み込みに失敗しました</p>
            <p class="small">エラー: ${error}</p>
            <p class="small">ページを再読み込みしてください</p>
        `;
  }
}

/**
 * エラーハンドリング設定
 */
function setupErrorHandling() {
  // iframe読み込みエラーの監視
  document.addEventListener(
    'error',
    function (event) {
      if (event.target.tagName === 'IFRAME') {
        handleIframeError(event.target);
      }
    },
    true
  );
}

/**
 * iframe読み込みエラーの処理
 */
function handleIframeError(iframe) {
  console.error('iframe loading error:', iframe.src);

  // エラー表示の作成
  const errorDiv = document.createElement('div');
  errorDiv.className = 'iframe-error';
  errorDiv.innerHTML = `
        <p style="color: #ff6b6b;">Spotifyプレイヤーの読み込みに失敗しました</p>
        <p class="small">プレイリストが存在しないか、アクセスできません</p>
        <button onclick="location.reload()" style="
            background: #1db954;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            margin-top: 10px;
        ">再読み込み</button>
    `;

  // iframeを置き換え
  iframe.parentNode.replaceChild(errorDiv, iframe);
}

/**
 * レスポンシブ対応
 */
function setupResponsiveHandling() {
  // 画面サイズ変更時の処理
  window.addEventListener('resize', function () {
    adjustPlayerSize();
  });

  // 初期化時にも実行
  adjustPlayerSize();
}

/**
 * プレイヤーサイズの調整
 */
function adjustPlayerSize() {
  const iframes = document.querySelectorAll('.spotify-embed-container iframe');

  iframes.forEach(iframe => {
    const container = iframe.closest('.spotify-embed-container');
    if (container) {
      const containerWidth = container.offsetWidth;

      // モバイルサイズの場合は高さを調整
      if (containerWidth < 600) {
        iframe.style.height = '300px';
      } else {
        iframe.style.height = '380px';
      }
    }
  });
}

/**
 * プレイリスト埋め込みの追加（実装時に使用）
 */
function addPlaylistEmbed(playlistId) {
  const container = document.querySelector('.spotify-embed-container');
  if (!container) return;

  // 既存のプレースホルダーを削除
  const placeholder = container.querySelector('.loading-placeholder');
  if (placeholder) {
    placeholder.remove();
  }

  // iframe要素を作成
  const iframe = document.createElement('iframe');
  iframe.style.borderRadius = '12px';
  iframe.style.width = '100%';
  iframe.style.height = '380px';
  iframe.src = `https://open.spotify.com/embed/playlist/${playlistId}`;
  iframe.frameBorder = '0';
  iframe.allow = 'encrypted-media; clipboard-write';

  // コンテナに追加
  container.appendChild(iframe);

  console.log('Playlist embed added:', playlistId);
}

/**
 * 個別楽曲埋め込みの追加（実装時に使用）
 */
function addTrackEmbed(trackId, containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  // 既存のプレースホルダーを削除
  const placeholder = container.querySelector('.track-embed-placeholder');
  if (placeholder) {
    placeholder.remove();
  }

  // iframe要素を作成
  const iframe = document.createElement('iframe');
  iframe.style.borderRadius = '8px';
  iframe.style.width = '100%';
  iframe.style.height = '152px';
  iframe.src = `https://open.spotify.com/embed/track/${trackId}`;
  iframe.frameBorder = '0';
  iframe.allow = 'encrypted-media; clipboard-write';

  // コンテナに追加
  container.appendChild(iframe);

  console.log('Track embed added:', trackId);
}

/**
 * ユーティリティ関数
 */
const SpotifyUtils = {
  // SpotifyのURLからIDを抽出
  extractId: function (url) {
    const match = url.match(/(?:playlist|track)\/([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
  },

  // プレイヤーの状態チェック
  checkPlayerStatus: function () {
    console.log('Checking player status...');
    // 実装時に使用
  },

  // ログ出力
  log: function (message, data = null) {
    console.log(`[Spotify Handler] ${message}`, data);
  },
};

// グローバル関数として公開
window.SpotifyHandler = {
  addPlaylistEmbed,
  addTrackEmbed,
  utils: SpotifyUtils,
};
