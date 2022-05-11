import "./assets/style/all.scss";
import axios from "axios";
import "bootstrap";
import {watchPlaylistForDragAndDrop} from './assets/methods/dargAndDrop';
import variables,* as dom from './assets/methods/dom';
import {mouseControl} from './assets/methods/progressBar';
import {showSongImg,showSongInfo} from './assets/methods/songsInfo';
import {addOrRemoveMusicPlaying,songListSort} from './assets/methods/songList';
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


let repeatOrder = 1;
// 歌單循環
dom.repeatPlayList.addEventListener("click", ()=>{
  variables.player.playVideo();
  repeatOrder++;
  variables.repeatList = !variables.repeatList;
  if (variables.repeatList) {
     variables.player.setLoop(true);
     dom.repeatPlayList.classList.add('text-primary');
     console.log(repeatOrder);
  } 
  // 單曲循環
  if(repeatOrder === 2){
    dom.repeat.classList.remove('d-none');
    dom.repeatPlayList.classList.add('d-none');
    variables.player.loadVideoById(variables.currentPlaySongId);
    repeatOrder = 0;
  }
});

// 單曲循環
dom.repeat.addEventListener("click", () => {
  variables.signSongRepeat = !variables.signSongRepeat;
  // 歌單不循環
  if (!variables.signSongRepeat) {
    dom.repeat.classList.add('d-none');
    dom.repeatPlayList.classList.remove('d-none');
    dom.repeatPlayList.classList.remove('text-primary');
    variables.player.setLoop(false);
    variables.repeatList = false;
  };
});

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
    if(dom.inputInfo.value === ''){
      variables.searchResult = null;
      dom.searchResults.classList.add('d-none');
    }else {
      searchSong();
      variables.isSearch = true;
    }
})

// 點擊歌單播放
dom.playlists.addEventListener("click", (e) => {
  if (e.target.nodeName === 'A') {
    const songListIndex = Number(e.target.dataset.index);
    variables.player.loadPlaylist(variables.songsListId, songListIndex, 0);
    variables.isSearch = false;
  }
})
// 點擊搜尋播放
dom.searchResults.addEventListener("click", (e) => {
  if (e.target.nodeName === 'A') {
    const songListIndex = Number(e.target.dataset.index);
    variables.player.loadPlaylist(variables.searchResultId, songListIndex, 0);
    showSongInfo(variables.searchResult);
    showSongImg(variables.searchResult);
    addOrRemoveMusicPlaying(variables.searchResultLi);
    variables.isSearch = true;
  }
})

function addEventListeners() {
  watchPlaylistForDragAndDrop();
  // console.log('123')
}
addEventListeners();


