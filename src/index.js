import "./assets/style/all.scss";
import axios from "axios";
import "bootstrap";

//dom
const tag = document.createElement("script");
const firstScriptTag = document.getElementsByTagName("script")[0];
const play = document.querySelector(".play");
const pause = document.querySelector(".pause");
const forward = document.querySelector(".forward");
const backward = document.querySelector(".backward");
const repeat = document.querySelector(".repeat");
const previous = document.querySelector(".previous");
const next = document.querySelector(".next");
const random = document.querySelector(".random");
const volume = document.querySelector(".volume");
const volumeBtn = document.querySelector(".volumeBtn");
const inputInfo = document.querySelector(".inputInfo");
const search = document.querySelector(".search");
const playlists = document.querySelector(".playlists");
const repeatPlayList = document.querySelector(".repeatPlayList");
const length = document.querySelector(".length");
const currentTimeBar = document.querySelector('.currentTimeBar')
const songImg = document.querySelector('.songImg')
const loading = document.querySelector('.loading')
// variable
tag.src = "https://www.youtube.com/iframe_api";
let player= null;
let playId = 'PL5NDQ4Fnj_BzeO1zSQ4WW62uTik5XZyzQ' ;
let songsList = [];
let songsListId = [];
let songListLi = [];
let presentSongIndex = 0;
let currentPlaySongId;
let repeatList = false;
let signSongRepeat = false;
let isRadomSong = false; 

//function
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
function setPlayer(){
  window.YT.ready(function onYouTubeIframeAPIReady(id) {
      player = new YT.Player("player", {
        videoId: id,   // YouTube 影片ID
        width: 0,      // 播放器寬度 (px)
        height: 0,     // 播放器高度 (px)
        playerVars: {
          controls: 0, // 顯示播放器
          loop: 1,     // 重覆播放
          autohide: 0, // 影片播放時，隱藏影片控制列
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange
        }
      });
  });
}


// 一載入就會觸發的函式
function onPlayerReady(e) {
  e.target.setVolume(100);
  e.target.playVideo();
  // 當使用影片要重覆播放時，需再輸入YouTube 影片ID
  e.target.cuePlaylist({
      listType: 'playlist',
      list: playId,
  });
  setTimeout(()=>{
    loading.classList.add('d-none');
  },500);
}

// 播放時會觸發的函式
let done = false;
function onPlayerStateChange(e) {
  // 第一次加載音樂
  if (e.data == -1) {
    currentPlaySongId = player.getVideoData().video_id;
    presentSongIndex = player.getPlaylistIndex();
    getSongDurationTime();
    getSongCurrentTime();
    }
  if(e.data == YT.PlayerState.CUED){
    songsListId = player.getPlaylist();
    getBar();
  } else if (e.data == YT.PlayerState.PLAYING) {
    songIdMatchIndex();
    addOrRemoveMusicPlaying();
    document.querySelector(".cdPlayer img").classList.add("cd");
    done = true;
    player.setSize(0, 0);
    // play & pause 按鈕切換
    play.classList.add('d-none');
    pause.classList.remove('d-none');
    showSongImg();
  } else if (e.data === YT.PlayerState.PAUSED || e.data === YT.PlayerState.ENDED) {
    document.querySelector(".cdPlayer img").classList.remove("cd");
  }
  // 單曲循環
  if (e.data === YT.PlayerState.ENDED){
    if (signSongRepeat) {
      player.seekTo(0);
    }
  } 
}

// 搜尋功能
function searchSong() {
  axios.get("https://www.googleapis.com/youtube/v3/search", {
      params: {
        part: "snippet", // 必填，把需要的資訊列出來
        maxResults: 10, // 預設為五筆資料，可以設定1~50
        q: `${inputInfo.value}`,
        key: process.env.KEY
      }
    })
    .then((res) => {
      songsList = res.data.items;
      showSearchSongList();
    })
    .catch((err) => {
      console.log(err);
    });
}
// 顯示搜尋歌單
function showSearchSongList() {
  let result = "";
  songsListId = [];
  songsList.forEach((i, index) => {
    result += `<li><a class="songList dropdown-item" data-index=${index} data-vid=${i.id.videoId} href="#">${i.snippet.title}</a></li>`
    songsListId.push(i.id.videoId)
  });
  playlists.innerHTML = result;
  player.loadPlaylist(songsListId, 0, 0)
  songListLi = document.querySelectorAll(".songList")
}

