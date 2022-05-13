import "./assets/style/all.scss";
import "bootstrap/js/dist/dropdown";
import throttle from 'lodash/throttle'
import variables,* as dom from './assets/methods/dom';
import {mouseControl} from './assets/methods/progressBar';
import {showSongImg,showSongInfo} from './assets/methods/songsInfo';
import {songListSort, showSongList ,addOrRemoveMusicPlaying} from './assets/methods/songList';
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
//

// 歌曲播放循環控制
dom.songRepeatController.addEventListener('click', () => {
  variables.songControlCounter ++;
  const controlNum = variables.songControlCounter % 3 ;
  let dataList = null;
  if(variables.isSearch === true){
    dataList = variables.searchResult;
  }else{
    dataList = variables.songsListId
  }
  switch (controlNum){
    // 取消全歌循環
    case 0 :
      dom.repeatPlayList.classList.remove('d-none');
      dom.repeatPlayList.classList.remove('text-primary');
      dom.repeat.classList.add('d-none');
      variables.playListLoopPlay = false;
      variables.player.setLoop(false);
      if(variables.isSearch === true){
        variables.player.loadPlaylist(variables.searchResult, variables.presentSongIndex, variables.currentTime);
      }else{
        variables.player.loadPlaylist(variables.songsListId, variables.presentSongIndex, variables.currentTime);
      }
      break;
    // 全歌單循環
    case 1 : 
     variables.player.setLoop(true);
     variables.playListLoopPlay = true;
     dom.repeatPlayList.classList.add('text-primary');
     if(variables.isSearch === true){
      variables.player.loadPlaylist(variables.searchResult, variables.presentSongIndex, variables.currentTime);
     }else{
      variables.player.loadPlaylist(variables.songsListId, variables.presentSongIndex, variables.currentTime);
     }
      break;  
    // 單首循環
    case 2 :
      dom.repeatPlayList.classList.add('d-none');
      variables.playListLoopPlay = null;
      dom.repeat.classList.remove('d-none');
      variables.player.loadPlaylist([variables.currentPlaySongId], variables.presentSongIndex);
      break;
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
dom.inputInfo.addEventListener('input',throttle(function () {       
  if(dom.inputInfo.value === ''){
    dom.searchResults.classList.add('d-none');
  }else {
    searchSong();
    variables.isSearch = true;
  }
}, 2000))


// 點擊歌單播放
dom.playlists.addEventListener("click", (e) => {
  let newSongsListName = [];
  let newSongsListId = [];
  if (e.target.nodeName === 'A' && e.target.dataset.disabled === 'false') {
    variables.songListLi.forEach((item) => {
      newSongsListName.push(item.textContent);
    });
    variables.songsList.forEach((item) => {
      const index = newSongsListName.indexOf(item.snippet.title);
      if (item.snippet.resourceId?.videoId) {
        newSongsListId.splice(index ,0 ,item.snippet.resourceId.videoId)
      }
    })
    variables.songsListId = newSongsListId;
    // 按照新歌單重新整理歌單
    let newSongList = [];
    variables.songsList.forEach((i, index) => {
      if (i.snippet.resourceId?.videoId) {
        const songIndex = newSongsListId.indexOf(i.snippet.resourceId.videoId);
        newSongList.splice(songIndex, 0, variables.songsList[index])
        if (newSongList.length === variables.songsList.length) {
          variables.songsList = newSongList;
          showSongList();
        }
      }
    });
    showSongImg();
    const songListIndex = Number(e.target.dataset.index);
    setTimeout(() => {
      variables.player.loadPlaylist(newSongsListId, songListIndex, 0);
    },1200)
    variables.isSearch = false;
  } else {return}
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

dom.functionBar.addEventListener('click',()=>{
  dom.searchResults.classList.add('d-none');
})