import "./assets/style/all.scss";
import axios from "axios";
import "bootstrap";
import {watchPlaylistForDragAndDrop} from './assets/methods/dargAndDrop';
import variables,* as dom from './assets/methods/dom';
import {mouseControl} from './assets/methods/progressBar';
import {showSongImg,showSongInfo} from './assets/methods/songsInfo';
import {songListSort} from './assets/methods/songList';
import {getSongData,searchSong} from './assets/methods/getData';

dom.tag.src = "https://www.youtube.com/iframe_api";
dom.firstScriptTag.parentNode.insertBefore(dom.tag, dom.firstScriptTag);

getSongData();

// 開始播放
dom.play.addEventListener('click',()=>{
  variables.player.playVideo();
  dom.play.classList.add('d-none');
  dom.pause.classList.remove('d-none');
})

// 暫停歌曲
dom.pause.addEventListener('click',()=>{
  variables.player.pauseVideo();
  dom.pause.classList.add('d-none');
  dom.play.classList.remove('d-none');
})

// 上一首
dom.previous.addEventListener("click", ()=>{
  variables.player.stopVideo();
  variables.player.previousVideo();
});

// 下一首
dom.next.addEventListener("click", ()=>{
  if(variables.signSongRepeat){
    dom.repeat.click();
  }
  variables.player.stopVideo();
  variables.player.nextVideo();
});

// 亂數播放
dom.random.addEventListener("click", ()=>{
  variables.isRadomSong = !variables.isRadomSong;
  if (variables.isRadomSong) {
    dom.random.classList.add('text-primary');
    variables.player.setShuffle(true);
    variables.player.nextVideo();
    showSongImg();
    showSongInfo();
    songListSort();
  } else {
    dom.random.classList.remove('text-primary'); 
  }
  // 假如亂數播到歌單最後一首，就回到上一首
  if( variables.presentSongIndex === variables.songsListId.length ){
    dom.repeatPlayList.click();
  }
})

// 單曲循環
dom.repeat.addEventListener("click", () => {
  variables.signSongRepeat = !variables.signSongRepeat;
  if (variables.signSongRepeat) {
    variables.player.loadVideoById(variables.currentPlaySongId);
    dom.repeat.classList.add('text-primary');
  } else {
    dom.repeat.classList.remove('text-primary');
    const index = variables.songsListId.indexOf(variables.currentPlaySongId)
    // 重新載入歌單
    variables.player.loadPlaylist(variables.songsListId, index, variables.currentTime);  
  }
});

// 歌單循環
dom.repeatPlayList.addEventListener("click", ()=>{
  variables.repeatList = !variables.repeatList;
  if (variables.repeatList) {
    variables.player.setLoop(true);
    dom.repeatPlayList.classList.add('text-primary')
  } else {
    variables.player.setLoop(false);
    dom.repeatPlayList.classList.remove('text-primary') 
  }
})

// 快進10秒
dom.forward.addEventListener("click", ()=>{
  let current = '';
  current = variables.player.getCurrentTime();
  variables.player.seekTo(current + 10);
})

// 後退10秒
dom.backward.addEventListener("click", ()=>{
  let current = '';
  current = variables.player.getCurrentTime();
  variables.player.seekTo(current - 10);
})

// 滑鼠控制進度條
dom.length.addEventListener("click", (e)=>{ mouseControl (e) })

// 調整音量
dom.volume.addEventListener("change", () => {
  variables.player.setVolume(dom.volume.value);
  dom.volume.style = `background-size:${dom.volume.value}%`;
});

// hover 顯示 音量條
dom.volumeBtn.addEventListener("mouseover", ()=>{ dom.volume.classList.remove('d-none'); })

// hover 隱藏 音量條
dom.volume.addEventListener("mouseout", ()=>{ dom.volume.classList.add('d-none'); })

// 監聽搜尋的值並覆蓋現有歌單
dom.inputInfo.addEventListener('change',()=>{
    setTimeout(()=>{ searchSong(); },1000)
})

// 點擊歌單播放
dom.playlists.addEventListener("click", (e) => {
  if (e.target.nodeName === 'A') {
    const songListIndex = Number(e.target.dataset.index);
    variables.player.loadPlaylist(variables.songsListId, songListIndex, 0);
  }
})

function addEventListeners() {
  watchPlaylistForDragAndDrop();
  // console.log('123')
}
addEventListeners();


