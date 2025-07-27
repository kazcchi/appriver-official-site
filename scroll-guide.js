// スクロールガイドの制御
(function() {
    let hasScrolled = false;
    const scrollGuide = document.getElementById('scrollGuide');
    
    if (!scrollGuide) return;

    // ガイド表示関数
    function showGuide() {
        // 既に表示済みかチェック
        if (localStorage.getItem('appriver_scroll_guide_shown')) {
            return;
        }
        
        scrollGuide.style.display = 'block';
        setTimeout(() => {
            scrollGuide.style.opacity = '1';
        }, 100);
    }

    // ガイド非表示関数
    function hideGuide() {
        scrollGuide.style.opacity = '0';
        setTimeout(() => {
            scrollGuide.style.display = 'none';
        }, 500);
        localStorage.setItem('appriver_scroll_guide_shown', 'true');
    }

    // スクロール検知
    function handleScroll() {
        const scrollY = window.scrollY || window.pageYOffset;
        
        if (!hasScrolled && scrollY > 100) {
            hasScrolled = true;
            hideGuide();
        }
    }

    // イベントリスナー設定
    window.addEventListener('scroll', handleScroll, {passive: true});

    // 初期化
    function init() {
        // 3秒後にガイド表示
        setTimeout(() => {
            if (!hasScrolled) {
                showGuide();
            }
        }, 3000);

        // 20秒後に自動非表示
        setTimeout(() => {
            if (!hasScrolled) {
                hideGuide();
            }
        }, 20000);
    }

    // ページ読み込み完了時に初期化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();