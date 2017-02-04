/**
 * index.ts
 * Created by dcorns on 12/31/15
 * Copyright © 2015 Dale Corns
 */
'use strict';
//Main JS File
let mySkills = {};
mySkills.sharedObjects = require('./sharedObjects');
let slideShow = require('./slideShow');
var slides = require('./models/slides');
var doAjax = require('do-ajax');
mySkills.ajax = doAjax;
var pages = require('./views');
mySkills.help = require('./helperMethods');
var pageScripts = require('./pageScripts');
var route = require('./viewRouter')(pages, pageScripts, mySkills);//(view, controller, app)
mySkills.route = route;
mySkills.clientRoutes = require('./clientRoutes');
window.mySkills = mySkills;
slideShow.loadImages(slides);
slideShow.swap();
slideShow.play(10000);
//load shared and dom objects
mySkills.sharedObjects.init();
checkForToken();

var header = document.getElementById('top');
//default view
//route('#/current');

header.addEventListener('mouseover', function(){
  slideShow.play(3000);
});

function firstDo(){
  //Handle Refresh by checking session storage for last href and redirecting if it exists
  var lastHref = window.sessionStorage.getItem('href');
  var netAction = window.sessionStorage.getItem('netAction');
  if (lastHref) {
    route(lastHref);
  }
  else {//load home template
    lastHref = '#/current';
    window.sessionStorage.setItem('href', lastHref);
    window.history.pushState(null, null, lastHref);
    route(lastHref);
  }
  //Add event handlers for 'a' tags
  var links = document.getElementsByTagName('a');
  var idx = 0, ln = links.length;
  for (idx; idx < ln; idx++) {
    links[idx].addEventListener('click', function (e) {
      //if the link is local routing link, save location for when returning to the site...filters out external links based on the presence of #/
      if(this.href.indexOf('#/') > -1){
        window.sessionStorage.setItem('href', this.href);
      }
      window.history.pushState(null, null, this.href);
      e.preventDefault();
      route(this.href);
    });
  }
  //Add front and back button handler
  window.addEventListener('popstate', function () {
    window.sessionStorage.setItem('href', location.href);
    route(location.href);
  });
}

//mobile logic
var btnMobileMenu = document.getElementById('btnMobileMenu');
var mobileMenu = document.getElementById('mobile-menu-items');
btnMobileMenu.addEventListener('click', function(){
  mySkills.help.toggleClass([mobileMenu], 'hide');
});
mobileMenu.addEventListener('click', function(e){
  mySkills.help.toggleClass([mobileMenu], 'hide');
});

function winready(f){
  var preOnload = window.onload;
  if(typeof preOnload !== 'function'){
    window.onload = f;
  }
  else{
    window.onload = function() {
      preOnload();
      f();
    }
  }
}

function checkForToken(){
  const DRCToken = localStorage.getItem('DRCToken');
  if(DRCToken){
    doAjax.ajaxPostJson('/tokenAccess',{DRCToken: DRCToken}, function(err, data){
      if(err){
        console.log('error');
        console.error(err);
      } 
      else{ 
        console.log(data);
        console.log('token Exist use token for access');
        mySkills.help.toggleClass(mySkills.sharedObjects.toggleElements, 'hide');
      }
    });
  }
}

winready(firstDo());