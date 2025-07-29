// PWA Controls - リロード機能の改善
(function() {
    // PWA状態検出
    const isPWA = window.matchMedia('(display-mode: standalone)').matches || 
                  window.navigator.standalone ||
                  document.referrer.includes('android-app://');
    
    console.log('PWA Mode:', isPWA);
    
    // PWAの場合、フルスクリーン対応
    if (isPWA) {
        document.documentElement.style.setProperty('--safe-area-inset-top', 'env(safe-area-inset-top)');
        document.documentElement.style.setProperty('--safe-area-inset-bottom', 'env(safe-area-inset-bottom)');
        document.body.classList.add('pwa-mode');
    }
    // Service Worker登録（キャッシュ管理用）
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js').then(function(registration) {
                console.log('ServiceWorker registration successful');
                
                // 更新があった場合の処理
                registration.addEventListener('updatefound', function() {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', function() {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // 新しいバージョンが利用可能
                            if (confirm('サイトの新しいバージョンが利用可能です。更新しますか？')) {
                                window.location.reload();
                            }
                        }
                    });
                });
            }).catch(function(error) {
                console.log('ServiceWorker registration failed: ', error);
            });
        });
    }

    // Pull-to-refresh機能（iOS PWA対応）
    let startY = 0;
    let currentY = 0;
    let pullThreshold = 80;
    let isRefreshing = false;
    let isPulling = false;

    // プルリフレッシュインジケーター作成
    const pullIndicator = document.createElement('div');
    pullIndicator.id = 'pull-indicator';
    pullIndicator.innerHTML = '↓ ひっぱって更新';
    pullIndicator.style.cssText = `
        position: fixed;
        top: -60px;
        left: 50%;
        transform: translateX(-50%);
        background: #e8a48b;
        color: white;
        padding: 10px 20px;
        border-radius: 0 0 10px 10px;
        font-size: 14px;
        font-weight: bold;
        z-index: 9999;
        transition: top 0.3s ease-out;
        text-align: center;
    `;
    document.body.appendChild(pullIndicator);

    // タッチ開始
    document.addEventListener('touchstart', function(e) {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop <= 5) { // より厳しい条件
            startY = e.touches[0].clientY;
            isPulling = true;
        }
    }, {passive: false});

    // タッチ移動
    document.addEventListener('touchmove', function(e) {
        if (!isPulling || isRefreshing) return;
        
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > 5) {
            isPulling = false;
            return;
        }

        currentY = e.touches[0].clientY;
        const pullDistance = currentY - startY;
        
        if (pullDistance > 0) {
            e.preventDefault(); // スクロールを防ぐ
            
            const dampedDistance = Math.min(pullDistance * 0.4, 60);
            document.body.style.transform = `translateY(${dampedDistance}px)`;
            document.body.style.transition = 'none';
            
            if (pullDistance > pullThreshold) {
                pullIndicator.innerHTML = '↑ はなして更新';
                pullIndicator.style.backgroundColor = '#d49175';
                pullIndicator.style.top = '10px';
            } else {
                pullIndicator.innerHTML = '↓ ひっぱって更新';
                pullIndicator.style.backgroundColor = '#e8a48b';
                pullIndicator.style.top = `${dampedDistance - 50}px`;
            }
        }
    }, {passive: false});

    // タッチ終了
    document.addEventListener('touchend', function(e) {
        if (!isPulling) return;
        
        const pullDistance = currentY - startY;
        
        document.body.style.transition = 'transform 0.3s ease-out';
        document.body.style.transform = '';
        pullIndicator.style.top = '-60px';
        
        if (pullDistance > pullThreshold && !isRefreshing) {
            isRefreshing = true;
            pullIndicator.innerHTML = '更新中...';
            pullIndicator.style.top = '10px';
            
            setTimeout(() => {
                // リロード完了フラグを設定
                if (typeof window.reloadCompleted === 'function') {
                    window.reloadCompleted();
                }
                window.location.reload();
            }, 500);
        }
        
        startY = 0;
        currentY = 0;
        isPulling = false;
    }, {passive: false});

    // ダブルタップでリロード（iOS PWA用）
    let lastTap = 0;
    document.addEventListener('touchend', function(e) {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;
        
        if (tapLength < 500 && tapLength > 0) {
            // ダブルタップ検出
            e.preventDefault();
            // リロード完了フラグを設定（確認なしで即実行）
            if (typeof window.reloadCompleted === 'function') {
                window.reloadCompleted();
            }
            window.location.reload();
        }
        lastTap = currentTime;
    });

    // キーボードショートカット（開発用）
    document.addEventListener('keydown', function(e) {
        if ((e.metaKey || e.ctrlKey) && e.key === 'r') {
            e.preventDefault();
            window.location.reload();
        }
    });

    console.log('PWA Controls loaded: Pull-to-refresh and reload functions enabled');
})();