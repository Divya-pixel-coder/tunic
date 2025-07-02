console.log("let's start frontend javascript");

let currentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00"
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}



async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(` /${folder}`)
    let response = await a.text();
    // console.log(response);
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    // console.log(as);
    // let 
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        //  if (element.href.endsWith(".mp3")) {
        // songs.push(element.href.split(`/${folder}/`)[1])}
        if (element.href.endsWith(".mp3")) {
        let hrefPath = new URL(element.href).pathname;
        let fileName = hrefPath.split(`${folder}/`)[1]; // keeps it encoded
        if (fileName) songs.push(fileName);
    }
}
    //show all the songs in the playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = "";
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li> 
        <img class="invert" src="img/music.svg" alt="">
                           <div class="info">
                              <div> ${decodeURIComponent(song)}</div>



                                <div>Divya</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="img/play.svg" width="50px" height="80px" alt="">
                            </div>
                             </li>`;

    }

    //attach an eventlistener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            // console.log(e.querySelector(".info").firstElementChild.innerHTML)
            // playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

            //find actual song filename to play
            // let clickedTitle = e.querySelector(".info").firstElementChild.innerHTML.trim();
            // let matchedSong = songs.find(song => decodeURIComponent(song).replaceAll("%20", " ").includes(clickedTitle));
       //     let clickedTitle = e.querySelector(".info").firstElementChild.innerHTML.trim();
// let matchedSong = songs.find(song => decodeURIComponent(song).replace(".mp3", "") === clickedTitle);

let clickedTitle = e.querySelector(".info").firstElementChild.innerText.trim();

let matchedSong = songs.find(song => {
    return decodeURIComponent(song).trim().toLowerCase() === clickedTitle.trim().toLowerCase();
});


console.log("Clicked:", clickedTitle);
console.log("Available songs:", songs.map(s => decodeURIComponent(s)));



            if (matchedSong) {
                playMusic(matchedSong);
            } else {
                console.error("Song not found for title:", clickedTitle);
            }


        });

    });


    return songs

}

// const playMusic=(track)=>{
//     // let audio=new Audio("/songs/"+ track)
//    currentSong.src="/songs/"+ encodeURIComponent(track);
//    currentSong.play()
//}

const playMusic = (track, pause = false) => {

    let fullPath = `/${currFolder}/` + track;
    // console.log("Trying to play:", fullPath);  // ✅ Debug log
    currentSong.src = fullPath;
    //currentSong.play().catch(err => console.error("Error playing file:", err));
    if (!pause) {
        currentSong.play()
        play.src = "img/pause.svg"

    }

    else{
        play.src="/img/play.svg"
    }
    //if (!pause) currentSong.play();


    // Set song name and artist in UI
    const decodedTrack = decodeURIComponent(track).replace(".mp3", "");
    // Try to split by " - " to extract artist if filename supports it
    let [title, artist] = decodedTrack.split(" - ");



    // document.getElementById("currentSongName").innerText = title || decodedTrack;
    // document.getElementById("currentArtistName").innerText = "Divya";


    //correct way to write currentsongname and artist
    let songNameEl = document.getElementById("currentSongName");
    if (songNameEl) songNameEl.innerText = title || decodedTrack;

    let artistEl = document.getElementById("currentArtistName");
    if (artistEl) artistEl.innerText = "Divya";
    //also write this
    // document.getElementById("currentSongName")?.innerText = title || decodedTrack;
    // document.getElementById("currentArtistName")?.innerText = "Divya";



    // Set the song info in the playbar
    //  document.querySelector(".songinfo").innerHTML = decodeURIComponent(track)
    // document.querySelector(".songinfo").innerHTML = title || decodedTrack;

if (title || decodedTrack) {
    document.querySelector(".songinfo").innerHTML = title || decodedTrack;
}


    document.querySelector(".songtime").innerHTML = "00 / 00"

}


async function displayAlbums() {
    let a = await fetch(` /songs/`)
    let response = await a.text();
    // console.log(response);
    let div = document.createElement("div")

    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")


    // Array.from(anchors).forEach(async e=>{
    //     if(e.href.includes("/songs")){
    //         // console.log(e.href.split("/").slice(-2)[0]);
    //         // let folder=e.href.split("/").slice(-2)[0];
    //         let folder = e.href.split("/").slice(-2, -1)[0];


    //         //get the metadata of the folder
    //         let a= await fetch(` /songs/${folder}/info.json`)
    //         let response=await a.json();
    //         console.log(response);

    //         cardContainer.innerHTML=cardContainer.innerHTML + ` <div  class="card" data-folder="cs">
    //                     <div class="play">
    //                         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
    //                             class="icon">
    //                             <path fill="black" d="M8 5v14l11-7z" />
    //                         </svg>
    //                     </div>
    //                     <img src="/songs/${folder}/cover.jpg" alt="">
    //                     <h2>${response.title}</h2>
    //                     <p>${response.description}</p>
    //                 </div>`

    //     }
    // })


    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];

        if (e.href.includes("/songs/")) {
            // ✅ Extract clean folder name
            let path = new URL(e.href).pathname;
            let parts = path.split("/").filter(Boolean);  // removes empty strings
            let folder = parts[1]; // safely get folder name like 'cs', 'ncs'

            try {
                let res = await fetch(` /songs/${folder}/info.json`);
                let info = await res.json();

                cardContainer.innerHTML += `
                <div class="card" data-folder="${folder}">
                    <div class="play">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                            class="icon">
                            <path fill="black" d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                    <img src="/songs/${folder}/cover.jpg" alt="">
                    <h2>${info.title}</h2>
                    <p>${info.description}</p>
                </div>`;
            } catch (err) {
                console.error(`❌ Error loading album for folder: ${folder}`, err);
            }
        }
    };

    //load the playlist whenever the card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            let folder = item.currentTarget.dataset.folder;
            console.log("Clicked folder:", folder);

            songs = await getSongs(`songs/${folder}`);
            console.log("Songs after fetching:", songs);

            if (songs.length > 0) {
                playMusic(songs[0]);
            } else {
                console.error("No songs found in folder:", folder);
            }
        });
    });



    // Array.from(document.getElementsByClassName("card")).forEach(e => {
    //     e.addEventListener("click", async item => {
    //         let folder = item.currentTarget.dataset.folder;
    //         console.log("Clicked folder:", folder);

    //         songs = await getSongs(`songs/${folder}`);
    //         console.log("Songs after fetching:", songs);

    //         // ✅ Fix: only call getSongs once and then play
    //         if (songs && songs.length > 0) {
    //             playMusic(songs[0]);
    //         } else {
    //             console.error("No songs found in folder:", folder);
    //         }
    //     });
    // });
}



