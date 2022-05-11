import variables from './dom';

let chooseList = '';
export function dragSongStart(e) {
  chooseList = this;
  e.dataTransfer.effectAllowed = 'move'; //允許移動到新位置
  e.dataTransfer.setData('text/html', this.innerHTML);
}
export function dragSongOver(e) {
  e.preventDefault(); // 要加不然沒辦法拖
  e.dataTransfer.dropEffect = 'move' //移動時的滑鼠游標為move
}
export function dragEnter() {
  this.classList.add('dragOver')
}
export function dragLeave() {
  this.classList.remove('dragOver')
}
export function dragEnd(e) {
  e.stopPropagation();
}
export function dropList(e) {
  e.stopPropagation();
  e.preventDefault();
  if(this !== chooseList) {
    chooseList.innerHTML = this.innerHTML;
    this.innerHTML = e.dataTransfer.getData('text/html');
  }
  this.classList.remove('dragOver')
}

// 監聽playList的變動，並執行drag and drop
export function watchPlaylistForDragAndDrop() {
  let newSongsListId = [];
  let newSongsListName = [];
  variables.songListLi.forEach((i) => {
    i.addEventListener('dragstart', dragSongStart);
    i.addEventListener('dragover', dragSongOver);
    i.addEventListener('dragenter', dragEnter);
    i.addEventListener('dragleave', dragLeave);
    i.addEventListener('drop', dropList);
    i.addEventListener('dragend', (e)=>{
      dragEnd(e);
      // 每次drop完後重製，不然會越拖越多。
      newSongsListName = [];
      // 原生的drag and drop 屬性不會一起改變所以寫在dataset的videoId也就不會變。
      variables.songListLi.forEach((item) => {
        newSongsListName.push(item.textContent);
      });
      variables.songsList.forEach((item) => {
        const index = newSongsListName.indexOf(item.textContent);
        // 因為歌單的來源有兩種search與playlist，兩包的資料不太一樣。
        if (item.snippet.resourceId.videoId !== undefined) {
          newSongsListId.splice(index ,0 ,item.snippet.resourceId.videoId)
        } else {
          newSongsListId.splice(index ,0 ,item.id.videoId)
        }
      })
      variables.songsListId = newSongsListId;
      console.log('new',variables.songsListId)
      // 按照新歌單重新整理歌單
      let newSongList = [];
      variables.songsList.forEach((i, index) => {
        // 因為歌單的來源有兩種search與playlist，兩包的資料不太一樣。
        if (i.snippet.resourceId.videoId !== undefined) {
          const songIndex = newSongsListId.indexOf(i.snippet.resourceId.videoId);
          newSongList.splice(songIndex, 0, variables.songsList[index])
          if (newSongList.length === variables.songsList.length) {
            variables.songsList = newSongList;
            console.log('drop', newSongList)
            showSongList();
          }
        } else {
          const songIndex = newSongsListId.indexOf(i.id.videoId);
          newSongList.splice(songIndex, 0, variables.songsList[index]);
          if (newSongList.length === variables.songsList.length) {
            variables.songsList = newSongList;
            showSearchSongList()
          }
        }
      });
      showSongImg();
      const currentSongIndex = newSongsListId.indexOf(variables.currentPlaySongId);
      variables.player.loadPlaylist(newSongsListId, currentSongIndex, variables.currentTime);
      setTimeout(() => {
        variables.player.pauseVideo();
      }, 500)
    });
  });
}