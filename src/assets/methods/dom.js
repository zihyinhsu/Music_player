const tag = document.createElement("script");
const cdPlayerImg = document.querySelector(".cdPlayer img");
const firstScriptTag = document.getElementsByTagName("script")[0];
const play = document.querySelector(".play");
const pause = document.querySelector(".pause");
const forward = document.querySelector(".forward");
const backward = document.querySelector(".backward");
const repeat = document.querySelector(".repeat");
const previous = document.querySelector(".previous");
const next = document.querySelector(".next");
const random = document.querySelector(".random");
const volume = document.querySelector(".volume");
const volumeBtn = document.querySelector(".volumeBtn");
const inputInfo = document.querySelector(".inputInfo");
const playlists = document.querySelector(".playlists");
const repeatPlayList = document.querySelector(".repeatPlayList");
const length = document.querySelector(".length");
const currentTimeBar = document.querySelector('.currentTimeBar')
const playListBtn = document.querySelector('.playListBtn');
const albumImg = document.querySelector('.albumImg');
const loading = document.querySelector('.loading');
const songTitle = document.querySelector('.songTitle');
const author = document.querySelector('.author');
const searchResults = document.querySelector('.searchResult');
const songRepeatController = document.querySelector('.songRepeatController');
const functionBar = document.querySelector('.functionBar');
export {
    tag,
    firstScriptTag,
    cdPlayerImg,
    play,
    pause,
    forward,
    backward,
    repeat,
    previous,
    next,
    random,
    volume,
    volumeBtn,
    inputInfo,
    playlists,
    repeatPlayList,
    length,
    currentTimeBar,
    playListBtn,
    albumImg,
    loading,
    songTitle,
    author,
    searchResults,
    songRepeatController,
    functionBar
};

// variables
let player= null;
let playId = 'PL5NDQ4Fnj_BzeO1zSQ4WW62uTik5XZyzQ' ;
let songsList = [];
let songsListId = [];
let searchResult = [];
let searchResultId = [];
let searchResultLi = [];
let songListLi = [];
let songTitleArr = [];
let songAuthorArr = [];
let currentPlaySongId = null;
let repeatList = true;
let signSongRepeat = true;
let isRadomSong = false;
let currentTime = 0;
let durationTime = 0;
let songListLength = 0;
let presentSongIndex = 0;
let isSearch = false;
let songControlCounter = 0;
let playListLoopPlay = false;

export default{
    player,
    playId,
    songsList,
    searchResult,
    songsListId,
    searchResultId,
    searchResultLi,
    songListLi,
    songTitleArr,
    songAuthorArr,
    currentPlaySongId,
    repeatList,
    signSongRepeat,
    isRadomSong,
    currentTime,
    durationTime,
    songListLength,
    presentSongIndex,
    isSearch,
    songControlCounter,
    playListLoopPlay
}