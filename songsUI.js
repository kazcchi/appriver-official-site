// songsUI.js - build single section & lyrics modal based on songsData
import { songs } from './songsData.js';

document.addEventListener('DOMContentLoaded', () => {
  /* Build song sections */
  const singleContainer = document.getElementById('single');
  singleContainer.innerHTML = '';
  songs.forEach((song, idx) => {
    const sec = document.createElement('section');
    sec.id = `song-${song.id}`;
    sec.className = 'song-section';
    sec.dataset.title = song.title;
    // build streaming buttons html
    const streamBtns = Object.entries(song.streaming).filter(([,url])=>url && url !== '#').map(([key,url])=>{
      const label = key.charAt(0).toUpperCase() + key.slice(1);
      return `<a href="${url}" class="stream-link" target="_blank">${label}</a>`;
    }).join(' ');

    sec.innerHTML = `
      <h2>${song.title}</h2>
      ${streamBtns}
      ${song.lyrics ? `<button class="lyrics-btn" data-index="${idx}">Lyrics</button>` : ''}
    `;
    singleContainer.appendChild(sec);
  });

  /* Nav dots */
  const sections = document.querySelectorAll('.song-section');
  const navDotsContainer = document.createElement('div');
  navDotsContainer.className = 'nav-dots';
  const songsSection = document.getElementById('songs') || document.querySelector('.songs-section');
  (songsSection || document.body).appendChild(navDotsContainer);

  sections.forEach((sec, idx) => {
    const dot = document.createElement('button');
    dot.className = 'nav-dot';
    if (idx === 0) dot.classList.add('active');
    dot.addEventListener('click', () => sec.scrollIntoView({behavior:'smooth'}));
    navDotsContainer.appendChild(dot);
  });

  const observer = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const i = Array.from(sections).indexOf(entry.target);
        document.querySelectorAll('.nav-dot').forEach((d,idx)=>d.classList.toggle('active',idx===i));
      }
    });
  },{threshold:0.6});
  sections.forEach(sec=>observer.observe(sec));

  window.addEventListener('keydown', e=>{
    if(['ArrowRight','ArrowDown'].includes(e.key)){e.preventDefault(); move(1);} 
    if(['ArrowLeft','ArrowUp'].includes(e.key)){e.preventDefault(); move(-1);} 
  });
  function move(offset){
    const dots=Array.from(document.querySelectorAll('.nav-dot'));
    const current=dots.findIndex(d=>d.classList.contains('active'));
    const next=Math.min(Math.max(current+offset,0),dots.length-1);
    if(next!==current) sections[next].scrollIntoView({behavior:'smooth'});
  }

  /* -------- Build album track list ------------ */
  const albumDetails = document.querySelector('.album-details');
  if(albumDetails){
    const trackList = document.createElement('ul');
    trackList.className='track-list';
    const albumTracks = songs.filter(s=>s.album==='NUKUMORI' && !['いのちの理由','君の影'].includes(s.title));
    albumTracks.forEach((song,idx)=>{
      const li=document.createElement('li');
      li.innerHTML=`<span>${idx+1}. ${song.title}</span> ${song.lyrics?`<button class="lyrics-btn mini" data-index="${songs.indexOf(song)}">Lyrics</button>`:''}`;
      trackList.appendChild(li);
    });
    albumDetails.appendChild(trackList);
  }

  /* -------- Build lyrics page list ------------ */
  const lyricsListContainer=document.getElementById('lyrics-song-list');
  if(lyricsListContainer){
    songs.forEach((song,idx)=>{
      const item=document.createElement('div');
      item.className='lyrics-item';
      item.innerHTML=`<span>${song.title}</span> <button class="lyrics-btn mini" data-index="${idx}">Lyrics</button>`;
      lyricsListContainer.appendChild(item);
    });
  }

  /* Lyrics modal */
  const modal = document.createElement('div');
  modal.id='lyrics-modal';
  modal.className='lyrics-modal';
  modal.innerHTML=`<div class="modal-content"><button class="modal-close" aria-label="close">&times;</button><h3 id="modal-title"></h3><pre id="modal-lyrics" class="modal-lyrics lyrics-text"></pre></div>`;
  document.body.appendChild(modal);
  const modalTitle = modal.querySelector('#modal-title');
  const modalLyrics = modal.querySelector('#modal-lyrics');
  modal.querySelector('.modal-close').addEventListener('click',()=>modal.classList.remove('show'));
  modal.addEventListener('click',e=>{if(e.target===modal) modal.classList.remove('show');});
  window.addEventListener('keydown',e=>{if(e.key==='Escape') modal.classList.remove('show');});

  document.querySelectorAll('.lyrics-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const idx=+btn.dataset.index;
      modalTitle.textContent=songs[idx].title;
      modalLyrics.textContent=songs[idx].lyrics;
      modal.classList.add('show');
    });
  });
});
