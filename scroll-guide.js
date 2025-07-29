// ガイドシステムの制御（リロード→スクロール）
(function() {
    let hasScrolled = false;
    let hasReloaded = false;
    const reloadGuide = document.getElementById('reloadGuide');
    const scrollGuide = document.getElementById('scrollGuide');
    
    if (!reloadGuide || !scrollGuide) return;

    // リロード済みかチェック
    const reloadCompleted = localStorage.getItem('appriver_reload_completed');
    // スクロール済みかチェック
    const scrollCompleted = localStorage.getItem('appriver_scroll_completed');
    
    // リロードガイド表示関数
    function showReloadGuide() {
        // リロード済みの場合は表示しない
        if (reloadCompleted) {
            return;
        }
        
        reloadGuide.style.display = 'block';
        setTimeout(() => {
            reloadGuide.style.opacity = '1';
        }, 100);
    }

    // リロードガイド非表示してスクロールガイド表示
    function hideReloadGuide() {
        reloadGuide.style.opacity = '0';
        setTimeout(() => {
            reloadGuide.style.display = 'none';
            // 2秒後にスクロールガイド表示
            setTimeout(showScrollGuide, 2000);
        }, 500);
    }

    // スクロールガイド表示関数
    function showScrollGuide() {
        // スクロール済みの場合は表示しない
        if (scrollCompleted) {
            return;
        }
        
        scrollGuide.style.display = 'block';
        setTimeout(() => {
            scrollGuide.style.opacity = '1';
        }, 100);
    }

    // スクロールガイド非表示関数
    function hideScrollGuide() {
        scrollGuide.style.opacity = '0';
        setTimeout(() => {
            scrollGuide.style.display = 'none';
        }, 500);
        // スクロール完了をLocalStorageに記録
        localStorage.setItem('appriver_scroll_completed', 'true');
    }

    // スクロール検知
    function handleScroll() {
        const scrollY = window.scrollY || window.pageYOffset;
        
        if (!hasScrolled && scrollY > 100) {
            hasScrolled = true;
            hideScrollGuide();
        }
    }

    // リロード検知（PWAリロード完了時に呼ばれる）
    window.reloadCompleted = function() {
        localStorage.setItem('appriver_reload_completed', 'true');
        // リロード実行時にリロードガイドを非表示（スクロールガイドは独立して動作）
        if (reloadGuide.style.display === 'block') {
            reloadGuide.style.opacity = '0';
            setTimeout(() => {
                reloadGuide.style.display = 'none';
            }, 500);
        }
    };

    // イベントリスナー設定
    window.addEventListener('scroll', handleScroll, {passive: true});

    // 初期化
    function init() {
        // リロードガイドの初期化（リロード未完了の場合のみ）
        if (!reloadCompleted) {
            // 2秒後にリロードガイド表示（ダブルタップされるまで表示継続）
            setTimeout(() => {
                showReloadGuide();
            }, 2000);
        }
        
        // スクロールガイドの独立した初期化（スクロール未完了の場合のみ）
        if (!scrollCompleted) {
            // 5秒後にスクロールガイド表示（スクロールされるまで表示継続）
            setTimeout(() => {
                if (!hasScrolled) {
                    showScrollGuide();
                }
            }, 5000);
        }
    }

    // ページ読み込み完了時に初期化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();