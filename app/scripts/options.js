'use strict';

function saveOptions() {

  var token = document.getElementById('token').value;
  var ignore = document.getElementById('ignore').value;

  chrome.storage.sync.set({
    token: token,
    ignore: ignore
  }, function() {

    var status = document.getElementById('status');
    status.textContent = 'Options saved.';

    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

function restoreOptions() {

  chrome.storage.sync.get({
    token: '',
    ignore: ''
  }, function(items) {
    document.getElementById('token').value = items.token;
    document.getElementById('ignore').value = items.ignore;
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
