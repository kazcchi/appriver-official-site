// [Codex] Enhanced search and sort functionality
// Optimized for dual-tool development workflow
// Supports real-time filtering and sorting of song catalog
// 検索・ソート機能実装
// SOW仕様: リアルタイム検索、リリース順・50音順ソート

class SearchSortManager {
  constructor() {
    this.currentSort = searchSortConfig.defaultSort;
    this.currentOrder = searchSortConfig.defaultOrder;
    this.currentSearch = '';
    this.allSongs = getSongsArray();
    this.filteredSongs = [...this.allSongs];
    this.isInitialized = false;
  }

  // 初期化
  init() {
    if (this.isInitialized) return;

    this.setupEventListeners();
    this.applySortAndFilter();
    this.isInitialized = true;
    console.log('SearchSortManager initialized');
  }

  // イベントリスナー設定
  setupEventListeners() {
    // 検索ボックス
    const searchInput = document.getElementById('song-search');
    if (searchInput) {
      searchInput.addEventListener(
        'input',
        this.debounce(e => {
          this.handleSearch(e.target.value);
        }, 300)
      );
    }

    // 検索クリアボタン
    const clearBtn = document.getElementById('search-clear');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.clearSearch();
      });
    }

    // ソートボタン
    const releaseSortBtn = document.getElementById('sort-release');
    const readingSortBtn = document.getElementById('sort-reading');

    if (releaseSortBtn) {
      releaseSortBtn.addEventListener('click', () => {
        this.handleSort('releaseDate');
      });
    }

    if (readingSortBtn) {
      readingSortBtn.addEventListener('click', () => {
        this.handleSort('reading');
      });
    }
  }

  // 検索処理
  handleSearch(query) {
    this.currentSearch = query.toLowerCase().trim();
    this.applySortAndFilter();
    this.updateSearchUI();
  }

  // 検索クリア
  clearSearch() {
    // 現在表示中の楽曲（検索結果で中央に表示されている楽曲）を記録
    const currentIndex = this.getCurrentIndex();
    const currentDisplayedSong =
      this.filteredSongs.length > currentIndex ? this.filteredSongs[currentIndex] : null;

    this.currentSearch = '';
    const searchInput = document.getElementById('song-search');
    if (searchInput) {
      searchInput.value = '';
    }

    // 検索をクリアして全楽曲を表示
    this.applySortAndFilter();

    // 検索結果で中央表示されていた楽曲があれば、それをトップに移動
    if (currentDisplayedSong) {
      this.moveTargetSongToTop(currentDisplayedSong);
    }

    this.updateSearchUI();
  }

  // ソート処理
  handleSort(sortType) {
    if (this.currentSort === sortType) {
      // 同じソートタイプの場合は昇順・降順を切り替え
      this.currentOrder = this.currentOrder === 'asc' ? 'desc' : 'asc';
    } else {
      // 違うソートタイプの場合はデフォルト順序
      this.currentSort = sortType;
      this.currentOrder = sortType === 'releaseDate' ? 'desc' : 'asc';
    }

    this.applySortAndFilter();
    this.updateSortUI();
  }

  // 検索フィルタリング
  filterSongs(songs, query) {
    if (!query) return songs;

    return songs.filter(song => {
      const titleMatch = song.title.toLowerCase().includes(query);
      const albumMatch = song.album.toLowerCase().includes(query);
      return titleMatch || albumMatch;
    });
  }

  // ソート処理
  sortSongs(songs, sortType, order) {
    const sorted = [...songs].sort((a, b) => {
      let comparison = 0;

      if (sortType === 'custom') {
        // displayPriority を優先（未指定は 0）
        const pa = typeof a.displayPriority === 'number' ? a.displayPriority : 0;
        const pb = typeof b.displayPriority === 'number' ? b.displayPriority : 0;
        if (pa !== pb) {
          comparison = pa - pb; // 後で order で反転
        } else {
          // 同優先度（=未指定同士など）はリリース日（降順既定）で安定化
          const sA = this.isValidReleaseDate(a.releaseDate) ? a.releaseDate : '0000-00-00';
          const sB = this.isValidReleaseDate(b.releaseDate) ? b.releaseDate : '0000-00-00';
          comparison = sA.localeCompare(sB);
        }
      } else if (sortType === 'releaseDate') {
        // 安定動作のため文字列比較（YYYY-MM-DD前提）
        const sA = this.isValidReleaseDate(a.releaseDate) ? a.releaseDate : '0000-00-00';
        const sB = this.isValidReleaseDate(b.releaseDate) ? b.releaseDate : '0000-00-00';
        if (!this.isValidReleaseDate(a.releaseDate)) {
          console.warn('[songs] invalid releaseDate (treated as oldest):', a.id, a.releaseDate);
        }
        if (!this.isValidReleaseDate(b.releaseDate)) {
          console.warn('[songs] invalid releaseDate (treated as oldest):', b.id, b.releaseDate);
        }
        comparison = sA.localeCompare(sB);

        // tie-breaker: 同一アルバムかつ同日リリースは displayPriority を優先
        if (comparison === 0) {
          const isSameAlbum = a.album && a.album === b.album;
          const isTokoshieAlbum =
            typeof a.album === 'string' &&
            typeof b.album === 'string' &&
            a.album.includes('TOKOSHIE') &&
            b.album.includes('TOKOSHIE');
          if (isSameAlbum || isTokoshieAlbum) {
            const pa = typeof a.displayPriority === 'number' ? a.displayPriority : 0;
            const pb = typeof b.displayPriority === 'number' ? b.displayPriority : 0;
            if (pa !== pb) {
              comparison = pa - pb; // order で反転、desc で大きい順が先頭
            } else {
              // さらに同一の場合は読みで安定化
              comparison = a.reading.localeCompare(b.reading, 'ja');
            }
          } else {
            // その他の同日リリースは読みで安定化
            comparison = a.reading.localeCompare(b.reading, 'ja');
          }
        }
      } else if (sortType === 'reading') {
        comparison = a.reading.localeCompare(b.reading, 'ja');
      }

      return order === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }

  // リリース日形式の簡易バリデーション（YYYY-MM-DD）
  isValidReleaseDate(dateStr) {
    return typeof dateStr === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
  }

  // ソート・フィルタの適用
  applySortAndFilter() {
    // 検索フィルタリング
    const filtered = this.filterSongs(this.allSongs, this.currentSearch);

    // ソート
    this.filteredSongs = this.sortSongs(filtered, this.currentSort, this.currentOrder);

    // スライダー更新
    this.updateSliderDisplay();
  }

  // スライダー表示更新
  updateSliderDisplay() {
    const track = document.querySelector('.slider-track');
    if (!track) return;

    // 既存のカードを削除
    track.innerHTML = '';

    // フィルタされた楽曲でカードを生成
    this.filteredSongs.forEach((song, index) => {
      const card = this.createSongCard(song, index);
      track.appendChild(card);
    });

    // スライダーの再初期化（既存のスライダー機能との統合）
    this.reinitializeSlider();

    console.log(`表示楽曲数: ${this.filteredSongs.length}`);
  }

  // 楽曲カード生成
  createSongCard(song, _index) {
    const card = document.createElement('div');
    card.className = 'slider-card';
    card.setAttribute('data-link', song.linkUrl);

    let cardHTML = `<h3>${song.title}</h3>`;

    // アルバム情報表示
    if (song.album) {
      cardHTML += `<p class="song-subtitle">album: ${song.album}</p>`;
    }

    // 検索ハイライト
    if (this.currentSearch) {
      cardHTML = this.highlightSearchTerm(cardHTML, this.currentSearch);
    }

    // 歌詞のサイト内表示は2026-08-18に廃止。試聴も歌詞もMWMの曲ページに一本化した
    // (歌詞はMWMで全文公開。このサイトは「探す→MWMで聴く・読む」の入口に徹する)
    cardHTML += `
      <div class="card-actions">
        <a href="${song.linkUrl}" target="_blank" class="stream-link small">聴く・歌詞を見る</a>
      </div>
    `;

    card.innerHTML = cardHTML;
    return card;
  }

  // 検索語ハイライト
  highlightSearchTerm(html, searchTerm) {
    if (!searchTerm) return html;

    const regex = new RegExp(`(${this.escapeRegExp(searchTerm)})`, 'gi');
    return html.replace(regex, '<mark class="search-highlight">$1</mark>');
  }

  // 正規表現エスケープ
  escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // 既存スライダーの再初期化
  reinitializeSlider() {
    const track = document.querySelector('.slider-track');
    if (!track) return;

    const cards = Array.from(track.children);
    if (cards.length === 0) return;

    // 初期表示: デフォルトソート（最新順）の場合は最初のカード（最新曲）を表示
    // それ以外のソート時は現在の状態を維持
    let currentIndex = 0;
    if (this.currentSort === 'releaseDate' && this.currentOrder === 'desc') {
      currentIndex = 0; // 最新曲が最初に来る
    }

    const updateCards = () => {
      // search-sort managerのインデックスを同期
      this.setCurrentIndex(currentIndex);

      cards.forEach((card, index) => {
        const relativeIndex = (index - currentIndex + cards.length) % cards.length;

        if (relativeIndex === 0) {
          // Main card - center
          card.style.left = '50%';
          card.style.transform = 'translateX(-50%) translateY(-50%) scale(1)';
          card.style.opacity = '1';
          card.style.zIndex = '3';
        } else if (relativeIndex === 1) {
          // Next card - right side
          card.style.left = '70%';
          card.style.transform = 'translateX(-50%) translateY(-50%) scale(0.85)';
          card.style.opacity = '0.7';
          card.style.zIndex = '2';
        } else if (relativeIndex === cards.length - 1) {
          // Previous card - left side
          card.style.left = '30%';
          card.style.transform = 'translateX(-50%) translateY(-50%) scale(0.85)';
          card.style.opacity = '0.7';
          card.style.zIndex = '2';
        } else {
          // Other cards - hidden
          card.style.opacity = '0';
          card.style.zIndex = '1';
          card.style.left = '50%';
          card.style.transform = 'translateX(-50%) translateY(-50%) scale(0.8)';
        }
      });
    };

    // 初期位置設定
    updateCards();

    // ボタンイベント再設定
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');

    if (nextBtn) {
      nextBtn.onclick = e => {
        e.preventDefault();
        currentIndex = (currentIndex + 1) % cards.length;
        updateCards();
      };
    }

    if (prevBtn) {
      prevBtn.onclick = e => {
        e.preventDefault();
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        updateCards();
      };
    }

    // グローバル変数でスワイプ用関数を公開（slider.jsから使用）
    window.searchSortUpdateCards = updateCards;
    window.searchSortGetCurrentIndex = () => currentIndex;
    window.searchSortSetCurrentIndex = newIndex => {
      currentIndex = newIndex;
      this.setCurrentIndex(currentIndex);
    };
    window.searchSortGetCardsLength = () => cards.length;
  }

  // 検索UI更新
  updateSearchUI() {
    const clearBtn = document.getElementById('search-clear');
    if (clearBtn) {
      clearBtn.style.display = this.currentSearch ? 'block' : 'none';
    }

    // 検索結果数表示
    const resultCount = document.getElementById('search-result-count');
    if (resultCount) {
      if (this.currentSearch) {
        resultCount.textContent = `${this.filteredSongs.length}件の楽曲が見つかりました`;
        resultCount.style.display = 'block';
      } else {
        resultCount.style.display = 'none';
      }
    }
  }

  // ソートUI更新
  updateSortUI() {
    const releaseSortBtn = document.getElementById('sort-release');
    const readingSortBtn = document.getElementById('sort-reading');

    // リセット
    [releaseSortBtn, readingSortBtn].forEach(btn => {
      if (btn) {
        btn.classList.remove('sort-active', 'sort-asc', 'sort-desc');
      }
    });

    // アクティブ状態設定（既定: custom は非アクティブ）
    let activeBtn = null;
    if (this.currentSort === 'releaseDate') activeBtn = releaseSortBtn;
    if (this.currentSort === 'reading') activeBtn = readingSortBtn;
    if (activeBtn) {
      activeBtn.classList.add('sort-active');
      activeBtn.classList.add(this.currentOrder === 'asc' ? 'sort-asc' : 'sort-desc');
    }

    // ボタンテキスト更新
    this.updateSortButtonText();
  }

  // ソートボタンテキスト更新
  updateSortButtonText() {
    const releaseSortBtn = document.getElementById('sort-release');
    const readingSortBtn = document.getElementById('sort-reading');

    if (releaseSortBtn) {
      if (this.currentSort === 'releaseDate') {
        releaseSortBtn.textContent = this.currentOrder === 'desc' ? '⚡ 新しい順' : '💎 リリース順';
      } else {
        releaseSortBtn.textContent = '⚡ 新しい順';
      }
    }

    if (readingSortBtn) {
      if (this.currentSort === 'reading') {
        readingSortBtn.textContent = this.currentOrder === 'asc' ? '📝 あ→ん' : '📝 ん→あ';
      } else {
        readingSortBtn.textContent = '📝 あ→ん';
      }
    }
  }

  // 現在のインデックス管理用ヘルパー関数
  getCurrentIndex() {
    return this.currentSliderIndex || 0;
  }

  setCurrentIndex(index) {
    this.currentSliderIndex = index;
  }

  // ターゲット曲をトップに移動
  moveTargetSongToTop(targetSong) {
    if (!targetSong || this.filteredSongs.length === 0) return;

    // ターゲット曲のインデックスを見つける
    const targetIndex = this.filteredSongs.findIndex(song => song.id === targetSong.id);

    if (targetIndex > 0) {
      // ターゲット曲を配列の先頭に移動
      const targetSongData = this.filteredSongs.splice(targetIndex, 1)[0];
      this.filteredSongs.unshift(targetSongData);

      // スライダー表示を更新
      this.updateSliderDisplay();

      console.log(`Moved "${targetSong.title}" to top position`);
    }
  }

  // デバウンス関数
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

// グローバル変数
let searchSortManager;

// DOMContentLoaded後に初期化
document.addEventListener('DOMContentLoaded', () => {
  // songs-data.jsが読み込まれているかチェック
  if (typeof songsData !== 'undefined' && typeof getSongsArray === 'function') {
    searchSortManager = new SearchSortManager();
    searchSortManager.init();
  } else {
    console.error('songs-data.js が読み込まれていません');
  }
});
