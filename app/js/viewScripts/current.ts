/**
 * current.ts
 * Created by dcorns on 2/9/16
 * Copyright © 2016 Dale Corns
 */
'use strict';
var clientRoutes = require('../clientRoutes')();
module.exports = function current(){
  var tblActivity = document.getElementById('tbl-activity');
  var tblComplete = document.getElementById('tbl-complete');
  var dateRange = document.getElementById('date-range');
  let btnActivityMenu = document.getElementById('btn-activity-menu');
  let activityMenu = document.getElementById('menu-activities-category');
  btnActivityMenu.addEventListener('click', function(){
    activityMenu.classList.toggle('hide');
  });
  let typeIdx = window.sessionStorage.getItem('typeIndex') || '0';
  mySkills.route('daterange', 'date-range');
  clientRoutes.getData('current?typeIndex=' + typeIdx, function(err, data){
    if(err){
      alert('No current data stored locally. Internet connection required');
      console.error(err);
      return;
    }
    buildActivityTable(data.json, tblActivity, tblComplete);
    setDateRange(data.json, dateRange);
  });
  clientRoutes.getData('currentCategoryMenu', function(err, data){
    if(err){
      console.error(err);
      return;
    }
    buildMenu(data.json[0].activityCategories, activityMenu);
  });
};
//expects tbl to be a tbody element
function appendActivity(aObj, tbl, isComplete){
  var row = document.createElement('tr');
  var startDate = document.createElement('td');
  var activityLink = document.createElement('td');
  var activity = document.createElement('td');
  activity.innerText = aObj.activity;
  var endDate = isComplete ? document.createElement('td') : null;
  startDate.innerText = new Date(aObj.startDate).toLocaleDateString();
  if(aObj.link){
    var anchor = document.createElement('a'), anchorIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg'), anchorUse = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    anchor.href = aObj.link;
    anchorIcon.setAttribute('class', 'icon');
    anchorUse.setAttributeNS('http://www.w3.org/1999/xlink', 'href','#icon-link');
    anchorIcon.appendChild(anchorUse);
    anchor.appendChild(anchorIcon);
    activityLink.appendChild(anchor);
  }

  row.appendChild(activity);
  row.appendChild(activityLink);
  row.appendChild(startDate);
  if(endDate){
    endDate.innerText = new Date(aObj.endDate).toLocaleDateString();
    row.appendChild(endDate);
  }
  if(aObj['details']){
    addDetails(row, aObj.details, 'activity-detail');
  }
  tbl.appendChild(row);
}
/**
 * @function buildActivityTable
 * Builds the completed and incomplete activity tables
 * Depends on the splitAndIndexData and appendActivity functions
 * @param data
 * @param tblNow
 * @param tblOld
 */
function buildActivityTable(data, tblNow, tblOld){
  let splitData = splitAndIndexData(data);
  splitData.incomplete.sort(function(a, b){
    return new Date(b.startDate) - new Date(a.startDate);
  });
  splitData.complete.sort(function(a, b){
    return new Date(b.endDate) - new Date(a.endDate);
  });
  var len = splitData.incomplete.length, c = 0;
  for(c; c < len; c++){
    appendActivity(splitData.incomplete[c], tblNow, false);
  }
  len = splitData.complete.length; c = 0;
  for(c; c < len; c++){
    appendActivity(splitData.complete[c], tblOld, true);
  }
}
/**
 * @function addDetails
 * Prepends a button to click for details on the first td of the rowIn. Adds a data-details attribute to rowIn and sets its value to details. Adds an event listener to set the innerHTML of the element with the id of viewContainer to data-details and toggle display of viewContainer below the row when the button is clicked. Depends on tableInsertView
 * @param rowIn tr
 * @param details String
 * @param viewContainer
 */
function addDetails(rowIn, details, viewContainer){
  let btn = document.createElement('button');
  btn.textContent = '*';
  rowIn.setAttribute('data-details', details);
  btn.addEventListener('click', function(){
    let detailSection = document.getElementById(viewContainer);
    let row = this.parentNode.parentNode;
    detailSection.innerHTML = row.getAttribute('data-details');
    tableInsertView(detailSection, row);
  });
  rowIn.childNodes[0].insertBefore(btn, rowIn.childNodes[0].childNodes[0]);
}

function buildMenu(data, menuElement){
  var menuCount = 0;
  data.forEach(function(item){
    let btn = document.createElement('button');
    btn.textContent = item;
    btn.value = menuCount;
    btn.addEventListener('click', function(){
      var tblActivity = document.getElementById('tbl-activity');
      var tblComplete = document.getElementById('tbl-complete');
      tblActivity.innerHTML = '';
      tblComplete.innerHTML = '';
      window.sessionStorage.setItem('typeIndex', this.value);
      clientRoutes.getData('current?typeIndex=' + this.value, function(err, data){
        if(err){
          alert('No current data stored locally. Internet connection required');
          console.error(err);
          return;
        }
        buildActivityTable(data.json, tblActivity, tblComplete);
      });
    });
    menuElement.appendChild(btn);
    menuCount++;
  });
}
/**
 * @function tableInsertView
 * Take in a DOM nade view and a DOM node tr. Toggle insert or remove view after the tr.
 * Depends on layout css hide class and that the viewIn nade be assign absolute positioning
 * @param viewIn
 * @param insertRow
 */
function tableInsertView(viewIn, insertRow){
  viewIn.classList.toggle('hide');
  if(!(viewIn.classList.contains('hide'))) {
    let rect = insertRow.getBoundingClientRect();
    viewIn.style.left = `${rect.left + scrollX}px`;
    viewIn.style.top = `${rect.top + rect.height + scrollY}px`;
    viewIn.style.width = `${rect.width}px`;
  }
}
/**
 * @function splitAndIndexData
 * Separates data by data[i].endDate and add its index within the array to it.
 * @param data
 * @returns {{incomplete: Array, complete: Array}}
 */
function splitAndIndexData(data){
  let i = 0, len = data.length, noEndDate = [], hasEndDate = [];
  for(i; i < len; i++){
    data[i].idx = i;
    data[i].endDate ? hasEndDate.push(data[i]) : noEndDate.push(data[i]);
  }
  return {incomplete: noEndDate, complete: hasEndDate};
}
function setDateRange(data, el){
  el.dataset.startDate = data[0].endDate;
  el.dataset.endDate = data[data.length - 1].endDate;
  let dateRangeChangeEvt = document.createEvent('Events');
  dateRangeChangeEvt.initEvent('daterangeupdated', true, false);
  el.dispatchEvent(dateRangeChangeEvt);
}