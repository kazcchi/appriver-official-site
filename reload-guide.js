// リロードガイドシステム - モバイル専用
(function() {
    // モバイルかどうかをチェック
    function isMobile() {
        return window.innerWidth <= 768;
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
    document.addEventListener('touchend', function(e) {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;
        
        if (tapLength < 500 && tapLength > 0) {
            // ダブルタップ検出
            e.preventDefault();
            hideReloadGuide();
            // 実際のリロード実行
            setTimeout(() => {
                window.location.reload();
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
})();