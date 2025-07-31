// スワイプガイドシステム - モバイル専用
(function() {
    // モバイルかどうかをチェック
    function isMobile() {
        return window.innerWidth <= 768;
    }
    
    // モバイルでない場合は処理を停止
    if (!isMobile()) return;
    
    const swipeGuide = document.getElementById('swipeGuide');
    const slider = document.querySelector('.song-slider');
    if (!swipeGuide || !slider) return;
    
    // スワイプ完了済みかチェック
    const swipeCompleted = localStorage.getItem('appriver_swipe_completed');
    
    // ガイド表示関数
    function showSwipeGuide() {
        if (swipeCompleted) return;
        
        swipeGuide.style.display = 'block';
        swipeGuide.style.opacity = '1';
        swipeGuide.style.zIndex = '9999';
    }
    
    // ガイド非表示関数
    function hideSwipeGuide() {
        swipeGuide.style.opacity = '0';
        setTimeout(() => {
            swipeGuide.style.display = 'none';
        }, 500);
        // LocalStorageに完了フラグを設定
        localStorage.setItem('appriver_swipe_completed', 'true');
    }
    
    // スワイプ検知
    let touchStartX = 0;
    let touchStartY = 0;
    
    function handleTouchStart(e) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }
    
    function handleTouchEnd(e) {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const diffX = Math.abs(touchStartX - touchEndX);
        const diffY = Math.abs(touchStartY - touchEndY);
        
        // 水平スワイプ（50px以上、垂直移動は水平移動の半分以下）
        if (diffX > 50 && diffY < diffX / 2) {
            hideSwipeGuide();
            // イベントリスナー削除
            slider.removeEventListener('touchstart', handleTouchStart);
            slider.removeEventListener('touchend', handleTouchEnd);
        }
    }
    
    // スワイプイベント追加
    slider.addEventListener('touchstart', handleTouchStart, {passive: true});
    slider.addEventListener('touchend', handleTouchEnd, {passive: true});
    
    // リサイズ時にモバイルでなくなった場合はガイドを非表示
    window.addEventListener('resize', () => {
        if (!isMobile()) {
            swipeGuide.style.display = 'none';
        }
    });
    
    // 初期化
    function init() {
        if (!swipeCompleted) {
            // 4秒後にガイド表示
            setTimeout(() => {
                showSwipeGuide();
            }, 4000);
        }
    }
    
    // ページ読み込み完了時に初期化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();