import variables,* as dom from './dom';

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
  
  // 顯示搜尋歌單
  export function showSearchSongList() {
    let result = "";
    variables.songsListId = [];
    variables.songsList.forEach((i, index) => {
      result += `<li><a class="songList dropdown-item d-inline-block text-truncate" data-index=${index} data-vid=${i.id.videoId} href="#">${i.snippet.title}</a></li>`
      variables.songsListId.push(i.id.videoId)
    });
    dom.playlists.innerHTML = result;
    variables.songListLi = document.querySelectorAll(".songList");
    variables.songListLength = variables.songListLi.length;
    // 這邊先loadPlaylist並且馬上暫停，是因為這個api有bug，在搜尋完之後的loadPlaylist，只會播一首的list
    variables.player.loadPlaylist(variables.songsListId, 0, 0);
    setTimeout(() => {
      variables.player.pauseVideo();
    }, 500);
  }
  
  // 顯示歌單
  export function showSongList() {
    let result = "";
    variables.songsList.forEach((i, index) => {
      result += `<li draggable="true" ><a class="songList dropdown-item d-inline-block text-truncate" 
      data-index=${index} data-vid=${i.snippet.resourceId.videoId} href="#">${i.snippet.title}</a></li>`;
    });
    dom.playlists.innerHTML = result;
    variables.songListLi = document.querySelectorAll(".songList");
    variables.songListLength = variables.songListLi.length;
  }

  // 增加播放中focus效果，不是播放中則移除。
export function addOrRemoveMusicPlaying() {
    variables.songListLi.forEach((i,index) => {
      if (Number(i.dataset.index) === variables.presentSongIndex) {
        variables.songListLi[index].classList.add('musicPlaying');
      } else {
        variables.songListLi[index].classList.remove('musicPlaying');
      }
    })
  }

// 歌單重新排序
export function songListSort(){
    let shuffle = []
    variables.songsList.forEach((i, index) => {
        // 因為歌單的來源有兩種search與playlist，兩包的資料不太一樣。
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
