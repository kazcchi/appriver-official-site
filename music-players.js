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
    // より確実にプレイヤーコンテナを見つける
    const playerContainer = document.querySelector('#youtube-player iframe') || 
                           document.querySelector('.youtube-player-left iframe');
    
    if (playerContainer) {
        // 既存のiframeを置き換えるため、コンテナを準備
        const container = playerContainer.parentElement;
        const playerId = 'youtube-player-api';
        
        // 新しいdiv要素を作成
        const playerDiv = document.createElement('div');
        playerDiv.id = playerId;
        playerDiv.style.width = '100%';
        playerDiv.style.height = '350px';
        playerDiv.style.borderRadius = '12px';
        
        // 既存のiframeを置き換え
        container.replaceChild(playerDiv, playerContainer);
        
        // YouTube Playerオブジェクトを作成
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
        
        console.log('YouTube Player API object created');
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
    
    if (event.data === YT.PlayerState.ENDED) {
        console.log('Video ended, playing next track');
        setTimeout(() => {
            playNextTrack();
        }, 1000);
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

    // Initialize with Spotify as default
    console.log('Music Players initialized - Spotify active by default');
    
    // YouTube tracklist generation
    generateYouTubeTracklist();
    
    // YouTube playlist controls
    const repeatBtn = document.getElementById('repeat-btn');
    const shuffleBtn = document.getElementById('shuffle-btn');
    
    if (repeatBtn) {
        repeatBtn.addEventListener('click', () => {
            repeatBtn.classList.toggle('active');
            if (repeatBtn.classList.contains('active')) {
                shuffleBtn.classList.remove('active');
                console.log('Repeat mode: ON');
            } else {
                console.log('Repeat mode: OFF');
            }
        });
    }
    
    if (shuffleBtn) {
        shuffleBtn.addEventListener('click', () => {
            shuffleBtn.classList.toggle('active');
            if (shuffleBtn.classList.contains('active')) {
                repeatBtn.classList.remove('active');
                console.log('Shuffle mode: ON');
            } else {
                console.log('Shuffle mode: OFF');
            }
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
    
    // 最新順でソート（最新曲が上）
    const displayOrder = youTubeSongs.sort((a, b) => new Date(b[1].releaseDate) - new Date(a[1].releaseDate));
    
    // 番号を降順で付ける（最新曲が最大番号）
    const totalSongs = displayOrder.length;

    // HTMLを生成
    const tracklistHTML = displayOrder.map(([id, data], index) => {
        const trackNumber = String(totalSongs - index).padStart(2, '0'); // 降順番号
        return `
            <div class="index-track" data-video-id="${data.youtubeVideoId}" data-track-index="${index}">
                <span class="track-num">${trackNumber}</span>
                <span class="track-name">${data.title}</span>
                <button class="select-btn">再生</button>
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
        const playBtn = track.querySelector('.select-btn');
        const videoId = track.dataset.videoId;
        const trackIndex = parseInt(track.dataset.trackIndex);
        const trackName = track.querySelector('.track-name').textContent;
        
        if (playBtn && videoId) {
            playBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                
                playTrack(trackIndex, trackItems);
            });
        }
    });
}

// 現在の再生状態を管理
let currentPlayingIndex = -1;

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
    
    // ボタンのテキストを一時的に変更
    if (playBtn) {
        const originalText = playBtn.textContent;
        playBtn.textContent = '再生中';
        setTimeout(() => {
            if (currentPlayingIndex === trackIndex) {
                playBtn.textContent = originalText;
            }
        }, 2000);
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