async function main() {

    //get the list of all the songs
    // songs = 
    await getSongs("songs/arjit singh")
    console.log(songs);
    
   // playMusic(songs[0], true)
  

//     if (songs && songs.length > 0) {
//     playMusic(songs[0], true);
// } else {
//     document.querySelector(".songinfo").innerHTML = "No songs found";

//   play.src = "img/pause.svg"; // ✅ force play icon after loading
// }

if (songs && songs.length > 0) {
    let track = songs[0];
    currentSong.src = `songs/arjit singh/` + track;
    currFolder = `songs/arjit singh`;

    let decodedTrack = decodeURIComponent(track).replace(".mp3", "");
    let [title, artist] = decodedTrack.split(" - ");

    document.getElementById("currentSongName").innerText = title || decodedTrack;
    document.getElementById("currentArtistName").innerText = "Divya";
    document.querySelector(".songinfo").innerHTML = title || decodedTrack;
    document.querySelector(".songtime").innerHTML = "00 / 00";
    play.src = "img/play.svg";  // don't auto play
}



    



    //display all the albums on page
  await  displayAlbums()

   

  //  Step 2: Simulate click on "arjit singh" card to load songs and metadata
let folderName = "arjit singh";
let encodedFolder = encodeURIComponent(folderName);
let arjitCard = document.querySelector(`.card[data-folder="${encodedFolder}"]`);

    if (arjitCard) {
        arjitCard.click();
    } else {
        console.warn("Arjit Singh card not found!");
        // fallback if card not found
        await getSongs("songs/arjit singh");
        playMusic(songs[0], true);
    }



    



    //attach an event listener to play,next and previous
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "img/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "img/play.svg"
        }
    })

    //listen for time update event
    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = ` ${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`

        //     currentSong.addEventListener("timeupdate", () => {
        //     const current = secondsToMinutesSeconds(currentSong.currentTime);
        //     const duration = isNaN(currentSong.duration) ? "00:00" : secondsToMinutesSeconds(currentSong.duration);

        //     document.querySelector(".songtime").innerHTML = `${current} / ${duration}`;
        // });


        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    document.querySelector(".seekbar").addEventListener("click", e => {
        //just to see what to do // console.log(e.target.getBoundingClientRect().width,e.offsetX);
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    //add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    //add an event listener for close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-140%"
    })

    //add an event listener to previous
    previous.addEventListener("click", () => {
        console.log("previous clicked");
        // console.log(currentSong);
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
            play.src = "img/pause.svg";
        }

    })

    //add an event listener to next
    next.addEventListener("click", () => {
        currentSong.pause()
        console.log("next clicked");
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
             play.src = "img/pause.svg";
        }

        // console.log(songs);
    })

    //add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        // console.log("Setting volume to ",e, e.target, e.target.value, "/100");
        console.log("Setting volume to ", e.target.value, "/100");
        currentSong.volume = parseInt(e.target.value) / 100
        if(currentSong.volume>0){
                document.querySelector(".volume>img").src = e.target.src.replace("img/mute.svg", "img/volume.svg") 
        }
    })

    //add event listener to mute the track
    document.querySelector(".volume>img").addEventListener("click", e => {
        console.log(e.target);
        console.log("changing", e.target.src);
        if (e.target.src.includes("img/volume.svg")) {
            e.target.src = e.target.src.replace("img/volume.svg", "img/mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0
        }
        else {
            e.target.src = e.target.src.replace("img/mute.svg", "img/volume.svg")
            currentSong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10
        }

    })








}
window.addEventListener("DOMContentLoaded", () => {
    main();
});

