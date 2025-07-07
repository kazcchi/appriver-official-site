// Simple infinite carousel for song slider
// Author: Cascade AI

document.addEventListener('DOMContentLoaded', () => {
  const slider = document.querySelector('.song-slider');
  if (!slider) return;

  const track = slider.querySelector('.slider-track');
  const prevBtn = slider.querySelector('.slider-btn.prev');
  const nextBtn = slider.querySelector('.slider-btn.next');

  let cards = Array.from(track.children);

  // Clone first and last card for seamless loop
  const firstClone = cards[0].cloneNode(true);
  firstClone.classList.add('clone');
  const lastClone = cards[cards.length - 1].cloneNode(true);
  lastClone.classList.add('clone');

  track.appendChild(firstClone);
  track.insertBefore(lastClone, cards[0]);

  cards = Array.from(track.children); // Update with clones included

  let index = 1; // start from real first card
  let cardWidth = cards[index].offsetWidth + 32; // include margin 2*16px

  // Set initial position
  track.style.transform = `translateX(-${cardWidth * index}px)`;

  // Helper to move slide
  function moveTo(i) {
    track.style.transition = 'transform 0.4s cubic-bezier(0.42,0,0.58,1)';
    track.style.transform = `translateX(-${cardWidth * i}px)`;
    index = i;
  }

  // Prevent rapid clicks and unify handlers
  let isAnimating = false;
  function safeMove(delta) {
    if (isAnimating) return;
    isAnimating = true;
    moveTo(index + delta);
    // allow slight extra time than transition in case of lag
    setTimeout(() => (isAnimating = false), 600);
  }
  // Map arrows correctly (right arrow shows next card)
  nextBtn.addEventListener('click', () => safeMove(-1)); // right arrow
  prevBtn.addEventListener('click', () => safeMove(1));  // left arrow

  // Loop handling
  track.addEventListener('transitionend', () => {
    if (cards[index].classList.contains('clone')) {
      track.style.transition = 'none';
      if (index === 0) {
        index = cards.length - 2;
      } else if (index === cards.length - 1) {
        index = 1;
      }
      track.style.transform = `translateX(-${cardWidth * index}px)`;
    }
  });

  // Resize handling
  window.addEventListener('resize', () => {
    cardWidth = cards[index].getBoundingClientRect().width;
    track.style.transition = 'none';
    track.style.transform = `translateX(-${cardWidth * index}px)`;
  });

  // Touch swipe support (on slider container)
  let touchStartX = 0;
  // Enable pointer events for wider support
  slider.style.touchAction = 'pan-y'; // allow vertical scroll, disable horizontal default

  // Touch events
  slider.addEventListener('touchstart', (e) => {
    // store starting X and cancel passive scrolling to capture swipe
    e.stopPropagation();
    touchStartX = e.touches[0].clientX;
  });

  // optional prevent vertical scroll interference
  slider.addEventListener('touchmove', (e) => {
    const diff = e.touches[0].clientX - touchStartX;
    if (Math.abs(diff) > 10) e.preventDefault();
  }, {passive:false});

  slider.addEventListener('touchend', (e) => {
    e.stopPropagation();
    const diff = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(diff) > 40) {
      diff < 0 ? safeMove(-1) : safeMove(1);
    }
  });

  // Pointer (mouse / touch) fallback
  let pointerStartX = 0;
  slider.addEventListener('pointerdown', (e) => {
    pointerStartX = e.clientX;
  });
  slider.addEventListener('pointerup', (e) => {
    const diff = e.clientX - pointerStartX;
    if (Math.abs(diff) > 40) {
      diff < 0 ? safeMove(-1) : safeMove(1);
    }
  });
});
