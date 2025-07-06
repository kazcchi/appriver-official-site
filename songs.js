// songs.js - dynamic single generation, scroll nav, lyrics modal

document.addEventListener('DOMContentLoaded', () => {
  /* -------------------- Config -------------------- */
  const songs = [
    {
      title: 'いのちの理由',
      stream: 'https://linkco.re/Hb9nfMcM',
      lyrics: `空に問いかけた声が\n消えてゆく　この静寂の中で\nあの日見た夢の続きを\n今も探している\n\n風に乗せた祈りの言葉\nどこか遠く届くように\n手を伸ばして掴むはずの\n光は儚く揺れる\n\n命の意味を問い続けて\n涙が流れる　その理由を\n心の奥で感じた想い\nそれが私を生かしてる` 
    },
    {
      title: '君の影',
      stream: 'https://linkco.re/DDaFCGVU',
      lyrics: `夜が明ける　その瞬間に\n新しい世界が待っている\n痛みさえも抱きしめながら\n歩いていく　この道` 
    }
    // ここに曲を追加していくだけでOK
  ];

  /* ------------- Build song sections -------------- */
  const singleContainer = document.getElementById('single');
  singleContainer.innerHTML = '';
  songs.forEach((song, idx) => {
    const sec = document.createElement('section');
    sec.id = `song-${idx + 1}`;
    sec.className = 'song-section';
    sec.dataset.title = song.title;
    sec.innerHTML = `
      <h2>${song.title}</h2>
      <a href="${song.stream}" class="stream-link" target="_blank">Listen on TuneCore</a>
      <button class="lyrics-btn" data-index="${idx}">Lyrics</button>
    `;
    singleContainer.appendChild(sec);
  });

  /* ---------------- Nav Dots & Scroll -------------- */
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
