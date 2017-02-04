/**
 * skills.ts
 * Created by dcorns on 1/18/16
 * Copyright © 2016 Dale Corns
 * Script for skills view, so expects certain dom elements to exist, automatically updates buttons and links for skills when exampleData changes.
 */
'use strict';
var exampleLinks = require('../exampleLinks');
var clientRoutes = require('../clientRoutes')();
var competencies;
module.exports = function skills(){
  var btns = document.getElementById('lang-fram-btns'),
    exampleList = document.getElementById('example-list'),
    btnreturn = document.getElementById('btnreturn'),
    h = document.getElementById('skHeader');

  function goBackToSkillsMenu(){
    btns.classList.toggle('hide');
    h.classList.toggle('hide');
    btnreturn.classList.toggle('hide');
    exampleList.textContent = '';
  }

  clientRoutes.getData('skills', function(err, data){
    if(err){
      alert('No skills data found locally. Internet required to load skills data.');
      return;
    }
    addButtons('lang-fram-btns', data[0].technologies);
    competencies = data;
  });

  btnreturn.addEventListener('click', goBackToSkillsMenu);

  btns.addEventListener('click', function(e){
    btnreturn.classList.toggle('hide');
    var skill = e.target.textContent;
    btns.classList.toggle('hide');
    h.classList.toggle('hide');
    if(e.target.id === 'lang-fram-btns') skill = '';


    exampleLinks(skill, competencies, exampleList, btnreturn, goBackToSkillsMenu);
  });
};

function addButtons(el, ary){
  var btnsHere = document.getElementById(el);
  btnsHere.textContent = '';
  for (var name of ary){
    var btn = document.createElement('button');
    btn.textContent = name;
    btnsHere.appendChild(btn);
  }
}