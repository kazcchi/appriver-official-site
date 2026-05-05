// BUKA - Song Slider with touch/swipe support
document.addEventListener('DOMContentLoaded', () => {
  const slider = document.querySelector('.song-slider');
  if (!slider) return;

  const track = slider.querySelector('.slider-track');
  const prevBtn = slider.querySelector('.slider-btn.prev');
  const nextBtn = slider.querySelector('.slider-btn.next');
  const cards = Array.from(track.children).filter(card => !card.classList.contains('coming-soon'));

  let currentIndex = 0;

  function updateCards() {
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
  }

  updateCards();

  if (nextBtn) {
    nextBtn.addEventListener('click', e => {
      e.preventDefault();
      currentIndex = (currentIndex + 1) % cards.length;
      updateCards();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', e => {
      e.preventDefault();
      currentIndex = (currentIndex - 1 + cards.length) % cards.length;
      updateCards();
    });
  }

  // Touch/Swipe support
  let touchStartX = 0;
  let touchStartY = 0;

  slider.addEventListener(
    'touchstart',
    e => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    },
    { passive: true }
  );

  slider.addEventListener(
    'touchmove',
    e => {
      const touchCurrentX = e.touches[0].clientX;
      const touchCurrentY = e.touches[0].clientY;
      const diffX = Math.abs(touchCurrentX - touchStartX);
      const diffY = Math.abs(touchCurrentY - touchStartY);
      if (diffX > diffY) e.preventDefault();
    },
    { passive: false }
  );

  slider.addEventListener(
    'touchend',
    e => {
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > 50) {
        if (
          typeof window.searchSortUpdateCards === 'function' &&
          typeof window.searchSortGetCurrentIndex === 'function' &&
          typeof window.searchSortSetCurrentIndex === 'function' &&
          typeof window.searchSortGetCardsLength === 'function'
        ) {
          let newIndex;
          const currentIdx = window.searchSortGetCurrentIndex();
          const cardsLength = window.searchSortGetCardsLength();
          if (diff > 0) {
            newIndex = (currentIdx + 1) % cardsLength;
          } else {
            newIndex = (currentIdx - 1 + cardsLength) % cardsLength;
          }
          window.searchSortSetCurrentIndex(newIndex);
          window.searchSortUpdateCards();
        } else {
          if (diff > 0) {
            currentIndex = (currentIndex + 1) % cards.length;
          } else {
            currentIndex = (currentIndex - 1 + cards.length) % cards.length;
          }
          updateCards();
        }
      }
    },
    { passive: true }
  );

  // Lyrics display
  const lyricsDisplay = document.getElementById('lyrics-display');
  const lyricsTitle = document.getElementById('lyrics-title');
  const lyricsContent = document.getElementById('lyrics-content');
  const closeLyricsBtn = document.getElementById('close-lyrics');

  document.addEventListener('click', e => {
    if (e.target.classList.contains('lyric-btn')) {
      const songId = e.target.dataset.song;
      let songData = null;
      if (typeof songsData !== 'undefined' && songsData[songId]) {
        songData = songsData[songId];
      } else if (typeof lyricsData !== 'undefined' && lyricsData[songId]) {
        songData = lyricsData[songId];
      }

      if (songData) {
        lyricsTitle.textContent = songData.title;
        lyricsContent.innerHTML = songData.lyrics
          .split('\n')
          .map(line => (line.trim() === '' ? '<br>' : `<p>${line}</p>`))
          .join('');
        lyricsDisplay.style.display = 'block';
        lyricsDisplay.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });

  if (closeLyricsBtn) {
    closeLyricsBtn.addEventListener('click', () => {
      lyricsDisplay.style.display = 'none';
      const songsLyricsSection = document.getElementById('songs-lyrics');
      if (songsLyricsSection) {
        songsLyricsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }
});
