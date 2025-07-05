// songs.js - smooth scroll, indicator, keyboard nav

document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('.song-section');
  const navDotsContainer = document.createElement('div');
  navDotsContainer.className = 'nav-dots';
  document.body.appendChild(navDotsContainer);

  // build dots
  sections.forEach((sec, idx) => {
    const dot = document.createElement('button');
    dot.className = 'nav-dot';
    dot.setAttribute('aria-label', `Go to ${sec.dataset.title || 'song'} ${idx + 1}`);
    if (idx === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      sec.scrollIntoView({ behavior: 'smooth' });
    });
    navDotsContainer.appendChild(dot);
  });

  // Intersection Observer for active dot
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const index = Array.from(sections).indexOf(entry.target);
        document.querySelectorAll('.nav-dot').forEach((d, i) => {
          d.classList.toggle('active', i === index);
        });
      }
    });
  }, { threshold: 0.6 });

  sections.forEach(sec => observer.observe(sec));

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (['ArrowDown', 'ArrowRight'].includes(e.key)) {
      e.preventDefault();
      scrollToRelative(1);
    } else if (['ArrowUp', 'ArrowLeft'].includes(e.key)) {
      e.preventDefault();
      scrollToRelative(-1);
    }
  });

  function scrollToRelative(offset) {
    const activeDot = document.querySelector('.nav-dot.active');
    const dots = Array.from(document.querySelectorAll('.nav-dot'));
    const currentIdx = dots.indexOf(activeDot);
    const nextIdx = Math.min(Math.max(currentIdx + offset, 0), dots.length - 1);
    if (nextIdx !== currentIdx) {
      sections[nextIdx].scrollIntoView({ behavior: 'smooth' });
    }
  }
});
