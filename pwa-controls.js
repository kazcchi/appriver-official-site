// PWA Controls - リロード機能の改善
(function() {
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

    // Pull-to-refresh機能
    let startY = 0;
    let currentY = 0;
    let pullThreshold = 100;
    let isRefreshing = false;

    // タッチ開始
    document.addEventListener('touchstart', function(e) {
        if (window.scrollY === 0) {
            startY = e.touches[0].clientY;
        }
    }, {passive: true});

    // タッチ移動
    document.addEventListener('touchmove', function(e) {
        if (window.scrollY === 0 && !isRefreshing) {
            currentY = e.touches[0].clientY;
            const pullDistance = currentY - startY;
            
            if (pullDistance > 0) {
                // プルダウン表示
                document.body.style.transform = `translateY(${Math.min(pullDistance / 3, 50)}px)`;
                document.body.style.transition = 'none';
                
                if (pullDistance > pullThreshold) {
                    // リフレッシュ可能状態
                    document.body.style.backgroundColor = '#e8a48b20';
                }
            }
        }
    }, {passive: true});

    // タッチ終了
    document.addEventListener('touchend', function(e) {
        if (window.scrollY === 0 && !isRefreshing) {
            const pullDistance = currentY - startY;
            
            document.body.style.transition = 'transform 0.3s ease-out, background-color 0.3s ease-out';
            document.body.style.transform = '';
            document.body.style.backgroundColor = '';
            
            if (pullDistance > pullThreshold) {
                // リロード実行
                isRefreshing = true;
                setTimeout(() => {
                    window.location.reload();
                }, 300);
            }
        }
        startY = 0;
        currentY = 0;
    }, {passive: true});

    // ダブルタップでリロード（iOS PWA用）
    let lastTap = 0;
    document.addEventListener('touchend', function(e) {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;
        
        if (tapLength < 500 && tapLength > 0) {
            // ダブルタップ検出
            e.preventDefault();
            if (confirm('ページを更新しますか？')) {
                window.location.reload();
            }
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