const tag = document.createElement("script");
const cd = document.querySelector(".cdPlayer img");
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
// const search = document.querySelector(".search");
const playlists = document.querySelector(".playlists");
const repeatPlayList = document.querySelector(".repeatPlayList");
const length = document.querySelector(".length");
const currentTimeBar = document.querySelector('.currentTimeBar')
const songImg = document.querySelector('.songImg');
const albumImg = document.querySelector('.albumImg');
const loading = document.querySelector('.loading');
const songTitle = document.querySelector('.songTitle');
const author = document.querySelector('.author');
export {
    tag,
    firstScriptTag,
    cd, 
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
    // search,
    playlists,
    repeatPlayList,
    length,
    currentTimeBar,
    songImg,
    albumImg,
    loading,
    songTitle,
    author
};

// variables
let player= null;
let playId = 'PL5NDQ4Fnj_BzeO1zSQ4WW62uTik5XZyzQ' ;
let songsList = [];
let songsListId = [];
let songListLi = [];
let songTitleArr = [];
let songAuthorArr = [];
let currentPlaySongId = null;
let repeatList = false;
let signSongRepeat = false;
let isRadomSong = false;
let currentTime = 0;
let durationTime = 0;
let songListLength = 0;
let presentSongIndex = 0;

export default{
    player,
    playId,
    songsList,
    songsListId,
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
    presentSongIndex
}