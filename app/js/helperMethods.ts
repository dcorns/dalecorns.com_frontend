/**
 * helperMethods.ts
 * Created by dcorns on 3/18/16
 * Copyright © 2016 Dale Corns
 */
'use strict';
module.exports = (function(){
  return{
    //Take an array of elements and toggles the given class
    toggleClass: function toggleClass(elArray, tClass){
      if(!(Array.isArray(elArray))) return null;
      if((typeof tClass !== 'string')) return null;
      let i = 0, len = elArray.length;
      for(i; i < len; i++) {
        try {
          elArray[i].classList.toggle(tClass);
        }
        catch (e) {
          throw e;
        }
      }
    }
  };
})();