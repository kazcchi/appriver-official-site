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
  },
  kokoro: {
    title: '心の羽',
    lyrics: `静かな夜に星が揺れて
遠い記憶が胸を叩く
失った日々の痛みさえも
今は優しく 包むように

心の旅路 迷いながら
涙は道を照らしてくれる
傷ついた羽根を休めて
新しい空へ 飛び立つのさ

風が囁く 古い言葉
君がくれた 温もりの歌
どんな暗闇  包まれても
希望の光が見つけられる

心の旅路 迷いながら
涙は道を照らしてくれる
傷ついた羽根を休めて
新しい空へ 飛び立つのさ

流れる時間に逆らわず
傷も愛も抱きしめていく
この道の先  何が待つのか
わからなくても歩き続ける

心の旅路  迷いながら
涙は道を照らしてくれる
傷ついた羽根を休めて
新しい空へ 飛び立つのさ`
  },
  yasashii: {
    title: '優しい光',
    lyrics: `夜空にひとり 立ち尽くして
星たちの声を 聞こうとして
涙の理由は 誰にも言えず
心の奥で 静かに泣いた

泣きたい時は ただ泣けばいい
隠すことなく 涙を流せ
傷ついた羽 根を休めて
また飛べる日を 待てばいいだけ

風がそっと 髪を揺らして
忘れたい記憶 遠くへ運ぶ
だけど消えない 痛みの跡は
私が生きた 証だと思う

泣きたい時は ただ泣けばいい
心の闇も 全部流して
明日が来るよ 優しい光
その光でまた 歩き出せる

涙はきっと 強さになる
悲しみ越えて 咲く花のように
だから恐れず 泣いてもいいよ
その涙さえ 宝物だから

泣きたい時は ただ泣けばいい
隠すことなく 涙を流せ
傷ついた羽 根を休めて
また飛べる日を 待てばいいだけ`
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const slider = document.querySelector('.song-slider');
  if (!slider) return;

  const track = slider.querySelector('.slider-track');
  const prevBtn = slider.querySelector('.slider-btn.prev');
  const nextBtn = slider.querySelector('.slider-btn.next');

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
  
  // Start with newest card (last card) in center
  let currentIndex = cards.length - 1;
  
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

  // Button controls
  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('Next button clicked');
      currentIndex = (currentIndex + 1) % cards.length;
      updateCards();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('Previous button clicked');
      currentIndex = (currentIndex - 1 + cards.length) % cards.length;
      updateCards();
    });
  }

  // Touch/Swipe support
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
      const songData = lyricsData[songId];
      
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
