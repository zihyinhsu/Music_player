import variables,* as dom from './dom';
import { watchPlaylistForDragAndDrop } from  './dargAndDrop';
import { showSongImg, showSongInfo } from './songsInfo';

// 在播放狀態自動對照id與presentSongIndex
export function songIdMatchIndex() {
  variables.songsList.forEach((i, index) => {
    if (i.snippet.resourceId?.videoId === variables.player.getVideoData().video_id) {
      variables.presentSongIndex = index
    } else if (i.id.videoId === variables.player.getVideoData().video_id) {
      variables.presentSongIndex = index
    };
  });
};

// 顯示歌單
export function showSongList() {
  let result = '';
  variables.songsList.forEach((i, index) => {
    const dataProperty = `data-index=${index} data-vid=${i.snippet.resourceId?.videoId || i.id.videoId}`;
    result += `<li draggable="true">
    <a class="songList d-flex justify-content-md-between align-items-center"
    ${dataProperty} href="#">
      <div class="d-flex align-items-center w-65 pointEvents">
        <div class="px-2 px-md-3 pointEvents">${index + 1}</div> 
        <img class="albumImg p-2" src="${i.snippet.thumbnails.high.url}">
        <div class="title p-2 text-truncate pointEvents">${i.snippet.title}</div>
      </div>
      <div class="mx-2 ms-md-0 text-truncate w-25 w-md-auto pointEvents">
      ${i.snippet?.videoOwnerChannelTitle || i.snippet.channelTitle}
      </div>
      <span class="deleteSong me-md-5">
        <i class="fa-solid fa-trash-can" data-index=${index}></i>
      </span> 
    </a>
    </li>`;
  });
  dom.playlists.innerHTML = result;
  variables.songListLi = document.querySelectorAll('.songList');
  variables.deleteSong = document.querySelectorAll('.deleteSong');
  variables.songListLi.forEach((i) => {
    i.setAttribute('data-disabled', true);
    i.setAttribute('style', 'cursor: not-allowed;');
    setTimeout(() => {
      i.setAttribute('data-disabled', false);
      i.removeAttribute('style', 'cursor: not-allowed;');
    },300);
  });
  variables.songListLength = variables.songListLi.length;
  watchPlaylistForDragAndDrop();
  deleteSong();
  storageSongs();
};

// 刪除歌單
function deleteSong(){
  variables.deleteSong.forEach( i => {
    i.addEventListener('click',(e)=>{
      variables.songsList.splice(e.target.dataset.index,1);
      variables.songsListId.splice(e.target.dataset.index,1);
      showSongList();
      storageSongs();
      variables.player.loadPlaylist(variables.songsListId, variables.presentSongIndex,0);
    });
  });
};

// 儲存歌單
function storageSongs(){
  localStorage.setItem('songs', JSON.stringify(variables.songsList));
  localStorage.setItem('songsId', JSON.stringify(variables.songsListId));
};

// 顯示搜尋歌單
export function showSearchSongList() {
  if(dom.inputInfo.value !== ''){
    let result = "";
    variables.searchResultId = [];
    variables.searchResult.forEach((i,index) => {
      if(i.id.videoId === undefined){
        variables.searchResult.splice(index,1);
      };
    });
    variables.searchResult.forEach((i,index)=>{
      i.snippet.title = i.snippet.title.split("&#39;").join("'");
      i.snippet.title = i.snippet.title.split('&quot;').join('"');
      result += `<li draggable="true" class="col-md-4 mb-3">
      <a class="searchResultItem d-flex justify-content-md-between align-items-center" href="#" data-index=${index} data-vid=${i.id.videoId}>
        <div class="d-flex align-items-center w-100 p-4 pointEvents">
          <img class="me-4" src="${i.snippet.thumbnails.high.url}" style="height: 60px;width: 60px;">
          <div class="text-truncate w-100 me-2">
            <div class="text-truncate">${i.snippet.title}</div>
            <div class="text-truncate">${i.snippet.channelTitle}</div>
          </div>
          <i class="fa-solid fa-circle-plus"></i>
        </div>
      </a>
      </li>`
      variables.searchResultId.push(i.id.videoId)
    })
    dom.searchResults.innerHTML = `<div class="container"><h4 class="text-white my-4">熱門搜尋結果</h4>
    <div class="row d-flex align-items-center">${result}</div></div>`;
    dom.searchResults.classList.remove('d-none');
    variables.player.loadPlaylist(variables.searchResultId, 2, 0);
    setTimeout(() => {
      variables.player.pauseVideo();
    }, 500);
  };
};

// 增加播放中focus效果，不是播放中則移除。
export function addOrRemoveMusicPlaying(dataList = variables.songListLi) {
  dataList.forEach((i,index) => {
    if (Number(i.dataset.index) === variables.presentSongIndex) {
      dataList[index].classList.add('musicPlaying');
    } else {
      dataList[index].classList.remove('musicPlaying');
    };
  });
};

// 歌單重新排序
export function songListSort(){
  let shuffle = [];
  variables.songsList.forEach((i, index) => {
  if (i.snippet.resourceId.videoId !== undefined) {
    const songIndex = variables.songsListId.indexOf(i.snippet.resourceId.videoId);
    shuffle.splice(songIndex, 0, variables.songsList[index]);
  } else {
    const songIndex = variables.songsListId.indexOf(i.id.videoId);
    shuffle.splice(songIndex, 0, variables.songsList[index]);
  };
});
variables.songsList = shuffle ;
showSongList();
showSongImg();
showSongInfo();
addOrRemoveMusicPlaying();
};

// 調換歌單順序之後重新 load
export function loadPlaylist(e, fromList){
  let newSongsListId = [];
  let newSongQueue = [];
  let newSongsList = [];
  const titles = document.querySelectorAll('.title')
  titles.forEach((item) => {
    newSongQueue.push(item.innerText);
  });
  
  let indexQueue = [];
  variables.songsList.forEach((item) => {
    item.snippet.title = item.snippet.title.split("&#39;").join("'");
    item.snippet.title = item.snippet.title.split('&quot;').join('"');
    const index = newSongQueue.indexOf(item.snippet.title);
    indexQueue.push(index)
  });
  indexQueue.forEach((item)=>{
    if(variables.songsList[item].id?.videoId !== undefined){
      newSongsListId.push(variables.songsList[item].id.videoId);
    }else {
      newSongsListId.push(variables.songsList[item].snippet.resourceId.videoId);
    }
    newSongsList.push(variables.songsList[item]);
  })
  variables.songsList = newSongsList;
  variables.songsListId = newSongsListId;
  showSongList();
  showSongImg();
  if (fromList) {
    const songListIndex = Number(e.target.dataset.index);
    variables.player.loadPlaylist(newSongsListId, songListIndex, 0);
    setTimeout(()=>{
      variables.player.pauseVideo();
    }, 300);
    setTimeout(() => {
      variables.player.loadPlaylist(newSongsListId, songListIndex, 0);
    }, 800);
  } else {
    variables.player.loadPlaylist(newSongsListId, variables.currentPlaySongId, variables.currentTime);
    setTimeout(()=>{
    }, 300);
  }
  variables.isSearch = false;
  dom.searchResults.classList.add('d-none');
}