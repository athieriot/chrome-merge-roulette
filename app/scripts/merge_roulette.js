/*global $ */
/*jshint camelcase: false */
'use strict';

chrome.storage.sync.get({
  token: '',
  ignore: ''
}, function(items) {
  var GITLAB_TOKEN = items.token;
  var GITLAB_USER_IGNORE = items.ignore.split(',').map(function(s) { return s.trim(); });

  var GITLAB_URL = window.location.origin + '/api/v3/';
  var GITLAB_ROULETTE_SPEED = 5;
  var GITLAB_ROULETTE_DURATION = 3;
  var GITLAB_ROULETTE_IMG_SIZE = 60;

  var ROULETTE_STYLE = '' +
          'width:             ' + GITLAB_ROULETTE_IMG_SIZE + 'px;' +
          'height:            ' + GITLAB_ROULETTE_IMG_SIZE + 'px;' +
          'margin-right:      ' + parseInt(500 - GITLAB_ROULETTE_IMG_SIZE) + 'px;' +
          'border: solid #019875; box-shadow: 0px 3px 5px; border-radius: 10px; background-color: #FDFCFD; float: right;';

  // Get user list from Gitlab API
  $.get(GITLAB_URL + 'users?private_token=' + GITLAB_TOKEN, function(users) {

    // Insert Roulette placeholder
    $('<div class="roulette" style="' + ROULETTE_STYLE + 'display: none;"></div>').insertAfter('.assign-to-me-link');

    // Insert user images
    users
      .filter(function(e) { return GITLAB_USER_IGNORE.indexOf(e.name) === -1; })
      .forEach(function(e) {
        $('<img width="' + GITLAB_ROULETTE_IMG_SIZE + '" style="border-radius: 10px;" ' +
                'src="' + e.avatar_url + '" ' +
                'data-id="' + e.id + '" ' +
                'data-name="' + e.name + '"/>').appendTo('div.roulette');
      });

    // Initialise the Roulette
    $('div.roulette').roulette({
      speed: GITLAB_ROULETTE_SPEED,
      duration: GITLAB_ROULETTE_DURATION,
      stopImageNumber: -1,
      stopCallback: function($elem) {
        $('div#s2id_merge_request_assignee_id .select2-chosen').html($elem.data('name'));
        $('input#merge_request_assignee_id').val($elem.data('id'));
      }
    });

    // Insert Roulette start button
    $('<a class="btn roulette-link" style="margin-left: 5px">Feeling lucky!</a>')
      .insertAfter('.assign-to-me-link')
      .on('click', function () {

        $('div.roulette').roulette('start');
      });
  });
});

