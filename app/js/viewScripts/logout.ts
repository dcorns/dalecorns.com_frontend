/**
 * logout.ts
 * Created by dcorns on 3/18/16
 * Copyright © 2016 Dale Corns
 */
'use strict';
module.exports = function logout(app){
  //window.localStorage.removeItem('DRCToken');
  window.localStorage.clear();
  if(window.localStorage.getItem('DRCToken')){
    alert('Token failed deletion, delete DRCToken manually from localStorage to logout!');
  }
  else{
    app.help.toggleClass(app.sharedObjects.toggleElements, 'hide');
  }
};