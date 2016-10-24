#!/usr/bin/env node
'use strict';
require('dotenv').load();

/* eslint-disable no-console */
const
  slack   = require('./lib/slack'),
  execute = require('./lib/execute');

process.stdin.setEncoding('utf8');

let input = '';

process.stdin.on('readable', () => {
  var chunk = process.stdin.read();
  if (chunk !== null) {
    input += chunk;
  }
});

process.stdin.on('end', () => {
  process.stdout.write(`data: ${input}`);

  const [filesystem, size, used, avail, use, mountPoint] = input.split(/\s+/);

  execute('hostname', [], (err, response) => {
    const hostname = ('' + (err || response)).replace('\n', '');

    sendMessage(hostname, filesystem, size, used, avail, use, mountPoint);
  });
  process.stdout.write('end');
});

function sendMessage(hostname, filesystem, size, used, avail, use, mountPoint) {
  const date = new Date().toJSON().replace('T','* at *').replace(/\.\w+$/,'');
  console.log({date});
  const
    message  = `DISK SPACE PROBLEMS on *${hostname}*`,
    token    = process.env.SLACK_TOKEN,
    channel  = process.env.SLACK_CHANNEL  || '#general',
    username = process.env.SLACK_USERNAME || 'YADiSMon',
    attachments = [{
      icon_emoji: process.env.SLACK_EMOJI || ':ghost:',
      color:    '#36a64f',
      fallback: message,
      pretext:  `Event happend on *${date}*`,
      // text:     'Optional text that appears *within* the attachment',

      // author_name: process.env.APP_NAME || 'APP_NAME not configured',
      author_icon: 'https://slack.com/img/icons/app-57.png',

      // title:      process.env.SLACK_TITLE || 'SLACK_TITLE not configured',
      // title_link: 'https://api.slack.com/',
      mrkdwn_in:  ['text', 'pretext', 'fields'],
      fields: [
          {'title': 'Priority',     'value': 'High'  ,   'short': true},
          {'title': 'Hostname',     'value': hostname,   'short': true},
          {'title': 'Mount Point',  'value': mountPoint, 'short': true},
          {'title': 'Filesystem',   'value': filesystem, 'short': true},
          {'title': 'Usage',        'value': use,        'short': true},
          {'title': 'Size',         'value': size,       'short': true},
          {'title': 'Used',         'value': used,       'short': true},
          {'title': 'Available',    'value': avail,      'short': true},
          {'title': 'df -h output', 'value': '```'+input+'```'   , 'short': false},
      ],

      image_url: 'http://my-website.com/path/to/image.jpg',
      thumb_url: 'http://example.com/path/to/thumb.png'
    }];

  slack
  .sendMessageToSlack(token, message, channel, username, attachments)
  .then(console.log('Done!'));
}