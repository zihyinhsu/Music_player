import "./assets/style/all.scss";
import variables, * as dom from './assets/methods/dom';
import { mouseControl } from './assets/methods/progressBar';
import { showSongImg, showSongInfo } from './assets/methods/songsInfo';
import { songListSort, showSongList, loadPlaylist } from './assets/methods/songList';
import { getSongData, searchSong, loadSongData} from './assets/methods/getData';



dom.tag.src = "https://www.youtube.com/iframe_api";
dom.firstScriptTag.parentNode.insertBefore(dom.tag, dom.firstScriptTag);

// 如果localStorage裡面沒有東西，就有預設歌單
if(dom.storageSongsData.length === 0){
  getSongData();
} else {
  loadSongData(dom.storageSongsData);
};

// 開始播放
dom.play.addEventListener('click', (e) => {
  loadPlaylist(e, false);
  variables.player.playVideo();
  dom.play.classList.add('d-none');
  dom.pause.classList.remove('d-none');
});

// 暫停歌曲
dom.pause.addEventListener('click', () => {
  variables.player.pauseVideo();
  dom.pause.classList.add('d-none');
  dom.play.classList.remove('d-none');
});

// 上一首
dom.previous.addEventListener("click", () => {
  variables.player.stopVideo();
  variables.player.previousVideo();
});

// 下一首
dom.next.addEventListener("click", () => {
  variables.player.stopVideo();
  variables.player.nextVideo();
});

// 亂數播放
dom.random.addEventListener("click", () => {
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
  if (variables.presentSongIndex === variables.songsListId.length) {
    variables.player.previousVideo();
  }
});

let controlNum ;
// 歌曲播放循環控制
dom.songRepeatController.addEventListener('click', () => {
  variables.songControlCounter++;
  controlNum = variables.songControlCounter % 3;
  switch (controlNum) {
    // 取消全歌循環
    case 0:
      dom.repeatPlayList.classList.remove('d-none');
      dom.repeatPlayList.classList.remove('text-primary');
      dom.repeat.classList.add('d-none');
      variables.playListLoopPlay = false;
      variables.player.setLoop(false);
      if (variables.isSearch === true) {
        variables.player.loadPlaylist(variables.searchResult, variables.presentSongIndex, variables.currentTime);
      } else {
        variables.player.loadPlaylist(variables.songsListId, variables.presentSongIndex, variables.currentTime);
      }
      break;
    // 全歌單循環
    case 1:
      variables.player.setLoop(true);
      variables.playListLoopPlay = true;
      dom.repeatPlayList.classList.add('text-primary');
      if (variables.isSearch === true) {
        variables.player.loadPlaylist(variables.searchResult, variables.presentSongIndex, variables.currentTime);
      } else {
        variables.player.loadPlaylist(variables.songsListId, variables.presentSongIndex, variables.currentTime);
      }
      break;
    // 單首循環
    case 2:
      dom.repeatPlayList.classList.add('d-none');
      variables.playListLoopPlay = null;
      dom.repeat.classList.remove('d-none');
      variables.player.loadPlaylist([variables.currentPlaySongId], variables.presentSongIndex);
      break;
  };
});

// 快進10秒
dom.forward.addEventListener("click", () => {
  let current = '';
  current = variables.player.getCurrentTime();
  variables.player.seekTo(current + 10);
});

// 後退10秒
dom.backward.addEventListener("click", () => {
  let current = '';
  current = variables.player.getCurrentTime();
  variables.player.seekTo(current - 10);
});

// 滑鼠控制進度條
dom.length.addEventListener("click", (e) => { mouseControl(e) })

// 調整音量
dom.volume.addEventListener("change", () => {
  variables.player.setVolume(dom.volume.value);
  dom.volume.style = `background-size:${dom.volume.value}%`;
});

// hover 顯示 音量條
dom.volumeBtn.addEventListener("mouseenter", () => { dom.volume.classList.remove('d-none'); });

// hover 隱藏 音量條
dom.volume.addEventListener("mouseout", () => { dom.volume.classList.add('d-none'); });

// 點擊歌單播放
dom.playlists.addEventListener("click", (e) => {
  e.preventDefault();
  if (e.target.nodeName === 'A' && e.target.dataset.disabled === 'false') {
    loadPlaylist(e, true);
    dom.playListBtn.click();
    // 切換歌曲之後，歌曲循環狀態歸零
    if(controlNum === 1){
      dom.songRepeatController.click();
      dom.songRepeatController.click();
    } else if (controlNum === 2){
      dom.songRepeatController.click();
    }
  };
});

// 觸發搜尋功能
dom.inputInfo.addEventListener('keydown', (e)=>{
  if (dom.inputInfo.value === '') {
    dom.searchResults.classList.add('d-none');
  } else {
    if(e.keyCode == 13){
      searchSong();
      variables.isSearch = true;
      if(variables.isOpenPlayList){
        dom.playListBtn.click();
      }
    }
  };
});

dom.search.addEventListener('click', () => {
  if (dom.inputInfo.value === '') {
    dom.searchResults.classList.add('d-none');
  } else {
    searchSong();
    variables.isSearch = true;
    if(variables.isOpenPlayList){
      dom.playListBtn.click();
    }
  }
});

// 點擊搜尋播放
dom.searchResults.addEventListener("click", (e) => {
  if (e.target.nodeName === 'A' || e.target.nodeName === 'DIV' || e.target.nodeName === 'I') {
    const songListIndex = Number(e.target.dataset.index);
    variables.presentSongIndex = songListIndex;
    if(variables.songsListId.includes(variables.searchResult[e.target.dataset.index].id.videoId)){
      return
    } else {
      variables.songsList.unshift(variables.searchResult[e.target.dataset.index]);
      variables.songsListId.unshift(variables.searchResult[e.target.dataset.index].id.videoId);
      variables.player.loadPlaylist(variables.songsListId, 0, 0);
      showSongList();
      // 歌曲成功插播至原歌單之後，就把 isSearch 關掉
      variables.isSearch = false;
      dom.searchResults.classList.add('d-none');
    };
  };
});

// 歌單滑入滑出
dom.playListBtn.addEventListener('click', () => {
  variables.isOpenPlayList = !variables.isOpenPlayList
  dom.playlists.classList.toggle('end-n100');
  dom.playlists.classList.toggle('end-0');
});

// 全螢幕功能
dom.fullScreen.addEventListener("click",()=>{
  fullScreen(document.getElementById('player'))
});

function fullScreen (element){
  if (!document.fullscreenElement &&    // alternative standard method
  !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
    if (element.requestFullscreen) {
      element.requestFullscreen();
      console.log(element)
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    }
    } 
}