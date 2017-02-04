/**
 * slideShow.ts
 * Created by dcorns on 12/31/15
 * Copyright © 2015 Dale Corns
 * Given an array of image sources, display a slide show
 */
'use strict';
module.exports = function(){
  var imgs = [], count = 0;
  var showInterval, playing = false;
  var slideShow = document.getElementById('slide-show');
  return{
    loadImages: function loadImages(imgArray){
      var len = imgArray.length, item = 0;
      for (item; item < len; item++){
        imgs[item] = new Image();
        imgs[item].src = imgArray[item];
      }
    },
    play: function play(tm){
      if(!(playing)){
        playing = true;
        var slideTime = tm || 1000;
        showInterval = setInterval(function(){
          if(count > imgs.length -1) count = 0;
          slideShow.innerHTML = '';
          slideShow.appendChild(imgs[count]);
          count++;
        }, slideTime);
      }
    },
    stop: function stop(imgNum){
      if(playing){
        if(count > imgs.length - 1) count = 0;
        count = imgNum || count;
        clearInterval(showInterval);
        slideShow.innerHTML = '';
        slideShow.appendChild(imgs[count]);
        playing = false;
      }
    },
    swap: function swap(imgNum){
      if(!(playing)){
        slideShow.innerHTML = '';
        var imgIdx;
        if (imgNum) imgIdx = imgNum;
        else {
          if(count > imgs.length - 1) count = 0;
          imgIdx = count;
          count++;
        }
        slideShow.appendChild(imgs[imgIdx]);
      }
    }
  }
}();