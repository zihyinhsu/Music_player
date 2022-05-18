import variables,* as dom from './dom';
var _ = require('lodash');
import { watchPlaylistForDragAndDrop } from  './dargAndDrop';

// 在播放狀態自動對照id與presentSongIndex
export function songIdMatchIndex() {
  variables.songsList.forEach((i, index) => {
      if (i.snippet.resourceId?.videoId === variables.player.getVideoData().video_id) {
        variables.presentSongIndex = index
      } else if (i.id.videoId === variables.player.getVideoData().video_id) {
        variables.presentSongIndex = index
      }
    })
}

// 顯示歌單
export function showSongList() {
  let result = '';
  variables.songsList.forEach((i, index) => {
    const dataProperty = `data-index=${index} data-vid=${i.snippet.resourceId?.videoId || i.id.videoId}`;
    result += `<li draggable="true">
    <a class="songList d-flex justify-content-md-between align-items-center" 
    ${dataProperty} href="#">
      <div class="d-flex align-items-center w-70 w-md-60 pointEvents">
        <div class="px-3 pointEvents">${index + 1}</div> 
        <img class="albumImg p-2" src="${i.snippet.thumbnails.high.url}">
        <div class="title p-2 text-truncate pointEvents">${i.snippet.title}</div>
      </div>
      <div class="ms-3 ms-md-0 me-md-5 text-truncate pointEvents">
      ${i.snippet?.videoOwnerChannelTitle || i.snippet.channelTitle}
      </div>
    </a>
    </li>`;
  });
  dom.playlists.innerHTML = result;
  variables.songListLi = document.querySelectorAll(".songList");
  variables.songListLi.forEach((i) => {
    i.setAttribute('data-disabled', true);
    i.setAttribute('style', 'cursor: not-allowed;');
    setTimeout(() => {
      i.setAttribute('data-disabled', false);
      i.removeAttribute('style', 'cursor: not-allowed;');
    },300);
  })
  variables.songListLength = variables.songListLi.length;
  watchPlaylistForDragAndDrop()
}

// 顯示搜尋歌單
export function showSearchSongList() {
  if(dom.inputInfo.value !== ''){
    let result = "";
    variables.searchResultId = [];
    variables.searchResult.forEach((i,index) => {
      if(i.id.videoId === undefined){
        variables.searchResult.splice(index,1)
      }
    });
    variables.searchResult.forEach((i,index)=>{
      result += `<li draggable="true" class="col-md-4 mb-3">
      <a class="searchResultItem d-flex justify-content-md-between align-items-center" href="#" data-index=${index} data-vid=${i.id.videoId}>
        <div class="d-flex align-items-center w-100 w-md-75 p-4 pointEvents">
          <img class="me-4" src="${i.snippet.thumbnails.high.url}" style="height: 60px;width: 60px;">
          <div class="w-80 w-md-100">
            <div class="text-truncate">${i.snippet.title}</div>
            <div class="text-truncate">${i.snippet.channelTitle}</div>
          </div>
        </div>
      </a>
      </li>`
      variables.searchResultId.push(i.id.videoId)
    })
    dom.searchResults.innerHTML = `<div class="container"><h4 class="text-white mx-3 my-4">熱門搜尋結果</h4>
    <div class="row d-flex align-items-center">${result}</div></div>`;
    dom.searchResults.classList.remove('d-none');
    variables.player.loadPlaylist(variables.searchResultId, 2, 0);
    setTimeout(() => {
      variables.player.pauseVideo();
    }, 500);
  }
}

// 增加播放中focus效果，不是播放中則移除。
export function addOrRemoveMusicPlaying(dataList = variables.songListLi) {
dataList.forEach((i,index) => {
  if (Number(i.dataset.index) === variables.presentSongIndex) {
    dataList[index].classList.add('musicPlaying');
  } else {
    dataList[index].classList.remove('musicPlaying');
  }
})
}

// 歌單重新排序
export function songListSort(){
  let shuffle = []
  variables.songsList.forEach((i, index) => {
  if (i.snippet.resourceId.videoId !== undefined) {
    const songIndex = variables.songsListId.indexOf(i.snippet.resourceId.videoId);
    shuffle.splice(songIndex, 0, variables.songsList[index])
  } else {
    const songIndex = variables.songsListId.indexOf(i.id.videoId);
    shuffle.splice(songIndex, 0, variables.songsList[index])
  }  
});
variables.songsList = shuffle ;
showSongList();
showSongImg();
showSongInfo();
addOrRemoveMusicPlaying();
};