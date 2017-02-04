/**
 * daterange.ts
 * Created by dcorns on 1/25/17
 * Copyright © 2017 Dale Corns
 */
/// <reference path="../../../all.d.ts" />
'use strict';
module.exports = function daterange(): void {
  let self: HTMLElement = document.getElementById('daterange');
  let host: HTMLElement = self.parentElement;
  let dateStart = <HTMLInputElement>document.getElementById('date-start');
  let dateEnd = <HTMLInputElement>document.getElementById('date-end');
  host.addEventListener('daterangeupdated', function(){
    dateStart.value = extractDate(host.dataset['startDate']);
    dateEnd.value = extractDate(host.dataset['endDate']);
  });
};

function extractDate(dateString: string): string{
  return dateString.slice(0, 10);
}

