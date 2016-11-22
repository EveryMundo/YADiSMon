'use strict';
require('dotenv').load();
/* eslint-disable no-console */

const request = require('./request');

const sendMessageToSlack = (token, text, channel='#general', username, attachments=null) => new Promise((resolve, reject) => {
  const
    postObj  = {
      token,
      channel,
      text,
      username: username || 'SLACK_USERNAME not configured',
      icon_emoji: process.env.SLACK_EMOJI || ':ghost:',
      // 'icon_url': 'https://slack.com/img/icons/app-57.png',
      parse: true,
      attachments: attachments && JSON.stringify(attachments)
    };

  request
  .post('https', 'slack.com', '/api/chat.postMessage', postObj)
  .then(resolve)
  .catch(reject);
});

exports.sendMessageToSlack = sendMessageToSlack;
