const playBtn = document.querySelector('.video__player-img');
const video = document.getElementById('player');
const playerPlayBtn = document.querySelector('.duration__img');
const videoWrapper = document.querySelector('.video__wrapper');
const soundBtn = document.querySelector(".sound");

let durationControl;
let soundControl;
let intervalId;
let soundLevel;

video.addEventListener('loadeddata', () => {
    video.addEventListener('click', playStop);

    videoWrapper.addEventListener('click', (e) => {
        if (e.target.classList.contains('play')) {
            playStop();
        }
    });

    durationControl = document.getElementById("durationLevel");
    durationControl.addEventListener('input', setVideoDuration);

    durationControl.min = 0;
    durationControl.value = 0;

    durationControl.max = video.duration;

    video.addEventListener('ended', function () {
        playBtn.classList.toggle("video__player-img--active");
        video.currentTime = 0;
        playerPlayBtn.classList.remove('active');
        clearInterval(intervalId);

    });

    let micControl = document.getElementById('mic');
    micControl.addEventListener('click', soundOf);
    
    soundControl = document.getElementById('micLevel');
    soundControl.addEventListener('input', changeSoundVolume);

    soundControl.min = 0;
    soundControl.max = 10;

    soundControl.value = soundControl.max;
});

function playStop() {
    playBtn.classList.toggle('video__player-img--active');

    if (video.paused) {
        video.play();
        intervalId = setInterval(updateDuration, 1000 / 60)
        playerPlayBtn.classList.add('active');
    } else {
        video.pause();
        clearInterval(intervalId);
        playerPlayBtn.classList.remove('active');
    }
}

function setVideoDuration() {
    video.currentTime = durationControl.value;
    updateDuration();
}

function updateDuration() {
    durationControl.value = video.currentTime;

    let step = video.duration / 100;
    let percent = video.currentTime / step;
    durationControl.style.background = `linear-gradient(90deg, #FED83F 0%, #FED83F ${percent}%, #626262 ${percent}%)`;
}

function soundOf() {
    if (video.volume === 0) {
        video.volume = soundLevel;
        soundControl.value = soundLevel * 10;
        soundBtn.classList.remove('active');
    } else {
        soundLevel = video.volume;
        video.volume = 0;
        soundControl.value = 0;
        soundBtn.classList.add('active');
    }
}

function changeSoundVolume() {
    video.volume = soundControl.value / 10;
    if (video.volume === 0) {
        soundBtn.classList.add('active');
    } else {
        soundBtn.classList.remove('active');
    }
}