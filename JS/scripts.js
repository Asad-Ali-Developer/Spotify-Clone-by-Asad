console.log("Let's write JavaScript");

let currentSong = new Audio();
let songs;
let currentFolder;

async function getSongs(folder) {
    currentFolder = folder;

    try {
        let raw = await fetch(`https://asad-ali-developer.github.io/Spotify-Clone-by-Asad/${folder}/`);
        let response = await raw.text();

        let element = document.createElement("div");
        element.innerHTML = response;

        let as = element.getElementsByTagName("a");

        songs = [];

        for (let index = 0; index < as.length; index++) {
            const element = as[index];
            if (element.href.endsWith(".mp3")) {
                songs.push(element.href.split(`/${folder}/`)[1]);
            }
        }

        let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];

        let clutter = "";

        songs.forEach((elem) => {
            clutter += `<li>
                <img class="invert" src="images/music.svg" alt="">
                
                <div class="info">
                    <div class="songName">${elem.replaceAll("%20", " ")}</div>
                    <div class="singerName">Asad</div>
                </div>

                <div class="playNow">
                    <span>Play Now</span>
                    <img class="border invert" src="images/playbtn.svg" alt="">
                </div>
            </li>`;
        });

        songUL.innerHTML = clutter;

        Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach((elem) => {
            elem.addEventListener("click", () => {
                playMusic(elem.querySelector(".info").firstElementChild.innerHTML.trim());
            });
        });

    } catch (error) {
        console.error('Error fetching songs:', error);
    }
}

const playMusic = (track, pause = false) => {
    currentSong.src = `/${currentFolder}/` + track;

    if (!pause) {
        currentSong.play();
        document.getElementById("play").src = "images/pause.svg";
    }

    document.querySelector(".songInfo").innerHTML = decodeURI(track);
    document.querySelector(".songTime").innerHTML = "00:00 / 00:00";
};


async function displayAlbums() {
    const repoOwner = 'asad-ali-developer';
    const repoName = 'Spotify-Clone-by-Asad';
    const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/songs`;

    try {
        let response = await fetch(apiUrl);
        let data = await response.json();

        let cardsContainer = document.querySelector(".cardsContainer");

        data.forEach(async (item) => {
            if (item.type === 'dir') {
                let infoUrl = item.url.replace('https://api.github.com/repos/', 'https://raw.githubusercontent.com/');
                let infoResponse = await fetch(`${infoUrl}/info.json`);
                let info = await infoResponse.json();

                cardsContainer.innerHTML += `<div data-folder="${item.name}" class="card">
                    <div class="img">
                        <img src="https://raw.githubusercontent.com/${repoOwner}/${repoName}/main/songs/${item.name}/cover.jpeg" alt="">
                    </div>
                    <h1>${info.title}</h1>
                    <p>${info.description}</p>
                    
                    <div class="play-btn">
                        <i class="bx bx-play"> </i>
                    </div>
                </div>`;
            }
        });

        Array.from(document.getElementsByClassName("card")).forEach((elem) => {
            elem.addEventListener("click", async () => {
                await getSongs(`songs/${elem.dataset.folder}`);
            });
        });

    } catch (error) {
        console.error('Error fetching albums:', error);
    }
}

async function main() {
    await getSongs("songs/Indian");
    playMusic(songs[0], true);

    displayAlbums();

    let play = document.getElementById("play");
    play.addEventListener('click', () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "images/pause.svg";
        } else {
            currentSong.pause();
            play.src = "images/play.svg";
        }
    });

    currentSong.addEventListener('timeupdate', () => {
        document.querySelector(".songTime").innerHTML = `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";

        if (currentSong.currentTime == currentSong.duration) {
            document.querySelector(".circle").style.left = "0";
            document.querySelector(".circle").style.transition = "0";
        }
    });

    document.querySelector(".seekBar").addEventListener('click', (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        currentSong.currentTime = (currentSong.duration * percent) / 100;
    });

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.transform = "translateX(0)";
    });

    document.querySelector(".cancel").addEventListener("click", () => {
        document.querySelector(".left").style.transform = "translateX(-100%)";
    });

    let volumeShow = document.querySelector(".range").getElementsByTagName("input")[0];
    volumeShow.addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100;
    });

    let next = document.querySelector("#next");
    let previous = document.querySelector("#previous");

    next.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split('/').slice(-1)[0]);
        if (index + 1 < songs.length) {
            playMusic(songs[index + 1]);
        }
    });

    previous.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split('/').slice(-1)[0]);
        if (index - 1 >= 0) {
            playMusic(songs[index - 1]);
        }
    });

    document.querySelector("#volume>img").addEventListener("click", (e) => {
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg");
            currentSong.volume = 0;
            volumeShow.value = 0;
        } else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg");
            currentSong.volume = 0.2; // assuming 20% volume by default
            volumeShow.value = 20;
        }
    });
}

function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

main();
