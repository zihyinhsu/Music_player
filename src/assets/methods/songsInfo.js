import variables,* as dom from './dom';

// 背景插入歌曲圖片
export function showSongImg(dataList = variables.songsList){
    let songImgData = [];
    let songImgArr = [];
    let standardQualityImg = []
    let highQualityImg = []
    let undefinedIndex = [];
    dataList.forEach((item) => {
      if (item.snippet.thumbnails.maxres !== undefined) {
        songImgData.push(item.snippet.thumbnails.maxres);
        standardQualityImg.push(item.snippet.thumbnails.standard);
        highQualityImg.push(item.snippet.thumbnails.high);
        songImgData.forEach((item,i)=>{
          if(item === undefined){
            undefinedIndex.push(i);
            undefinedIndex = [...new Set(undefinedIndex)];
         }
       })
       undefinedIndex.forEach(index=>{ 
        // 刪除undefined，插入較低畫質的圖片網址
        songImgData.splice(index,1);
        songImgData.splice(index,0,standardQualityImg[index]);
        if(standardQualityImg[index] === undefined){
          songImgData.splice(index,0,highQualityImg[index])
        }
      })
      } else if (item.snippet.thumbnails.high) {
        songImgData.push(item.snippet.thumbnails.high);
      } else if (item.snippet.thumbnails.medium) {
        songImgData.push(item.snippet.thumbnails.medium);
      } else if (item.snippet.thumbnails.default) {
        songImgData.push(item.snippet.thumbnails.default);
      } else {
        songImgData.push(undefined)
      }
    }); 
    songImgData.forEach( item =>{ songImgArr.push(item.url) });
    dom.albumImg.src = `${songImgArr[variables.presentSongIndex]}`;
  }
  
  // 歌曲名稱、上傳者替換
  export function showSongInfo(dataList = variables.songsList){
    variables.songTitleArr = [];
    variables.songAuthorArr = [];
    dataList.forEach((item)=>{
      variables.songTitleArr.push(item.snippet.title);
      if(item.snippet.videoOwnerChannelTitle){
        variables.songAuthorArr.push(item.snippet.videoOwnerChannelTitle)
      }else{
        variables.songAuthorArr.push(item.snippet.channelTitle)
      }
    })
    dom.songTitle.textContent = variables.songTitleArr[variables.presentSongIndex];
    dom.author.textContent = variables.songAuthorArr[variables.presentSongIndex];
  }