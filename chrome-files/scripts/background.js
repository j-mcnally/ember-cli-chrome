'use strict';

chrome.runtime.onInstalled.addListener(function(details) {
  console.log('previousVersion', details.previousVersion);
});

chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.executeScript({
    file: 'scripts/insert.js',
  });
});

