// YouTube Player APIの準備
let ytPlayer = null;
let currentTrackItems = null;
let isPlayerReady = false;

// YouTube Player APIスクリプトを読み込み
function loadYouTubeAPI() {
    if (!window.YT) {
        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(script);
    }
}

// YouTube Player APIが読み込まれた時のコールバック
window.onYouTubeIframeAPIReady = function() {
    console.log('YouTube API ready');
    isPlayerReady = true;
    // 初期化はYouTubeタブが表示された時に実行
};

// YouTube Playerオブジェクトを初期化
function initializeYouTubePlayer() {
    // 新しいコンテナIDを使用（プレイリスト削除後）
    const playerContainer = document.getElementById('youtube-player-container');
    
    if (playerContainer) {
        const playerId = 'youtube-player-api';
        
        // コンテナをPlayer API用に設定
        playerContainer.id = playerId;
        
        // YouTube Playerオブジェクトを作成（プレイリストなし）
        ytPlayer = new YT.Player(playerId, {
            height: '350',
            width: '100%',
            playerVars: {
                autoplay: 0,
                rel: 0,
                modestbranding: 1,
                iv_load_policy: 3,
                controls: 1
            },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
        
        console.log('YouTube Player API object created (playlist removed)');
    } else {
        console.log('Player container not found');
    }
}

// プレイヤー準備完了時のコールバック
function onPlayerReady(event) {
    console.log('YouTube Player ready');
    // プレイヤーが準備できたら、楽曲リストのイベントリスナーを再設定
    setTimeout(() => {
        addTrackPlayListeners();
    }, 100);
}

// プレイヤー状態変更時のコールバック
function onPlayerStateChange(event) {
    console.log('Player state changed:', event.data);
    
    // 状態に応じて表示を更新
    switch (event.data) {
        case YT.PlayerState.PLAYING:
            updateTrackStatus('再生中');
            updateCurrentTrackButton('playing');
            break;
        case YT.PlayerState.PAUSED:
            updateTrackStatus('一時停止');
            updateCurrentTrackButton('paused');
            break;
        case YT.PlayerState.BUFFERING:
            updateTrackStatus('読み込み中');
            updateCurrentTrackButton('loading');
            break;
        case YT.PlayerState.ENDED:
            updateTrackStatus('終了');
            updateCurrentTrackButton('paused');
            console.log('Video ended, playing next track');
            setTimeout(() => {
                playNextTrack();
            }, 1000);
            break;
        case YT.PlayerState.CUED:
            updateTrackStatus('準備完了');
            updateCurrentTrackButton('paused');
            break;
    }
}

// 現在再生中楽曲のボタン状態更新
function updateCurrentTrackButton(state) {
    if (currentPlayingIndex === -1 || !currentTrackItems) return;
    
    const currentTrack = currentTrackItems[currentPlayingIndex];
    if (currentTrack) {
        const playPauseBtn = currentTrack.querySelector('.play-pause-btn');
        updateButtonState(playPauseBtn, state);
    }
}

// 楽曲情報更新関数
function updateTrackInfo(trackTitle, status = null) {
    const titleElement = document.getElementById('current-track-title');
    if (titleElement) {
        titleElement.textContent = trackTitle;
    }
    
    if (status) {
        updateTrackStatus(status);
    }
}

// 再生状態更新関数
function updateTrackStatus(status) {
    const statusElement = document.getElementById('track-status');
    if (statusElement) {
        statusElement.textContent = status;
        
        // 状態に応じてスタイルを変更
        statusElement.className = 'track-status';
        if (status === '再生中') {
            statusElement.classList.add('playing');
        } else if (status === '一時停止') {
            statusElement.classList.add('paused');
        } else if (status === '読み込み中') {
            statusElement.classList.add('loading');
        }
    }
}

// Music Players Platform Switcher
document.addEventListener('DOMContentLoaded', () => {
    const platformButtons = document.querySelectorAll('.platform-btn');
    const playerEmbeds = document.querySelectorAll('.player-embed');

    // YouTube APIを読み込み
    loadYouTubeAPI();

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
                
                // YouTubeプレイヤーが表示された時にAPIプレイヤーを初期化
                if (platform === 'youtube' && !ytPlayer) {
                    if (isPlayerReady) {
                        setTimeout(() => {
                            initializeYouTubePlayer();
                        }, 500);
                    } else {
                        // APIがまだ読み込まれていない場合は、読み込み完了を待つ
                        const checkAPI = setInterval(() => {
                            if (isPlayerReady) {
                                clearInterval(checkAPI);
                                initializeYouTubePlayer();
                            }
                        }, 100);
                    }
                }
            }

            console.log(`Switched to ${platform} player`);
        });
    });

    // Initialize with Apple Music as default
    console.log('Music Players initialized - Apple Music active by default');
    
    // YouTube tracklist generation
    generateYouTubeTracklist();
    
    // セクション移動リスナーを設定
    setupSectionChangeListener();
    
    // YouTube sort controls
    const latestReleaseBtn = document.getElementById('youtube-sort-release');
    const oldestFirstBtn = document.getElementById('youtube-sort-oldest');
    
    if (latestReleaseBtn) {
        latestReleaseBtn.addEventListener('click', () => {
            setYouTubeSortMode('release', 'desc');
        });
    }
    
    if (oldestFirstBtn) {
        oldestFirstBtn.addEventListener('click', () => {
            setYouTubeSortMode('release', 'asc');
        });
    }

});

