// Simple infinite carousel for song slider
// Author: Cascade AI

// Lyrics data
const lyricsData = {
  inochi: {
    title: 'いのちの理由',
    lyrics: `空に問いかけた声が
消えてゆくこの静寂の中で
あの日見た夢の続きを
今も探している

風に乗せた祈りの言葉
どこか遠く届くように
手を伸ばして掴むはずの
光は儚く揺れる

命の意味を問い続けて
涙が流れるその理由を
心の奥で感じた想い
それが私を生かしてる

夜が明けるその瞬間に
新しい世界が待っている
痛みさえも抱きしめながら
歩いて行くこの道

花が咲き散るその儚さに
美しさを見つけられたなら
全てが繋がるその時を
信じて進もう

命の意味を問い続けて
涙が流れるその理由を
心の奥で感じた想い
それが私を生かしてる`
  },
  kage: {
    title: '君の影',
    lyrics: `もしあの時別れなければ
今頃君とどこにいるの
手をつなぎ笑っていたかな
それとも涙を隠してたの

君の声まだ聞こえる
あの夜の風の中で
忘れたいのに忘れられない
心に響く君の影

夕焼けが二人染めた日
未来は明るいと思った
けれど時の波にさらわれ
君の笑顔も遠く消えた

君の声まだ聞こえる
あの夜の風の中で
忘れたいのに忘れられない
心に響く君の影

もし戻れるならば
何を言えばよかったの
過ぎ去った時間の中で
答えは見つからないまま

君の声まだ聞こえる
あの夜の風の中で
忘れたいのに忘れられない
心に響く君の影`
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const slider = document.querySelector('.song-slider');
  if (!slider) return;

  const track = slider.querySelector('.slider-track');
  const prevBtn = slider.querySelector('.slider-btn.prev');
  const nextBtn = slider.querySelector('.slider-btn.next');

  let cards = Array.from(track.children);
  let currentIndex = 0;
  
  // Function to show card at specific index
  function showCard(index) {
    // Hide all cards
    cards.forEach(card => {
      card.style.display = 'none';
    });
    
    // Show current card
    if (cards[index]) {
      cards[index].style.display = 'flex';
    }
  }

  // Initialize - show first card
  showCard(currentIndex);

  // Next button
  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % cards.length;
    showCard(currentIndex);
  });

  // Previous button
  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    showCard(currentIndex);
  });

  // Touch swipe support
  let touchStartX = 0;
  
  slider.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  });

  slider.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > 50) { // minimum swipe distance
      if (diff > 0) {
        // Swipe left - next card
        currentIndex = (currentIndex + 1) % cards.length;
      } else {
        // Swipe right - previous card
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
      }
      showCard(currentIndex);
    }
  });

  // Lyrics display functionality
  const lyricsDisplay = document.getElementById('lyrics-display');
  const lyricsTitle = document.getElementById('lyrics-title');
  const lyricsContent = document.getElementById('lyrics-content');
  const closeLyricsBtn = document.getElementById('close-lyrics');
  
  // Add event listeners for lyric buttons
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('lyric-btn')) {
      const songId = e.target.dataset.song;
      const songData = lyricsData[songId];
      
      if (songData) {
        lyricsTitle.textContent = songData.title;
        lyricsContent.innerHTML = songData.lyrics.split('\n').map(line => 
          line.trim() === '' ? '<br>' : `<p>${line}</p>`
        ).join('');
        lyricsDisplay.style.display = 'block';
        
        // Scroll to lyrics
        lyricsDisplay.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
  
  // Close lyrics
  closeLyricsBtn.addEventListener('click', () => {
    lyricsDisplay.style.display = 'none';
  });
});
