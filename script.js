const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const shuffleBtn = document.getElementById('shuffle-btn');
const repeatBtn = document.getElementById('repeat-btn');
const volumeSlider = document.getElementById('volume-slider');
const volumePercent = document.getElementById('volume-percent');

const songTitle = document.getElementById('song-title');
const artist = document.getElementById('artist');
const progressBar = document.querySelector('.progress-bar');
const progressContainer = document.querySelector('.progress-container');
const currentTimeDisplay = document.getElementById('current-time');
const totalTimeDisplay = document.getElementById('total-time');
const playlistInfo = document.getElementById('playlist-info');

// Playlist
const playlist = [
    { title: 'Pavazhamalli', artist: 'Devaa', duration: 240, url: 'https://example.com/song1.mp3' },
    { title: 'Song 2', artist: 'Artist 2', duration: 200, url: 'https://example.com/song2.mp3' },
    { title: 'Song 3', artist: 'Artist 3', duration: 220, url: 'https://example.com/song3.mp3' }
];

let currentSongIndex = 0;
let isPlaying = false;
let isShuffle = false;
let repeatMode = 0; // 0: no repeat, 1: repeat all, 2: repeat one
let playedIndices = [];

const audio = new Audio();
audio.volume = 0.7;

// Utility: Format time
function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Update display
function updateDisplay() {
    const song = playlist[currentSongIndex];
    songTitle.innerText = song.title;
    artist.innerText = song.artist;
    audio.src = song.url;
    totalTimeDisplay.innerText = formatTime(song.duration);
    playlistInfo.innerText = `${currentSongIndex + 1} / ${playlist.length}`;
    progressBar.style.width = '0%';
    currentTimeDisplay.innerText = '0:00';
}

// Play/Pause
playBtn.addEventListener('click', () => {
    isPlaying = !isPlaying;
    updatePlayBtn();
    isPlaying ? audio.play() : audio.pause();
});

function updatePlayBtn() {
    playBtn.innerText = isPlaying ? '⏸' : '▶';
}

// Previous
prevBtn.addEventListener('click', () => {
    currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
    updateDisplay();
    isPlaying = false;
    updatePlayBtn();
});

// Next
nextBtn.addEventListener('click', () => {
    nextSong();
});

function nextSong() {
    if (isShuffle) {
        playedIndices.push(currentSongIndex);
        if (playedIndices.length === playlist.length) {
            playedIndices = [];
        }
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * playlist.length);
        } while (playedIndices.includes(randomIndex));
        currentSongIndex = randomIndex;
    } else {
        currentSongIndex = (currentSongIndex + 1) % playlist.length;
    }
    updateDisplay();
    if (isPlaying) audio.play();
}

// Shuffle
shuffleBtn.addEventListener('click', () => {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle('active', isShuffle);
});

// Repeat
repeatBtn.addEventListener('click', () => {
    repeatMode = (repeatMode + 1) % 3;
    updateRepeatDisplay();
});

function updateRepeatDisplay() {
    repeatBtn.classList.toggle('active', repeatMode > 0);
    if (repeatMode === 2) {
        repeatBtn.innerText = '🔂'; // Repeat one
    } else {
        repeatBtn.innerText = '🔁'; // Repeat all
    }
}

// Audio events
audio.addEventListener('timeupdate', () => {
    const percent = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = percent + '%';
    currentTimeDisplay.innerText = formatTime(audio.currentTime);
});

audio.addEventListener('ended', () => {
    if (repeatMode === 2) {
        // Repeat one
        audio.currentTime = 0;
        audio.play();
    } else {
        nextSong();
        if (repeatMode === 1 || currentSongIndex !== 0) {
            audio.play();
        }
    }
});

// Progress bar seek
progressContainer.addEventListener('click', (e) => {
    const rect = progressContainer.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audio.currentTime = percent * audio.duration;
});

// Volume control
volumeSlider.addEventListener('input', (e) => {
    const volume = e.target.value / 100;
    audio.volume = volume;
    volumePercent.innerText = e.target.value + '%';
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    switch(e.key.toLowerCase()) {
        case ' ':
            e.preventDefault();
            playBtn.click();
            break;
        case 'n':
            nextBtn.click();
            break;
        case 'p':
            prevBtn.click();
            break;
        case 's':
            shuffleBtn.click();
            break;
        case 'r':
            repeatBtn.click();
            break;
    }
});

// Initialize
updateDisplay();