// YouTube楽曲リスト動的生成関数
function generateYouTubeTracklist() {
    const tracklistContainer = document.getElementById('youtube-tracklist');
    if (!tracklistContainer || typeof songsData === 'undefined') {
        return;
    }

    // songs-data.js からYouTube動画IDを持つ楽曲のみ取得
    const youTubeSongs = Object.entries(songsData)
        .filter(([id, data]) => data.youtubeVideoId);
    
    // 現在のソート設定に応じてソート
    let displayOrder;
    if (youtubeSortOrder === 'desc') {
        // 最新順（降順）
        displayOrder = youTubeSongs.sort((a, b) => new Date(b[1].releaseDate) - new Date(a[1].releaseDate));
    } else {
        // 古い順（昇順）
        displayOrder = youTubeSongs.sort((a, b) => new Date(a[1].releaseDate) - new Date(b[1].releaseDate));
    }
    
    // 番号付けのための全楽曲数
    const totalSongs = displayOrder.length;

    // HTMLを生成（番号付けもソート順に応じて調整）
    const tracklistHTML = displayOrder.map(([id, data], index) => {
        let trackNumber;
        if (youtubeSortOrder === 'desc') {
            // 最新順の場合：最新曲が最大番号
            trackNumber = String(totalSongs - index).padStart(2, '0');
        } else {
            // 古い順の場合：古い曲が1番
            trackNumber = String(index + 1).padStart(2, '0');
        }
        
        return `
            <div class="index-track" data-video-id="${data.youtubeVideoId}" data-track-index="${index}" data-song-id="${id}">
                <span class="track-num">${trackNumber}</span>
                <span class="track-name">${data.title}</span>
                <button class="play-pause-btn" data-state="paused">
                    <i class="fas fa-play"></i>
                </button>
            </div>
        `;
    }).join('');

    tracklistContainer.innerHTML = tracklistHTML;
    
    // 再生ボタンのイベントリスナーを追加
    addTrackPlayListeners();
    
    console.log(`YouTube tracklist generated: ${youTubeSongs.length} tracks`);
}

// 楽曲再生ボタンのイベントリスナー追加
function addTrackPlayListeners() {
    const trackItems = document.querySelectorAll('.index-track');
    
    trackItems.forEach(track => {
        const playPauseBtn = track.querySelector('.play-pause-btn');
        const videoId = track.dataset.videoId;
        const trackIndex = parseInt(track.dataset.trackIndex);
        const songId = track.dataset.songId;
        const trackName = track.querySelector('.track-name').textContent;
        
        if (playPauseBtn && videoId) {
            playPauseBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                
                const currentState = playPauseBtn.dataset.state;
                const isCurrentTrack = currentPlayingIndex === trackIndex;
                
                if (isCurrentTrack && currentState === 'playing') {
                    // 現在再生中の楽曲を一時停止
                    pauseTrack();
                } else if (isCurrentTrack && currentState === 'paused') {
                    // 現在の楽曲を再開
                    resumeTrack();
                } else {
                    // 新しい楽曲を再生
                    playTrack(trackIndex, trackItems);
                }
            });
        }
    });
}

// 現在の再生状態を管理
let currentPlayingIndex = -1;

// YouTube プレイヤーのソート状態管理
let youtubeSortType = 'release'; // 'release' 
let youtubeSortOrder = 'desc';   // 'desc' = 最新順, 'asc' = 古い順

