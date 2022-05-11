import variables,* as dom from './dom';
import axios from "axios";
import {showSongImg,showSongInfo} from './songsInfo';
import {showSongList,showSearchSongList,songIdMatchIndex,addOrRemoveMusicPlaying} from './songList';
import {getSongCurrentTime,getSongDurationTime,getBar} from './progressBar';
import {watchPlaylistForDragAndDrop} from './dargAndDrop';

export function setPlayer(){
    window.YT.ready(function onYouTubeIframeAPIReady(id) {
        variables.player = new YT.Player("player", {
          videoId: id,
          width: 0,   
          height: 0,
          playerVars: {
            controls: 0, // 顯示播放器
            loop: 1,     // 重覆播放
            autohide: 0, // 影片播放時，隱藏影片控制列
          },
          events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange
          }
        });
    });
  }
  
  // 一載入就會觸發的函式
  export  function onPlayerReady(e) {
    e.target.setVolume(100);
    e.target.playVideo();
    // 當使用影片要重覆播放時，需再輸入YouTube 影片ID
    e.target.cuePlaylist({
        listType: 'playlist',
        list: variables.playId,
    });
    setTimeout(()=>{
      dom.loading.classList.add('d-none');
    },500);
  }
  
  // 播放時會觸發的函式
  export function onPlayerStateChange(e) {
    // 第一次加載音樂
    if (e.data == -1) {
      variables.currentPlaySongId = variables.player.getVideoData().video_id;
      variables.presentSongIndex = variables.player.getPlaylistIndex();
      getSongDurationTime();
      getSongCurrentTime();
      }
    if(e.data == YT.PlayerState.CUED){
      variables.songsListId = variables.player.getPlaylist();
      getBar();
    } else if (e.data == YT.PlayerState.PLAYING) {
      songIdMatchIndex();
      addOrRemoveMusicPlaying();
      dom.cd.classList.add("cd");
      variables.player.setSize(0, 0);
      // play & pause 按鈕切換
      dom.play.classList.add('d-none');
      dom.pause.classList.remove('d-none');
      showSongImg();
      showSongInfo();
    } else if (e.data === YT.PlayerState.PAUSED || e.data === YT.PlayerState.ENDED) {
      dom.cd.classList.remove("cd");
    }
    // 單曲循環
    if (e.data === YT.PlayerState.ENDED){
      if (variables.signSongRepeat) {
        variables.player.seekTo(0);
      }
    } 
  }
  
  // 取得歌曲資料 - 自訂歌單
  export  function getSongData() {
    axios.get('https://www.googleapis.com/youtube/v3/playlistItems',
      {
      params: {
      part: 'snippet,contentDetails',// 必填，把需要的資訊列出來
      playlistId: variables.playId,// 播放清單的id
      maxResults: 20,// 預設為五筆資料，可以設定1~50
      key: process.env.KEY
      }
      })
      .then(res => {
        variables.songsList = res.data.items; 
        showSongList();
        showSongImg();
        showSongInfo();
        init();
      }).catch(err => console.log(err))
  }
  
  // 初次自動載入
  export  function init(){
    dom.pause.classList.add('d-none');
    dom.volume.classList.add('d-none');
    const id = variables.songListLi[0].dataset.vid;
    setPlayer(id);
    // 歌單drag and drop
    watchPlaylistForDragAndDrop();
  }
  
  // 搜尋功能
  export function searchSong() {
    axios.get("https://www.googleapis.com/youtube/v3/search", {
        params: {
          part: "snippet", // 必填，把需要的資訊列出來
          maxResults: 10, // 預設為五筆資料，可以設定1~50
          q: `${dom.inputInfo.value}`,
          key: process.env.KEY
        }
      })
      .then((res) => {
        variables.songsList = res.data.items;
        showSearchSongList();
        showSongInfo();
        showSongImg();
        })
        .catch((err) => {
          console.log(err);
        });
  }