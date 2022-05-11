import variables,* as dom from './dom';

// 控制播放進度條
export function mouseControl (e) {
    // length 左邊偏移的值
    const x = dom.length.offsetLeft;
    // 滑鼠的水平座標
    const mouseX = e.clientX;
    // length 的寬度
    const xWidth = dom.length.offsetWidth;
    // 進度條的 % 數
    let xResult = ((mouseX - x) / xWidth).toFixed(2);
    // 尋找指定的秒數
    variables.player.seekTo(variables.durationTime * xResult);
  }

// 計算進度條
export function getBar () {
    let result = ''
    setInterval(()=>{
      result = (variables.currentTime / variables.durationTime).toFixed(2);
      result = `${result * 100}`+'%'
      dom.currentTimeBar.style.width = result;
    },1000)
  }

// 取得目前歌曲時間
export function getSongCurrentTime () {
    let result = '';
    let hour = '';
    let min = '';
    let sec = '';
    setInterval(()=>{
      variables.currentTime = variables.player.getCurrentTime();
      hour = Math.floor(variables.currentTime / (60 * 60));
      min = Math.floor(variables.currentTime % (60 * 60) / 60)
      // 秒數取餘數
      sec = Math.floor(variables.currentTime % 60)
      result = `${hour < 10 ? '0' + hour : hour}:${min < 10 ?  '0' + min : min}:${sec < 10 ?  '0' + sec : sec}`
      document.querySelector('.currentTime').textContent = result
    },1000)
  }

// 取得歌曲時間
export function getSongDurationTime () {
    let result = '';
    let hour = '';
    let min = '';
    let sec = '';
    variables.durationTime = variables.player.getDuration()
    hour = Math.floor(variables.durationTime / (60 * 60));
    min = Math.floor(variables.durationTime % (60 * 60) / 60);
    sec = Math.floor(variables.durationTime % 60);
    result = `${hour < 10 ? '0' + hour : hour}:${min < 10 ?  '0' + min : min}:${sec < 10 ?  '0' + sec : sec}`
    document.querySelector('.lastTime').textContent = result
  }
  