// 楽曲再生関数
function playTrack(trackIndex, trackItems, youtubeIframe = null) {
    const track = trackItems[trackIndex];
    if (!track) return;
    
    const videoId = track.dataset.videoId;
    const trackName = track.querySelector('.track-name').textContent;
    const playBtn = track.querySelector('.select-btn');
    
    // 現在の再生インデックスを更新
    currentPlayingIndex = trackIndex;
    currentTrackItems = trackItems;
    
    // 選択された楽曲をハイライト
    trackItems.forEach(item => item.classList.remove('playing'));
    track.classList.add('playing');
    
    // 楽曲情報を表示エリアに更新
    updateTrackInfo(trackName, '再生準備中');
    
    // YouTube Player APIオブジェクトを使用して動画を再生
    if (ytPlayer && typeof ytPlayer.loadVideoById === 'function') {
        ytPlayer.loadVideoById({
            videoId: videoId,
            startSeconds: 0
        });
        console.log(`Playing: ${trackName} (${videoId})`);
    } else {
        console.log('YouTube Player not ready yet, will retry...');
        // プレイヤーが準備できていない場合、少し待ってから再試行
        setTimeout(() => {
            if (ytPlayer && typeof ytPlayer.loadVideoById === 'function') {
                ytPlayer.loadVideoById({
                    videoId: videoId,
                    startSeconds: 0
                });
                console.log(`Playing: ${trackName} (${videoId})`);
            }
        }, 2000);
    }
    
    // ボタン状態を更新
    updateAllPlayPauseButtons();
    
    // 選択された楽曲のボタンを再生状態に
    const currentTrack = currentTrackItems[trackIndex];
    if (currentTrack) {
        const playPauseBtn = currentTrack.querySelector('.play-pause-btn');
        updateButtonState(playPauseBtn, 'loading');
    }
}

// 一時停止機能
function pauseTrack() {
    if (ytPlayer && typeof ytPlayer.pauseVideo === 'function') {
        ytPlayer.pauseVideo();
        console.log('Video paused');
    }
}

// 再開機能
function resumeTrack() {
    if (ytPlayer && typeof ytPlayer.playVideo === 'function') {
        ytPlayer.playVideo();
        console.log('Video resumed');
    }
}

// 全ボタン状態更新
function updateAllPlayPauseButtons() {
    const allTracks = document.querySelectorAll('.index-track');
    allTracks.forEach((track, index) => {
        const playPauseBtn = track.querySelector('.play-pause-btn');
        if (playPauseBtn) {
            if (index === currentPlayingIndex) {
                // 現在再生中の楽曲は状態に応じて更新される
            } else {
                // その他の楽曲は停止状態
                updateButtonState(playPauseBtn, 'paused');
            }
        }
    });
}

// ボタン状態更新
function updateButtonState(button, state) {
    if (!button) return;
    
    const icon = button.querySelector('i');
    button.dataset.state = state;
    
    switch (state) {
        case 'playing':
            icon.className = 'fas fa-pause';
            button.title = '一時停止';
            break;
        case 'paused':
            icon.className = 'fas fa-play';
            button.title = '再生';
            break;
        case 'loading':
            icon.className = 'fas fa-spinner fa-spin';
            button.title = '読み込み中';
            break;
    }
}

// 次の曲を再生する関数
function playNextTrack() {
    if (currentPlayingIndex === -1 || !currentTrackItems) return;
    
    const nextIndex = currentPlayingIndex + 1;
    
    if (nextIndex < currentTrackItems.length) {
        console.log(`Auto-playing next track: ${nextIndex}`);
        playTrack(nextIndex, currentTrackItems);
    } else {
        console.log('Playlist completed - restarting from top');
        playTrack(0, currentTrackItems);
    }
}

// YouTubeソート機能設定
function setYouTubeSortMode(sortType, sortOrder) {
    youtubeSortType = sortType;
    youtubeSortOrder = sortOrder;
    
    // ボタン状態更新
    updateYouTubeSortButtons();
    
    // 楽曲リスト再生成
    generateYouTubeTracklist();
    
    console.log(`YouTube sort: ${sortType} ${sortOrder}`);
}

// YouTubeソートボタンの状態更新
function updateYouTubeSortButtons() {
    const latestBtn = document.getElementById('youtube-sort-release');
    const oldestBtn = document.getElementById('youtube-sort-oldest');
    
    // 全ボタンのアクティブ状態をリセット
    [latestBtn, oldestBtn].forEach(btn => {
        if (btn) {
            btn.classList.remove('sort-active', 'sort-desc', 'sort-asc');
        }
    });
    
    // 現在のソート状態に応じてアクティブ化
    if (youtubeSortOrder === 'desc' && latestBtn) {
        latestBtn.classList.add('sort-active', 'sort-desc');
    } else if (youtubeSortOrder === 'asc' && oldestBtn) {
        oldestBtn.classList.add('sort-active', 'sort-asc');
    }
}

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
    
    console.log(`Stopped all players except ${currentPlatform}`);
}

// YouTube Player停止
function stopYouTubePlayer() {
    if (ytPlayer && typeof ytPlayer.pauseVideo === 'function') {
        ytPlayer.pauseVideo();
        updateTrackInfo('楽曲を選択してください', '待機中');
        updateAllPlayPauseButtons();
        console.log('YouTube player stopped');
    }
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
    console.log('All music players stopped');
}

// 現在のセクションを取得
function getCurrentSection() {
    const sections = ['home', 'songs-lyrics', 'album', 'music-players', 'links'];
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

