// BUKA - Search & Sort functionality
// Based on appriver search-sort.js

class SearchSortManager {
  constructor() {
    this.currentSort = searchSortConfig.defaultSort;
    this.currentOrder = searchSortConfig.defaultOrder;
    this.currentSearch = '';
    this.allSongs = getSongsArray();
    this.filteredSongs = [...this.allSongs];
    this.isInitialized = false;
  }

  init() {
    if (this.isInitialized) return;
    this.setupEventListeners();
    this.applySortAndFilter();
    this.isInitialized = true;
  }

  setupEventListeners() {
    const searchInput = document.getElementById('song-search');
    if (searchInput) {
      searchInput.addEventListener(
        'input',
        this.debounce(e => {
          this.handleSearch(e.target.value);
        }, 300)
      );
    }

    const clearBtn = document.getElementById('search-clear');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => this.clearSearch());
    }

    const releaseSortBtn = document.getElementById('sort-release');
    const readingSortBtn = document.getElementById('sort-reading');

    if (releaseSortBtn) {
      releaseSortBtn.addEventListener('click', () => this.handleSort('releaseDate'));
    }
    if (readingSortBtn) {
      readingSortBtn.addEventListener('click', () => this.handleSort('reading'));
    }
  }

  handleSearch(query) {
    this.currentSearch = query.toLowerCase().trim();
    this.applySortAndFilter();
    this.updateSearchUI();
  }

  clearSearch() {
    const currentIndex = this.getCurrentIndex();
    const currentDisplayedSong =
      this.filteredSongs.length > currentIndex ? this.filteredSongs[currentIndex] : null;

    this.currentSearch = '';
    const searchInput = document.getElementById('song-search');
    if (searchInput) searchInput.value = '';

    this.applySortAndFilter();

    if (currentDisplayedSong) {
      this.moveTargetSongToTop(currentDisplayedSong);
    }
    this.updateSearchUI();
  }

  handleSort(sortType) {
    if (this.currentSort === sortType) {
      this.currentOrder = this.currentOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.currentSort = sortType;
      this.currentOrder = sortType === 'releaseDate' ? 'desc' : 'asc';
    }
    this.applySortAndFilter();
    this.updateSortUI();
  }

  filterSongs(songs, query) {
    if (!query) return songs;
    return songs.filter(song => {
      const titleMatch = song.title.toLowerCase().includes(query);
      const albumMatch = song.album.toLowerCase().includes(query);
      return titleMatch || albumMatch;
    });
  }

  sortSongs(songs, sortType, order) {
    const sorted = [...songs].sort((a, b) => {
      let comparison = 0;

      if (sortType === 'releaseDate') {
        const sA = this.isValidReleaseDate(a.releaseDate) ? a.releaseDate : '0000-00-00';
        const sB = this.isValidReleaseDate(b.releaseDate) ? b.releaseDate : '0000-00-00';
        comparison = sA.localeCompare(sB);

        if (comparison === 0) {
          const isSameAlbum = a.album && a.album === b.album;
          if (isSameAlbum) {
            const pa = typeof a.displayPriority === 'number' ? a.displayPriority : 0;
            const pb = typeof b.displayPriority === 'number' ? b.displayPriority : 0;
            if (pa !== pb) {
              comparison = pa - pb;
            } else {
              comparison = a.reading.localeCompare(b.reading, 'ja');
            }
          } else {
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

  isValidReleaseDate(dateStr) {
    return typeof dateStr === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
  }

  applySortAndFilter() {
    const filtered = this.filterSongs(this.allSongs, this.currentSearch);
    this.filteredSongs = this.sortSongs(filtered, this.currentSort, this.currentOrder);
    this.updateSliderDisplay();
  }

  updateSliderDisplay() {
    const track = document.querySelector('.slider-track');
    if (!track) return;

    track.innerHTML = '';

    this.filteredSongs.forEach((song, index) => {
      const card = this.createSongCard(song, index);
      track.appendChild(card);
    });

    this.reinitializeSlider();
  }

  createSongCard(song, _index) {
    const card = document.createElement('div');
    card.className = 'slider-card';
    card.setAttribute('data-link', song.linkUrl);

    let cardHTML = `<h3>${song.title}</h3>`;

    if (song.album) {
      cardHTML += `<p class="song-subtitle">album: ${song.album}</p>`;
    }

    if (this.currentSearch) {
      cardHTML = this.highlightSearchTerm(cardHTML, this.currentSearch);
    }

    cardHTML += `
      <div class="card-actions">
        <a href="${song.linkUrl}" target="_blank" class="stream-link small">聴いてみる</a>
        <button class="stream-link small secondary lyric-btn" data-song="${song.id}">歌詞</button>
      </div>
    `;

    card.innerHTML = cardHTML;
    return card;
  }

  highlightSearchTerm(html, searchTerm) {
    if (!searchTerm) return html;
    const regex = new RegExp(`(${this.escapeRegExp(searchTerm)})`, 'gi');
    return html.replace(regex, '<mark class="search-highlight">$1</mark>');
  }

  escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  reinitializeSlider() {
    const track = document.querySelector('.slider-track');
    if (!track) return;

    const cards = Array.from(track.children);
    if (cards.length === 0) return;

    let currentIndex = 0;

    const updateCards = () => {
      this.setCurrentIndex(currentIndex);

      cards.forEach((card, index) => {
        const relativeIndex = (index - currentIndex + cards.length) % cards.length;

        if (relativeIndex === 0) {
          card.style.left = '50%';
          card.style.transform = 'translateX(-50%) translateY(-50%) scale(1)';
          card.style.opacity = '1';
          card.style.zIndex = '3';
        } else if (relativeIndex === 1) {
          card.style.left = '70%';
          card.style.transform = 'translateX(-50%) translateY(-50%) scale(0.85)';
          card.style.opacity = '0.7';
          card.style.zIndex = '2';
        } else if (relativeIndex === cards.length - 1) {
          card.style.left = '30%';
          card.style.transform = 'translateX(-50%) translateY(-50%) scale(0.85)';
          card.style.opacity = '0.7';
          card.style.zIndex = '2';
        } else {
          card.style.opacity = '0';
          card.style.zIndex = '1';
          card.style.left = '50%';
          card.style.transform = 'translateX(-50%) translateY(-50%) scale(0.8)';
        }
      });
    };

    updateCards();

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

    window.searchSortUpdateCards = updateCards;
    window.searchSortGetCurrentIndex = () => currentIndex;
    window.searchSortSetCurrentIndex = newIndex => {
      currentIndex = newIndex;
      this.setCurrentIndex(currentIndex);
    };
    window.searchSortGetCardsLength = () => cards.length;
  }

  updateSearchUI() {
    const clearBtn = document.getElementById('search-clear');
    if (clearBtn) {
      clearBtn.style.display = this.currentSearch ? 'block' : 'none';
    }

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

  updateSortUI() {
    const releaseSortBtn = document.getElementById('sort-release');
    const readingSortBtn = document.getElementById('sort-reading');

    [releaseSortBtn, readingSortBtn].forEach(btn => {
      if (btn) btn.classList.remove('sort-active', 'sort-asc', 'sort-desc');
    });

    let activeBtn = null;
    if (this.currentSort === 'releaseDate') activeBtn = releaseSortBtn;
    if (this.currentSort === 'reading') activeBtn = readingSortBtn;
    if (activeBtn) {
      activeBtn.classList.add('sort-active');
      activeBtn.classList.add(this.currentOrder === 'asc' ? 'sort-asc' : 'sort-desc');
    }

    this.updateSortButtonText();
  }

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

  getCurrentIndex() {
    return this.currentSliderIndex || 0;
  }
  setCurrentIndex(index) {
    this.currentSliderIndex = index;
  }

  moveTargetSongToTop(targetSong) {
    if (!targetSong || this.filteredSongs.length === 0) return;
    const targetIndex = this.filteredSongs.findIndex(song => song.id === targetSong.id);
    if (targetIndex > 0) {
      const targetSongData = this.filteredSongs.splice(targetIndex, 1)[0];
      this.filteredSongs.unshift(targetSongData);
      this.updateSliderDisplay();
    }
  }

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

let searchSortManager;

document.addEventListener('DOMContentLoaded', () => {
  if (typeof songsData !== 'undefined' && typeof getSongsArray === 'function') {
    searchSortManager = new SearchSortManager();
    searchSortManager.init();
  }
});

const lyricsData = {};
Object.entries(songsData || {}).forEach(([key, song]) => {
  lyricsData[key] = { title: song.title, lyrics: song.lyrics };
});
