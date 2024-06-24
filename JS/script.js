
console.log("Let's write JavaScript");
 

let currentSong = new Audio;
let songs;
let currentFolder;

// async function getSongs(folder){

 
//     currentFolder = folder;

//     // let raw = await fetch(`http://127.0.0.1:3000/${folder}/`); --- It can we be ...

//     let raw = await fetch(`https://asad-ali-developer.github.io/Spotify-Clone-by-Asad/${folder}/`);
//     let response = await raw.text();
//     // console.log(response);

//     let element = document.createElement("div");
//     element.innerHTML = response

//     let as = element.getElementsByTagName("a")
//     // console.log(as);


//     songs = [];

//     // We have to run loop to extract all "a's" from response

//     for (let index = 0; index < as.length; index++) {
//         const element = as[index];
//         if(element.href.endsWith(".mp3")){
//             songs.push(element.href.split(`/${folder}/`)[1])
//         }
//     }
    
//     // console.log(songs);

//     let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    
//     var clutter = "";
    
//     songs.forEach((elem) => {
//         clutter += `<li>
//         <img class="invert" src="images/music.svg" alt="">
        
//         <div class="info">
//             <div class="songName"> ${elem.replaceAll("%20", " ")}
//             </div>
//             <div class="singerName">Asad</div>
//         </div>

//         <div class="playNow">
//             <span>Play Now</span>
//             <img class="border invert" src="images/playbtn.svg" alt="">
//         </div>
//     </li>`
//     })
   
//     songUL.innerHTML = clutter;


//     // var leftSong;

// //    let songIterate = document.querySelector(".songList").getElementsByTagName("li")

//   Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach((elem) => {
//     elem.addEventListener("click", () => {
//         // console.log(elem.querySelector(".info").firstElementChild.innerHTML); 
//         playMusic(elem.querySelector(".info").firstElementChild.innerHTML.trim()); 
//         // Here, trim() is wrote to remove the extra spaces in url or Address ...
//     })
//   })

// }


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
        play.src = "images/pause.svg"
    }

    // play.src = "images/play.svg"

    
    
    // currentSong.play();
    // currentSong.play();

    document.querySelector(".songInfo").innerHTML = decodeURI(track);
    document.querySelector(".songTime").innerHTML = "00:00 / 00:00"
    document.querySelector(".volume").innerHTML = track.volume

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

// playMusic()







async function displayAlbums(){
    let raw = await fetch(`http://127.0.0.1:5500/songs/`)
    let response = await raw.text();
    // console.log(response);

    let div = document.createElement("div")
    div.innerHTML = response
    console.log(div);

    let anchors = div.getElementsByTagName("a")
    // console.log(anchors);
    
    let cardsContainer = document.querySelector(".cardsContainer");

    let array = Array.from(anchors)

    for (let index = 0; index < array.length; index++) {
        const elem = array[index];
    
    
         
        if(elem.href.includes("/songs/")){

            // console.log(elem.href.split("/").splice(-1)[0]);

            let folder = elem.href.split("/").splice(-1)[0];

            // This is used to fetch the data from folder which is 'info.json'
            let raw = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`)
            let response = await raw.json();

            cardsContainer.innerHTML += `<div data-folder="${folder}" class="card">
                    <div class="img">
                    <img src="/songs/${folder}/cover.jpeg" alt="">
                    </div>
                <h1>${response.title}</h1>
                <p>${response.description}</p>
                
                <div class="play-btn">
                <i class="bx bx-play"> </i>
            </div>
                </div>`
            
            
            // document.querySelector(".cardsContainer").innerHTML = clutter;
        }
    }

     // Load the playlist whenever card is clicked!

     Array.from(document.getElementsByClassName("card")).forEach((elem) => {
        elem.addEventListener("click", async (item) => {
  
           songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
        })
    })


}


async function main(){
    
    
    await getSongs("songs/Indian")
    
    playMusic(songs[0], true)
    



    // Display All the Albums on the page
    displayAlbums()
    
    
    
    
    // Attach an event Listener to Play, Next and Pause.
    
    let play = document.getElementById("play");
//   let play = document.querySelector(".play")

  play.addEventListener('click', () => {
    if(currentSong.paused){
        currentSong.play()
        play.src = "images/pause.svg"

        volumeShow.style.display = "block"
        
    }
    else{
        currentSong.pause();
        play.src = "images/play.svg"
        volumeShow.style.display = "block"

    }
  })


  // Listen for timeupdate event

  currentSong.addEventListener('timeupdate', () => {
    // console.log(currentSong.currentTime, currentSong.duration);

    document.querySelector(".songTime").innerHTML = `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`

    // Alhamdulillah, this is made by me...
    if(currentSong.currentTime == currentSong.duration){      
        document.querySelector(".songTime").innerHTML = `00:00 / 00:00`
    }


    // For circle of Seekbar movement
    document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";

    if(currentSong.currentTime == currentSong.duration){
        document.querySelector(".circle").style.left = "0"
        document.querySelector(".circle").style.transition = "0"
    }

  })

  if (currentSong.currentTime === currentSong.duration) {
    // Access the element with the ID 'play' and change its image source to 'play.svg'
    document.getElementById("play").src = "images/play.svg";
}

    // Adding an event listener to the seekbar
    document.querySelector(".seekBar").addEventListener('click', (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;

        // document.querySelector(".circle").style.left = percent + "%";

        // And, for seekBar
        currentSong.currentTime = ((currentSong.duration ) * percent) / 100; 
    })

    


    // Adding Event Listener to the Hamburger Function

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.transform = "translateX(0)";
    });

    document.querySelector(".cancel").addEventListener("click", () => {
        document.querySelector(".left").style.transform = "translateX(-100%)";
    });

 


    
    // Add an event listener to volume
    var volumeShow = document.querySelector(".range").getElementsByTagName("input")[0]
    volumeShow.addEventListener("change", (e) => {
        // console.log(e, e.target, e.target.value);
        currentSong.volume = parseInt(e.target.value) / 100;
        // We parses the value of range into volume function as an argument
    })





    // Add an event listener to the next
    
    let next =  document.querySelector("#next")
    let previous = document.querySelector("#previous")
    
    next.addEventListener("click", () => {
        console.log("just clicked!");
        let index = songs.indexOf(currentSong.src.split('/').slice(-1)[0]);
        console.log(index);

        if(index + 1 < songs.length){
            playMusic(songs[index + 1])
        }
       
    })
    
    // Add an event listener to PreviOus
    previous.addEventListener("click", () => {
        console.log("just clicked!");
        
        let index = songs.indexOf(currentSong.src.split('/').slice(-1)[0]);
        console.log(index);

        if(index - 1 >= 0){
            playMusic(songs[index - 1])
        }
    })


    // Add an event listener to the volume track
    document.querySelector("#volume>img").addEventListener("click", e=>{ 
        if(e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentSong.volume = .20;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 20;
        }         


    })
   
   
}  

main()

