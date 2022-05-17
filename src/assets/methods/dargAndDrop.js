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
  variables.songListLi.forEach((i) => {
    i.addEventListener('dragstart', dragSongStart);
    i.addEventListener('dragover', dragSongOver);
    i.addEventListener('dragenter', dragEnter);
    i.addEventListener('dragleave', dragLeave);
    i.addEventListener('drop', dropList);
    i.addEventListener('dragend', dragEnd);
  });
}