//取得歌曲資料 - 自訂歌單
function getSongData() {
  axios.get('https://www.googleapis.com/youtube/v3/playlistItems',
    {
    params: {
    part: 'snippet,contentDetails',// 必填，把需要的資訊列出來
    playlistId: playId,// 播放清單的id
    maxResults: 20,// 預設為五筆資料，可以設定1~50
    key: process.env.KEY
    }
    })
    .then(res => {
      songsList = res.data.items; 
      showSongList();
      showSongImg();
      init();
    }).catch(err => console.log(err))
}
getSongData();

// 初次自動載入
function init(){
  pause.classList.add('d-none');
  volume.classList.add('d-none');
  const id = songListLi[0].dataset.vid;
  setPlayer(id);
}

// 顯示歌單
function showSongList() {
  let result = "";
  songsList.forEach((i, index) => {
    result += `<li><a class="songList dropdown-item d-inline-block text-truncate" data-index=${index} data-vid=${i.snippet.resourceId.videoId} href="#">${i.snippet.title}</a></li>`;
  });
  playlists.innerHTML = result;
  songListLi = document.querySelectorAll(".songList")
}

// 點擊歌單播放
playlists.addEventListener("click", (e) => {
  if (e.target.nodeName === 'A') {
    const songListIndex = Number(e.target.dataset.index);
    player.playVideoAt(songListIndex);
  }
})

// 在播放狀態自動對照id與presentSongIndex
function songIdMatchIndex() {
  songsList.forEach((i, index) => {
      if (i.snippet.resourceId.videoId === player.getVideoData().video_id) {
        presentSongIndex = index
      }
      else if (i.id.videoId === player.getVideoData().video_id) {
        presentSongIndex = index
      }
    })
}

// 增加播放中focus效果，不是播放中則移除。
function addOrRemoveMusicPlaying() {
  songListLi.forEach((i,index) => {
    if (Number(i.dataset.index) === presentSongIndex) {
      songListLi[index].classList.add('musicPlaying');
    } else {
      songListLi[index].classList.remove('musicPlaying');
    }
  })
}


// 開始播放
play.addEventListener('click',()=>{
  player.playVideo();
  play.classList.add('d-none');
  pause.classList.remove('d-none');
})

// 暫停歌曲
pause.addEventListener('click',()=>{
  player.pauseVideo();
  pause.classList.add('d-none');
  play.classList.remove('d-none');
})

// 上一首
previous.addEventListener("click", ()=>{
  player.stopVideo();
  player.previousVideo();
});

// 下一首
next.addEventListener("click", ()=>{
  if(signSongRepeat){
    repeat.click();
  }
  player.stopVideo();
  player.nextVideo();
});

// 亂數播放
random.addEventListener("click", ()=>{
  isRadomSong = !isRadomSong;
  if (isRadomSong) {
    random.classList.add('text-primary');
    player.setShuffle(true);
    player.nextVideo();
    songListSort();
  } else {
    random.classList.remove('text-primary'); 
  }
  // 假如亂數播到歌單最後一首，就回到上一首
  if( presentSongIndex === songsListId.length ){
    repeatPlayList.click();
  }
})

// 單曲循環
repeat.addEventListener("click", () => {
  signSongRepeat = !signSongRepeat;
  if (signSongRepeat) {
    player.loadVideoById(currentPlaySongId);
    repeat.classList.add('text-primary');
  } else {
    repeat.classList.remove('text-primary');
    const currentTime = player.getCurrentTime()
    const index = songsListId.indexOf(currentPlaySongId)
    // 重新載入歌單
    player.loadPlaylist(songsListId, index, currentTime);
  }
});

// 歌單循環
repeatPlayList.addEventListener("click", ()=>{
  repeatList = !repeatList;
  if (repeatList) {
    player.setLoop(true);
    repeatPlayList.classList.add('text-primary')
  } else {
    player.setLoop(false);
    repeatPlayList.classList.remove('text-primary') 
  }
})

