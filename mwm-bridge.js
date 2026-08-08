// TikTokアプリ内ブラウザ用の橋渡し。mwm.ne.jp へのリンクを遷移させず、その場に案内を出す。
//
// なぜ必要か(2026-08-08 オーナー実機で判明):
//   TikTokのプロフィール欄のリンクから開いた「正式な」アプリ内ブラウザ(UAにTikTokと名乗る方)は、
//   このサイト自体は開けるが、そこから mwm.ne.jp への遷移をTikTok自身の遮断画面
//   (「このリンクはブラウザで開いてください」)で止める。遮断はTikTok側で起きるため、
//   mwm.ne.jp に置いた番人には永遠に届かない。塞げるのはリンク元であるこのサイトだけ。
//
// トーク・DM経由の簡易ブラウザ(UAがTikTokと名乗らない素のWKWebView)では遷移が通り、
// mwm.ne.jp 側の番人が働くことを実機で確認済み(2026-08-08)。そちらまで横取りすると
// 「今すぐ聴いてみる→そのまま試聴」という聴くだけの人の動線を壊すので、
// 横取りはUAがTikTokと名乗る場合だけに限定する。
//
// 脱出手段は確実度の順に2つ:
//   1. URLコピー(本線): 行き先URLをコピーしてもらい、Safari等に貼り付けて直接着地させる。
//      行き先URLは utm_source 付きなので、貼り付け先で mwm.ne.jp の登録ストリップが出る
//   2. 「…」→ブラウザで開く(補助): このサイトがSafariで開き直るので、もう一度押してもらう。
//      プロフィール経由のアプリ内ブラウザにのみ「…」がある(トーク経由には無い)
// ⚠️ x-safari-https:// によるSafari直行はTikTokが握りつぶすことが実機で確定しており使わない。

