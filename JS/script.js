
function unmuteMusic() {
  const music = document.getElementById('bg-music');
  let playbtn = document.querySelector('.playbtn');

  if (music.paused) {
    music.muted = false;
    music.play();
    playbtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
  } else {
    music.pause();
    music.currentTime = 0;
    playbtn.innerHTML = '<i class="fa-solid fa-play"></i>';
  }
}


const chaptersUrl = 'https://vedicscriptures.github.io/chapters';
const baseVerseUrl = 'https://vedicscriptures.github.io/slok/';

const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");

if (document.querySelector('.chName')) {
  fetch(chaptersUrl)
    .then(res => res.json())
    .then(data => {
      let str = '';
      data.forEach(ele => {
        str += `
          <a href="./verse.html" class="fw-bold d-block mb-2"
             onclick="chapterOpen(${ele.chapter_number})">
             ${ele.chapter_number}. ${ele.transliteration}
          </a>`;
      });
      document.querySelector('.chName').innerHTML = str;
    })
    .catch(err => console.error('Error fetching chapters:', err));
}

function chapterOpen(chapterId) {
  localStorage.setItem('selectedChapter', chapterId);
  localStorage.setItem('selectedVerse', 1);
}


if (document.querySelector('.verses')) {
  const chapterId = Number(localStorage.getItem('selectedChapter')) || 1;
  let currentVerse = Number(localStorage.getItem('selectedVerse')) || 1;

  const versesContainer = document.querySelector(".verses");


  function loadVerse(chapter, verse) {
    const verseUrl = `${baseVerseUrl}${chapter}/${verse}/`;

    fetch(verseUrl)
      .then(res => res.json())
      .then(data => {
        versesContainer.innerHTML = `
          <div class="fs-4">
            <b>${data.chapter}.${data.verse}</b>
            <hr>
            ${data.transliteration}
            <hr>
             <div class="text-center h1 fw-2">Translation</div>
            ${data.prabhu.et}
            <hr>
            <div class="text-center h1 fw-2">Purport</div>
            ${data.prabhu.ec}
          </div>
        `;

        const verseNav = document.querySelector(".verse-nav");

        verseNav.innerHTML = `
          <button class="btn btn-outline-dark me-2" id="prevBtn"><i class="fa-solid fa-arrow-left"></i> Previous</button>
          <button class="btn btn-outline-dark" id="nextBtn">Next <i class="fa-solid fa-arrow-right"></i></button>
        `;

        document.getElementById("prevBtn").addEventListener("click", () => {
          if (currentVerse > 1) {
            currentVerse--;
            localStorage.setItem('selectedVerse', currentVerse);
            loadVerse(chapterId, currentVerse);
          }
        });

        document.getElementById("nextBtn").addEventListener("click", () => {
          currentVerse++;
          localStorage.setItem('selectedVerse', currentVerse);
          loadVerse(chapterId, currentVerse);
        });
      })
      .catch(() => {
        versesContainer.innerHTML = `<div class="text-danger">No more verses found.</div>`;
      });
  }

  searchForm.addEventListener("submit", e => {
    e.preventDefault();
    const input = searchInput.value.trim();
    const [ch, vs] = input.split('.').map(Number);
    loadVerse(ch, vs);
  });

  loadVerse(chapterId, currentVerse);
}
