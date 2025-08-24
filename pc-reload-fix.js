// PC用リロード時のホーム戻り機能
(function() {
    'use strict';
    
    // デスクトップ/PC判定
    function isDesktop() {
        return window.innerWidth > 768;
    }
    
    // PCでない場合は処理を停止
    if (!isDesktop()) return;
    
    // ページロード時の処理
    function handlePageLoad() {
        // リロード検知フラグがあるかチェック
        const wasReloaded = sessionStorage.getItem('pc_page_reloaded');
        
        if (wasReloaded) {
            // リロード後の処理
            sessionStorage.removeItem('pc_page_reloaded');
            
            // URLにハッシュがある場合はクリアしてホームに戻る
            if (window.location.hash) {
                // ハッシュをクリア
                history.replaceState(null, null, window.location.pathname + window.location.search);
                
                // ホームセクションにスクロール
                setTimeout(() => {
                    const homeSection = document.getElementById('home');
                    if (homeSection) {
                        homeSection.scrollIntoView({ behavior: 'smooth' });
                    } else {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                }, 100);
            }
        }
    }
    
    // beforeunload イベントでリロード検知フラグを設定
    function handleBeforeUnload() {
        // F5、Ctrl+R、ブラウザのリロードボタンなどでリロードされる前に実行
        sessionStorage.setItem('pc_page_reloaded', 'true');
    }
    
    // リサイズ時にデスクトップでなくなった場合はイベントリスナーを削除
    function handleResize() {
        if (!isDesktop()) {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        }
    }
    
    // イベントリスナー設定
    function init() {
        // ページアンロード直前のイベント
        window.addEventListener('beforeunload', handleBeforeUnload);
        
        // リサイズ監視
        window.addEventListener('resize', handleResize);
        
        // ページロード時の処理実行
        handlePageLoad();
    }
    
    // 初期化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();