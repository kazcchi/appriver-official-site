// ガイドシステムの制御（リロード→スクロール）
(function() {
    let hasScrolled = false;
    let hasReloaded = false;
    const reloadGuide = document.getElementById('reloadGuide');
    const scrollGuide = document.getElementById('scrollGuide');
    
    if (!reloadGuide || !scrollGuide) return;

    // リロードガイド表示関数
    function showReloadGuide() {
        // 既に表示済みかチェック
        if (localStorage.getItem('appriver_guides_shown')) {
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
            showScrollGuide();
        }, 500);
    }

    // スクロールガイド表示関数
    function showScrollGuide() {
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
        localStorage.setItem('appriver_guides_shown', 'true');
    }

    // スクロール検知
    function handleScroll() {
        const scrollY = window.scrollY || window.pageYOffset;
        
        if (!hasScrolled && scrollY > 100) {
            hasScrolled = true;
            hideScrollGuide();
        }
    }

    // イベントリスナー設定
    window.addEventListener('scroll', handleScroll, {passive: true});

    // 初期化
    function init() {
        // 3秒後にリロードガイド表示
        setTimeout(() => {
            if (!hasScrolled) {
                showReloadGuide();
            }
        }, 3000);

        // 8秒後にスクロールガイドに切り替え
        setTimeout(() => {
            if (!hasScrolled) {
                hideReloadGuide();
            }
        }, 8000);

        // 25秒後に自動非表示
        setTimeout(() => {
            if (!hasScrolled) {
                hideScrollGuide();
            }
        }, 25000);
    }

    // ページ読み込み完了時に初期化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();