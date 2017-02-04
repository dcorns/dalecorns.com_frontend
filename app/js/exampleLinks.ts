/**
 * exampleLinks.ts
 * Created by dcorns on 1/11/16
 * Copyright © 2016 Dale Corns
 * Used With Skills View and by skills.js
 */
'use strict';
var doAjax = require('do-ajax');
var clientRoutes = require('./clientRoutes')();
module.exports = function (skillName, competencies, el, btnReturn, btnReturnFunction) {

  var exampleObj,
    h = document.createElement('h3'),
    exampBtns = document.createElement('nav');
  el.textContent = '';

  addSkillNameHeading();

  clientRoutes.getData('examples', function (err, data) {
    if (err) {
      alert('No local example data found. Internet connection required.');
      return;
    }
    var exampleList = getExampleList(skillName, data, competencies[0].technologies);
    if (exampleList.length < 1) {
      h.textContent = 'There are currently no examples listed for ' + skillName;
      el.appendChild(h);
      return;
    }
    addExamples(exampleList, competencies[1].specifics);
  });


  exampBtns.addEventListener('click', function (e) {
    var exampleDetails = e.target.dataset;
    btnReturn.removeEventListener('click', btnReturnFunction);
    btnReturn.addEventListener('click', backToFileList);
    exampleDetails.fileName = e.target.textContent;
    el.textContent = '';
    getExample(exampleDetails.rawTextLink, function (err, rawText) {
      if (err) {
        alert('Error loading text from ' + e.target.rawTextLink);
        return;
      }
      clientRoutes.getData('repos', function (err, data) {
        if (err) {
          alert('No local repository data. Internet required for data download');
        }
        makeCodePage(el, rawText, exampleDetails, data);
      });
    });
  });

  function backToFileList() {
    el.textContent = '';
    addSkillNameHeading();
    el.appendChild(exampBtns);
    btnReturn.removeEventListener('click', backToFileList);
    btnReturn.addEventListener('click', btnReturnFunction);
  }

  function addSkillNameHeading() {
    h.textContent = 'Code Examples for ' + skillName + ' Skills';
    el.appendChild(h);
  }

  function addExamples(exampleList, specifics) {
    var count = 0, len = exampleList.length;
    for (count; count < len; count++) {
      var d = document.createElement('div');
      var btn = document.createElement('button');
      btn.textContent = exampleList[count].fileName;
      btn.alt = exampleList[count].fileName;
      btn.dataset.rawTextLink = exampleList[count].rawTextLink;
      btn.dataset.repoID = exampleList[count].repoID;
      d.appendChild(btn);
      var p = document.createElement('p');
      var specString = '';
      for (var spec of exampleList[count].specificsID) {
        specString = specString + specifics[spec] + ', '
      }
      specString = specString.slice(0, specString.lastIndexOf(','));
      p.innerText = specString;
      d.appendChild(p);
      exampBtns.appendChild(d);
    }
    el.appendChild(exampBtns);
  }

};

function getExampleList(skillName, examples, skills) {
  var xmp = [];
  var skillId = skills.indexOf(skillName);
  for (var f of examples) {
    for (var ex of f.technologiesID) {
      if (skillId === ex) xmp.push(f);
    }
  }
  return xmp;
}
//get file from file link
function getExample(fileName, cb) {
  doAjax.ajaxGet(fileName, function (err, data) {
    if (err) cb(err, null);
    else cb(null, data);
  });
}

function makeCodePage(el, rawText, details, repos) {
  var codeArticle = document.getElementById('code-article'),
    codeContainer = document.getElementById('code-container'),
    theCode = document.getElementById('the-code'),
    fileName = document.getElementById('file-name'),
    pRepo = document.getElementById('parent-repo');
  if (codeArticle) {
    codeArticle.innerText = rawText;
    el.appendChild(codeArticle);
  }
  else {
    codeArticle = document.createElement('article');
    codeContainer = document.createElement('pre');
    theCode = document.createElement('code');
    pRepo = document.createElement('a');
    fileName = document.createElement('h3');
    codeArticle.id = 'code-article';
    codeContainer.id = 'code-container';
    theCode.id = 'the-code';
    pRepo.id = 'parent-repo';
    fileName.id = 'file-name';
    fileName.textContent = details.fileName;
    codeArticle.appendChild(fileName);
    if (repos) {
      pRepo.textContent = ' Repo: ' + repos[details.repoID].name;
      pRepo.href = repos[details.repoID].href;
      codeArticle.appendChild(pRepo);
    }
    theCode.innerText = rawText;
    codeContainer.appendChild(theCode);
    codeArticle.appendChild(codeContainer);
    el.appendChild(codeArticle);
  }
}

//function getRepoFromId(repoID, db){
//  return db.repos[repoID];
//}