(function () {
  'use strict';

  const MWM_HOST = 'mwm.ne.jp';

  // UAにTikTokと名乗るアプリ内ブラウザだけを対象にする(上のコメント参照)
  function isTikTokInApp() {
    return /musical_ly|Bytedance|TikTok/i.test(window.navigator.userAgent);
  }

  function track(eventName, props) {
    try {
      if (typeof window.va === 'function') {
        window.va(eventName, props || {});
      } else if (Array.isArray(window.vaq)) {
        window.vaq.push([eventName, props || {}]);
      }
    } catch {
      // 計測失敗は握りつぶす(ユーザー体験に影響させない)
    }
  }

  function copyText(text, onDone) {
    function fallback() {
      // 古いWebView向け
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try {
        ok = document.execCommand('copy');
      } finally {
        ta.remove();
      }
      onDone(ok);
    }

    const clipboard = window.navigator.clipboard;
    if (clipboard && clipboard.writeText) {
      clipboard.writeText(text).then(function () {
        onDone(true);
      }, fallback);
    } else {
      fallback();
    }
  }

  // スタイルはこのファイルだけで完結させる(サイト側CSSの影響を受けず、両サイトで同一に保つため)
  function injectStyle() {
    if (document.getElementById('mwm-bridge-style')) return;
    const style = document.createElement('style');
    style.id = 'mwm-bridge-style';
    style.textContent = [
      // サイト側CSSがbox-sizingを指定していない前提で自前で揃える。
      // content-boxのままだとmax-width(26rem)にpaddingが加算され、375px幅で横にはみ出す
      '#mwm-bridge,#mwm-bridge *{box-sizing:border-box;}',
      '#mwm-bridge{position:fixed;inset:0;z-index:2147483000;overflow-y:auto;overflow-x:hidden;',
      '-webkit-overflow-scrolling:touch;overscroll-behavior:contain;background:#fff;',
      'font-family:-apple-system,BlinkMacSystemFont,"Hiragino Sans","Noto Sans JP",sans-serif;',
      'color:#27272a;line-height:1.7;text-align:left;}',
      '#mwm-bridge .mwm-b-inner{max-width:26rem;margin:0 auto;padding:2rem 1.25rem 3rem;}',
      '#mwm-bridge .mwm-b-close{display:block;margin-left:auto;border:0;background:none;',
      'font-size:1rem;font-weight:700;color:#71717a;padding:.5rem .75rem;cursor:pointer;}',
      '#mwm-bridge h2{font-size:1.5rem;font-weight:900;text-align:center;margin:.5rem 0 0;}',
      '#mwm-bridge p{font-size:1rem;margin:1rem 0 0;}',
      '#mwm-bridge .mwm-b-card{margin-top:1.75rem;border:1px solid #e4e4e7;background:#fafafa;',
      'border-radius:1rem;padding:1rem;}',
      '#mwm-bridge .mwm-b-card p{margin:0;font-weight:700;color:#3f3f46;}',
      // 375px幅で1行に収まる字数・字送りにしてある(折り返して1文字だけ次行に残るのを避ける)
      '#mwm-bridge .mwm-b-copy{display:block;width:100%;margin-top:.75rem;padding:1rem .5rem;',
      'border-radius:9999px;border:2px solid #059669;background:#fff;color:#047857;',
      'font-size:1.0625rem;font-weight:700;text-align:center;cursor:pointer;}',
      '#mwm-bridge .mwm-b-copy.is-copied{background:#ecfdf5;}',
      '#mwm-bridge ol{list-style:none;margin:1rem 0 0;padding:0;}',
      '#mwm-bridge li{display:flex;gap:.75rem;font-size:1.0625rem;margin-top:.75rem;}',
      '#mwm-bridge li .mwm-b-num{font-weight:900;color:#059669;}',
      '#mwm-bridge .mwm-b-sub{margin-top:2rem;}',
      '#mwm-bridge .mwm-b-sub>p{font-weight:700;color:#3f3f46;}',
      '#mwm-bridge .mwm-b-note{margin-top:1.5rem;font-size:.9375rem;color:#71717a;}',
    ].join('');
    document.head.appendChild(style);
  }

  function openOverlay(destUrl) {
    injectStyle();

    // 開き直しで二重に積まれないようにする(「とじる」が1枚しか消せなくなるため)
    const existing = document.getElementById('mwm-bridge');
    if (existing) existing.remove();

    const el = document.createElement('div');
    el.id = 'mwm-bridge';
    el.innerHTML = [
      '<div class="mwm-b-inner">',
      '<button type="button" class="mwm-b-close">✕ とじる</button>',
      '<h2>ブラウザで開いてください</h2>',
      '<p>アプリの中では、この先のページを開けません。',
      'Safari や Chrome で開くと、そのまま聴けます。</p>',
      '<div class="mwm-b-card">',
      '<p>URLをコピーして、ブラウザに貼り付けて開きます</p>',
      '<button type="button" class="mwm-b-copy">聴けるページのURLをコピー</button>',
      '<ol>',
      '<li><span class="mwm-b-num">1</span><span>上のボタンを押す(コピーされます)</span></li>',
      '<li><span class="mwm-b-num">2</span><span>Safari や Chrome を開く</span></li>',
      '<li><span class="mwm-b-num">3</span><span>上の入力欄を押して「ペースト(貼り付け)」して開く</span></li>',
      '</ol>',
      '</div>',
      // 補助手段。プロフィール経由のアプリ内ブラウザにのみ「…」がある(トーク経由には無い)ため
      // 「あるときは」の書き方にする。この経路はこのサイトがSafariで開き直るだけなので、
      // もう一度押してもらう手順3が要る
      '<div class="mwm-b-sub">',
      '<p>画面の右上に「…」があるときは</p>',
      '<ol>',
      '<li><span class="mwm-b-num">1</span><span>画面右上の「…」をタップ</span></li>',
      '<li><span class="mwm-b-num">2</span><span>「ブラウザで開く」を選ぶ</span></li>',
      '<li><span class="mwm-b-num">3</span><span>開いたページで、さっきと同じところを押す</span></li>',
      '</ol>',
      '</div>',
      '<p class="mwm-b-note">うまく開けないときは、Safari や Chrome で ' +
        MWM_HOST +
        ' と入力して開いてください。</p>',
      '</div>',
    ].join('');

    const closeBtn = el.querySelector('.mwm-b-close');
    closeBtn.addEventListener('click', function () {
      el.remove();
    });

    const copyBtn = el.querySelector('.mwm-b-copy');
    copyBtn.addEventListener('click', function () {
      copyText(destUrl, function (ok) {
        if (ok) {
          copyBtn.textContent = '✓ コピーしました';
          copyBtn.classList.add('is-copied');
        }
      });
      track('bridge_copy_url', { host: window.location.host });
    });

    document.body.appendChild(el);
    track('bridge_shown', { host: window.location.host });
  }

  function handleClick(e) {
    // 修飾キー付きクリック(新規タブ等)は素通し
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    const target = e.target;
    if (!target || typeof target.closest !== 'function') return;

    const anchor = target.closest('a[href]');
    if (!anchor) return;

    let url;
    try {
      url = new window.URL(anchor.href, window.location.href);
    } catch {
      return;
    }
    if (url.hostname !== MWM_HOST && url.hostname !== 'www.' + MWM_HOST) return;

    e.preventDefault();
    e.stopPropagation();
    openOverlay(url.href);
  }

  if (!isTikTokInApp()) return;
  // capture指定: サイト側の他のクリックハンドラより先に奪う
  document.addEventListener('click', handleClick, true);
})();
