// Simple infinite carousel for song slider
// Updated for search-sort integration

document.addEventListener('DOMContentLoaded', () => {
  const slider = document.querySelector('.song-slider');
  if (!slider) return;

  const track = slider.querySelector('.slider-track');
  const prevBtn = slider.querySelector('.slider-btn.prev');
  const nextBtn = slider.querySelector('.slider-btn.next');
  const swipeGuide = document.getElementById('swipeGuide');

  let allCards = Array.from(track.children);
  
  // Filter to get only real song cards (not "coming soon")
  let cards = allCards.filter(card => !card.classList.contains('coming-soon'));
  
  // Hide coming soon cards
  allCards.forEach(card => {
    if (card.classList.contains('coming-soon')) {
      card.style.display = 'none';
    } else {
      card.style.display = 'flex';
    }
  });
  
  // Start with first card (sorted by search-sort functionality)
  let currentIndex = 0;
  
  // スワイプガイドの管理
  const swipeCompleted = localStorage.getItem('appriver_swipe_completed');
  let hasSwipedOnce = false;
  
  // Function to update card positions
  function updateCards() {
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
        // Other cards - hidden but ready for navigation
        card.style.opacity = '0';
        card.style.zIndex = '1';
        card.style.left = '50%';
        card.style.transform = 'translateX(-50%) translateY(-50%) scale(0.8)';
      }
    });
  }

  // Initialize
  updateCards();
  
  // モバイルかどうかをチェック
  function isMobile() {
    return window.innerWidth <= 768;
  }
  
  // スワイプガイドの表示制御
  function showSwipeGuide() {
    if (!swipeCompleted && !hasSwipedOnce && swipeGuide && isMobile()) {
      swipeGuide.style.display = 'block';
      setTimeout(() => {
        swipeGuide.style.opacity = '1';
      }, 100);
    }
  }
  
  function hideSwipeGuide() {
    if (swipeGuide) {
      swipeGuide.style.opacity = '0';
      setTimeout(() => {
        swipeGuide.style.display = 'none';
      }, 500);
      localStorage.setItem('appriver_swipe_completed', 'true');
      hasSwipedOnce = true;
    }
  }
  
  // モバイルの場合のみ3秒後にスワイプガイドを表示
  if (isMobile()) {
    setTimeout(() => {
      showSwipeGuide();
    }, 3000);
  }
  
  // リサイズ時にモバイルでなくなった場合はスワイプガイドを非表示
  window.addEventListener('resize', () => {
    if (!isMobile() && swipeGuide) {
      swipeGuide.style.display = 'none';
    }
  });

  // Button controls
  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('Next button clicked');
      currentIndex = (currentIndex + 1) % cards.length;
      updateCards();
      // スワイプガイドを非表示
      hideSwipeGuide();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('Previous button clicked');
      currentIndex = (currentIndex - 1 + cards.length) % cards.length;
      updateCards();
      // スワイプガイドを非表示
      hideSwipeGuide();
    });
  }

  // グローバル関数として定義（search-sort.jsから呼び出し可能）
  window.initializeSliderEvents = function(sliderElement, cardsArray, updateCardsFunction, getCurrentIndexFunction, setCurrentIndexFunction) {
    // 既存のイベントリスナーを削除
    if (sliderElement._sliderEventListeners) {
      sliderElement.removeEventListener('touchstart', sliderElement._sliderEventListeners.touchstart);
      sliderElement.removeEventListener('touchmove', sliderElement._sliderEventListeners.touchmove);
      sliderElement.removeEventListener('touchend', sliderElement._sliderEventListeners.touchend);
    }

    let touchStartX = 0;
    let touchStartY = 0;

    const touchStartHandler = (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const touchMoveHandler = (e) => {
      const touchCurrentX = e.touches[0].clientX;
      const touchCurrentY = e.touches[0].clientY;
      const diffX = Math.abs(touchCurrentX - touchStartX);
      const diffY = Math.abs(touchCurrentY - touchStartY);
      
      if (diffX > diffY) {
        e.preventDefault();
      }
    };

    const touchEndHandler = (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;
      
      if (Math.abs(diff) > 50) {
        let newIndex;
        if (diff > 0) {
          // Swipe left - next card
          newIndex = (getCurrentIndexFunction() + 1) % cardsArray.length;
        } else {
          // Swipe right - previous card
          newIndex = (getCurrentIndexFunction() - 1 + cardsArray.length) % cardsArray.length;
        }
        setCurrentIndexFunction(newIndex);
        updateCardsFunction();
      }
    };

    // イベントリスナーを追加
    sliderElement.addEventListener('touchstart', touchStartHandler, { passive: true });
    sliderElement.addEventListener('touchmove', touchMoveHandler, { passive: false });
    sliderElement.addEventListener('touchend', touchEndHandler, { passive: true });

    // 後で削除できるように保存
    sliderElement._sliderEventListeners = {
      touchstart: touchStartHandler,
      touchmove: touchMoveHandler,
      touchend: touchEndHandler
    };
  };

  // Touch/Swipe support - 初期設定（常に実行）
  let touchStartX = 0;
  let touchStartY = 0;
  
  slider.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  slider.addEventListener('touchmove', (e) => {
    // Prevent scrolling during horizontal swipe
    const touchCurrentX = e.touches[0].clientX;
    const touchCurrentY = e.touches[0].clientY;
    const diffX = Math.abs(touchCurrentX - touchStartX);
    const diffY = Math.abs(touchCurrentY - touchStartY);
    
    if (diffX > diffY) {
      e.preventDefault();
    }
  }, { passive: false });

  slider.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > 50) { // minimum swipe distance
      // 検索・ソート機能がアクティブな場合はその関数を使用
      if (typeof window.searchSortUpdateCards === 'function' && 
          typeof window.searchSortGetCurrentIndex === 'function' &&
          typeof window.searchSortSetCurrentIndex === 'function' &&
          typeof window.searchSortGetCardsLength === 'function') {
        
        let newIndex;
        const currentIdx = window.searchSortGetCurrentIndex();
        const cardsLength = window.searchSortGetCardsLength();
        
        if (diff > 0) {
          // Swipe left - next card
          newIndex = (currentIdx + 1) % cardsLength;
        } else {
          // Swipe right - previous card
          newIndex = (currentIdx - 1 + cardsLength) % cardsLength;
        }
        
        window.searchSortSetCurrentIndex(newIndex);
        window.searchSortUpdateCards();
        console.log(`Search-sort swipe: ${diff > 0 ? 'next' : 'prev'} -> index ${newIndex}`);
        
      } else {
        // 従来のスワイプ処理
        if (diff > 0) {
          // Swipe left - next card
          console.log('Swiped left - next');
          currentIndex = (currentIndex + 1) % cards.length;
        } else {
          // Swipe right - previous card
          console.log('Swiped right - previous');
          currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        }
        updateCards();
      }
      // スワイプガイドを非表示（どちらの処理でも）
      hideSwipeGuide();
    }
  }, { passive: true });

  // Lyrics display functionality
  const lyricsDisplay = document.getElementById('lyrics-display');
  const lyricsTitle = document.getElementById('lyrics-title');
  const lyricsContent = document.getElementById('lyrics-content');
  const closeLyricsBtn = document.getElementById('close-lyrics');
  
  // Add event listeners for lyric buttons
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('lyric-btn')) {
      const songId = e.target.dataset.song;
      
      // 新しいデータ構造との互換性
      let songData = null;
      if (typeof songsData !== 'undefined' && songsData[songId]) {
        songData = songsData[songId];
      } else if (typeof lyricsData !== 'undefined' && lyricsData[songId]) {
        songData = lyricsData[songId];
      }
      
      if (songData) {
        lyricsTitle.textContent = songData.title;
        lyricsContent.innerHTML = songData.lyrics.split('\n').map(line => 
          line.trim() === '' ? '<br>' : `<p>${line}</p>`
        ).join('');
        lyricsDisplay.style.display = 'block';
        
        // Scroll to lyrics with proper offset for title visibility
        lyricsDisplay.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
  
  // Close lyrics
  closeLyricsBtn.addEventListener('click', () => {
    lyricsDisplay.style.display = 'none';
    
    // Scroll back to songs&lyrics section top
    const songsLyricsSection = document.getElementById('songs-lyrics');
    if (songsLyricsSection) {
      songsLyricsSection.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  });
});