// 快進10秒
forward.addEventListener("click", ()=>{
  let current = '';
  current = player.getCurrentTime();
  player.seekTo(current + 10);
})

// 後退10秒
backward.addEventListener("click", ()=>{
  let current = '';
  current = player.getCurrentTime();
  player.seekTo(current - 10);
})

// 控制播放進度條
function mouseControl (e) {
  // length 左邊偏移的值
  const x = length.offsetLeft;
  // 滑鼠的水平座標
  const mouseX = e.clientX;
  // length 的寬度
  const xWidth = length.offsetWidth;
  // 進度條的 % 數
  let xResult = ((mouseX - x) / xWidth).toFixed(2);
  // 尋找指定的秒數
  player.seekTo(player.getDuration() * xResult);
}


// 計算進度條
function getBar () {
  let result = ''
  setInterval(()=>{
    result = (player.getCurrentTime() / player.getDuration()).toFixed(2);
    result = `${result * 100}`+'%'
    currentTimeBar.style.width = result;
  },1000)
}

// 取得目前歌曲時間
function getSongCurrentTime () {
  let result = '';
  let min = '';
  let sec = '';
  setInterval(()=>{
    min = Math.floor(player.getCurrentTime() / 60)
    // 秒數取餘數
    sec = Math.floor(player.getCurrentTime() % 60)
    result = `${min < 10 ?  '0' + min : min}:${sec < 10 ?  '0' + sec : sec}`
    document.querySelector('.currentTime').textContent = result
  },1000)
}

// 取得歌曲時間
function getSongDurationTime () {
  let result = '';
  let min = '';
  let sec = '';
  min = Math.floor(player.getDuration() / 60)
  sec = Math.floor(player.getDuration() % 60)
  result = `${min < 10 ?  '0' + min : min}:${sec < 10 ?  '0' + sec : sec}`
  document.querySelector('.lastTime').textContent = result
}

// 滑鼠控制進度條
length.addEventListener("click", (e)=>{ mouseControl (e) })

// 調整音量
volume.addEventListener("change", () => {
  player.setVolume(volume.value);
  volume.style = `background-size:${volume.value}%`;
});

// hover 顯示 音量條
volumeBtn.addEventListener("mouseover", (e)=>{ volume.classList.remove('d-none'); })

// hover 隱藏 音量條
volume.addEventListener("mouseout", (e)=>{ volume.classList.add('d-none'); })

// search關鍵字並覆蓋現有歌單
search.addEventListener("click", searchSong);

// 歌單重新排序
function songListSort(){
  let shuffle = []
    songsList.forEach((i, index) => {
      const songIndex = songsListId.indexOf(i.snippet.resourceId.videoId);
      shuffle.splice(songIndex, 0, songsList[index])
    });
    songsList = shuffle ;
    showSongList();
    showSongImg();
};

// 背景插入歌曲圖片
function showSongImg(){
  let songImgData = [];
  let songImgArr = [];
  let standardQualityImg = []
  let highQualityImg = []
  let undefinedIndex = [];
  songsList.forEach((item,index) => {
    songImgData.push(item.snippet.thumbnails.maxres);
    standardQualityImg.push(item.snippet.thumbnails.standard);
    highQualityImg.push(item.snippet.thumbnails.high);
    songImgData.forEach((item,i)=>{
       if(item === undefined){
         undefinedIndex.push(i);
         undefinedIndex = [...new Set(undefinedIndex)];
      }
    })
    undefinedIndex.forEach(index=>{ 
      // 刪除undefined，插入較低畫質的圖片網址
      songImgData.splice(index,1);
      songImgData.splice(index,0,standardQualityImg[index]);
      if(standardQualityImg[index] === undefined){
        songImgData.splice(index,0,highQualityImg[index])
      }
    })
  }); 
  songImgData.forEach( item =>{ songImgArr.push(item.url) });
  songImg.src = `${songImgArr[presentSongIndex]}`;
  // 如果沒有640p的圖片，就去掉專輯圖片。
  if(songImg.getAttribute('src') === undefined){
    songImg.classList.add('d-none');
   } else {
     songImg.classList.remove('d-none');
   }
}