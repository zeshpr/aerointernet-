const tracks=[
 {title:"Aero Morning",artist:"Demo Atmosphere",src:"assets/music/aero-morning.mp3"},
 {title:"Blue Plastic Sky",artist:"Demo Track",src:"assets/music/blue-sky.mp3"},
 {title:"Green Signal",artist:"Demo Ambient",src:"assets/music/green-signal.mp3"}
];
const audio=document.getElementById("audio"),playlist=document.getElementById("playlistItems");let trackIndex=0;
function renderPlaylist(){playlist.innerHTML="";tracks.forEach((t,i)=>{const row=document.createElement("div");row.className="track"+(i===trackIndex?" active":"");row.innerHTML=`<span class="track-num">${String(i+1).padStart(2,"0")}</span><div class="track-info"><b>${t.title}</b><small>${t.artist}</small></div><button aria-label="Play">▶</button>`;row.addEventListener("click",()=>loadTrack(i,true));playlist.appendChild(row)});document.getElementById("trackCount").textContent=`${tracks.length} tracks`;}
function loadTrack(i,autoplay=false){trackIndex=(i+tracks.length)%tracks.length;const t=tracks[trackIndex];document.getElementById("trackTitle").textContent=t.title;document.getElementById("trackArtist").textContent=t.artist;audio.src=t.src;renderPlaylist();if(autoplay)audio.play().catch(()=>Aero.toast("Добавь MP3 в assets/music, чтобы услышать трек."))}
document.getElementById("playTrack").addEventListener("click",()=>{if(!audio.src)loadTrack(0);if(audio.paused)audio.play().catch(()=>Aero.toast("Добавь MP3-файлы в assets/music."));else audio.pause()});
document.getElementById("prevTrack").addEventListener("click",()=>loadTrack(trackIndex-1,true));document.getElementById("nextTrack").addEventListener("click",()=>loadTrack(trackIndex+1,true));
audio.addEventListener("play",()=>{document.getElementById("playTrack").textContent="❚❚";document.querySelector(".record").classList.add("playing")});audio.addEventListener("pause",()=>{document.getElementById("playTrack").textContent="▶";document.querySelector(".record").classList.remove("playing")});
audio.addEventListener("ended",()=>loadTrack(trackIndex+1,true));audio.addEventListener("timeupdate",()=>{const p=audio.duration?(audio.currentTime/audio.duration)*100:0;document.getElementById("progressBar").style.width=p+"%";document.getElementById("currentTime").textContent=fmt(audio.currentTime);document.getElementById("duration").textContent=fmt(audio.duration)});
function fmt(n){if(!Number.isFinite(n))return"0:00";return Math.floor(n/60)+":"+String(Math.floor(n%60)).padStart(2,"0")}
loadTrack(0);
