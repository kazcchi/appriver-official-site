






// Music Players Platform Switcher
document.addEventListener('DOMContentLoaded', () => {
    const platformButtons = document.querySelectorAll('.platform-btn');
    const playerEmbeds = document.querySelectorAll('.player-embed');


    // Platform switching functionality
    platformButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Skip if coming soon
            if (button.classList.contains('coming-soon')) {
                return;
            }

            const platform = button.dataset.platform;

            // Update active button
            platformButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // 他のプラットフォームの再生を停止
            stopAllOtherPlayers(platform);

            // Show corresponding player
            playerEmbeds.forEach(embed => {
                embed.style.display = 'none';
            });

            const targetPlayer = document.getElementById(`${platform}-player`);
            if (targetPlayer) {
                targetPlayer.style.display = 'block';
                
            }

            console.log(`Switched to ${platform} player`);
        });
    });

    // Initialize with Apple Music as default
    console.log('Music Players initialized - Apple Music active by default');
    
    
    // セクション移動リスナーを設定
    setupSectionChangeListener();
    

});



// 全プラットフォーム停止機能
function stopAllOtherPlayers(currentPlatform) {
    // YouTube停止
    if (currentPlatform !== 'youtube') {
        stopYouTubePlayer();
    }
    
    // Spotify停止（iframe内なので完全制御は困難だが、非表示化）
    if (currentPlatform !== 'spotify') {
        stopSpotifyPlayer();
    }
    
    // Apple Music停止（iframe内なので完全制御は困難だが、非表示化）
    if (currentPlatform !== 'apple-music') {
        stopAppleMusicPlayer();
    }
    
    // Others停止
    if (currentPlatform !== 'others') {
        stopOthersPlayer();
    }
    
    console.log(`Stopped all players except ${currentPlatform}`);
}

// YouTube Player停止（直接リンク方式のため実質的な停止処理なし）
function stopYouTubePlayer() {
    // 直接リンク方式では埋め込みプレイヤーがないため、停止処理は不要
    // ただし、一貫性のためにログを出力
    console.log('YouTube player stopped (direct link mode)');
}

// Spotify Player停止（直接リンク方式のため実質的な停止処理なし）
function stopSpotifyPlayer() {
    // 直接リンク方式では埋め込みプレイヤーがないため、停止処理は不要
    // ただし、一貫性のためにログを出力
    console.log('Spotify player stopped (direct link mode)');
}

// Apple Music Player停止（直接リンク方式のため実質的な停止処理なし）
function stopAppleMusicPlayer() {
    // 直接リンク方式では埋め込みプレイヤーがないため、停止処理は不要
    // ただし、一貫性のためにログを出力
    console.log('Apple Music player stopped (direct link mode)');
}

// Others Player停止（直接リンク方式のため実質的な停止処理なし）
function stopOthersPlayer() {
    // 直接リンク方式では埋め込みプレイヤーがないため、停止処理は不要
    // ただし、一貫性のためにログを出力
    console.log('Others player stopped (direct link mode)');
}

// セクション移動検知とプレイヤー停止
function setupSectionChangeListener() {
    // ナビゲーションリンクにイベントリスナーを追加
    const navLinks = document.querySelectorAll('.nav-item');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // music-playersセクション以外に移動する場合、全プレイヤーを停止
            if (href && href !== '#music-players') {
                setTimeout(() => {
                    stopAllPlayers();
                }, 500); // スクロール完了後に停止
            }
        });
    });
    
    // スクロール検知でセクション移動を監視
    let lastSection = '';
    window.addEventListener('scroll', throttle(() => {
        const currentSection = getCurrentSection();
        
        if (currentSection !== lastSection && currentSection !== 'music-players') {
            if (lastSection === 'music-players') {
                // music-playersから離れる時に全プレイヤーを停止
                stopAllPlayers();
            }
            lastSection = currentSection;
        }
    }, 1000)); // 1秒間隔でチェック
}

// 全プレイヤー停止
function stopAllPlayers() {
    stopYouTubePlayer();
    stopSpotifyPlayer();
    stopAppleMusicPlayer();
    stopOthersPlayer();
    console.log('All music players stopped');
}

// 現在のセクションを取得
function getCurrentSection() {
    const sections = ['home', 'music-players', 'songs-lyrics', 'album', 'links'];
    const scrollTop = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const middle = scrollTop + windowHeight / 2;
    
    for (const sectionId of sections) {
        const section = document.getElementById(sectionId);
        if (section) {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            
            if (middle >= top && middle <= bottom) {
                return sectionId;
            }
        }
    }
    return 'home';
}

// スロットル関数
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

