#!/usr/bin/env node
'use strict';
/* eslint-disable no-console */

// Loads .env file with environmental variables
require('dotenv').load();

const
  assert    = require('assert'),
  slack     = require('./lib/slack'),
  execute   = require('./lib/execute'),
  THRESHOLD = Math.abs(process.argv[2] || process.env.THRESHOLD);

// THE APP STARTS RUNNING RIGHT HERE
init();

function init() {
  assert(process.argv[2] || 'THRESHOLD' in process.env, 'THRESHOLD variable/parameter not set');
  assert(THRESHOLD <= 100, `THRESHOLD [${THRESHOLD}] is greater than 100`);

  processStandardInput();
}

function processStandardInput() {
  let input = '';

  process.stdin.setEncoding('utf8');

  process.stdin.on('readable', () => {
    var chunk = process.stdin.read();
    if (chunk !== null) {
      input += chunk;
    }
  });

  process.stdin.on('end', () => {
    process.stdout.write(`input:\n${input}\n`);
    const
      VALID_INPUT_REGEXP = new RegExp(process.env.VALID_INPUT_REGEXP || '^\\/'),
      lines       = input.split('\n'),
      inputHeader = lines.shift(),
      validLines  = lines.filter(_ => VALID_INPUT_REGEXP.test(_));

    validLines.forEach(checkThreshold(inputHeader));
  });
}

const checkThreshold = inputHeader => input => {
  const [filesystem, size, used, avail, use, mountPoint] = input.split(/\s+/);

  if (+(use.replace(/\D+/g,'')) < THRESHOLD) return;

  execute('hostname', [], (err, response) => {
    const hostname = ('' + (err || response)).replace('\n', '');

    sendMessage(hostname, filesystem, size, used, avail, use, mountPoint, input, inputHeader);
  });
};

function sendMessage(hostname, filesystem, size, used, avail, use, mountPoint, input, inputHeader) {
  const date = new Date().toJSON().replace('T','* at *').replace(/\.\w+$/,'');
  console.log({date});
  const
    message  = `DISK SPACE PROBLEMS on *${hostname}*`,
    token    = process.env.SLACK_TOKEN,
    channel  = process.env.SLACK_CHANNEL  || '#general',
    username = process.env.SLACK_USERNAME || 'YADiSMon',
    attachment = {
      icon_emoji: process.env.SLACK_EMOJI || ':ghost:',
      color:    '#36a64f',
      fallback: message,
      pretext:  `Event happend on *${date}*`,
      text:     `*${use}* of use is over the configured threshold of *${THRESHOLD}*%`,

      author_name: process.env.SLACK_AUTHOR_NAME || hostname,
      author_icon: process.env.SLACK_AUTHOR_ICON, // EXAMPLE: 'https://slack.com/img/icons/app-57.png',

      title:      process.env.SLACK_TITLE,
      title_link: process.env.SLACK_TITLE_LINK,
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
      ],

      image_url:   process.env.SLACK_IMAGE_URL,
      thumb_url:   process.env.SLACK_THUMB_URL,
      footer:      process.env.SLACK_FOOTER      || 'github.com/EveryMundo/YADiSMon',
      footer_icon: process.env.SLACK_FOOTER_ICON || 'https://pbs.twimg.com/profile_images/585493660952879105/0g1omKlr_normal.png',
    };

  if (process.env.INCLUDE_RAW_INPUT)
    attachment.fields.push({'title': 'df -h output', 'value': '```'+inputHeader+'\n'+input+'```'   , 'short': false});

  slack
  .sendMessageToSlack(token, message, channel, username, [attachment])
  .then(console.log('Done!'));
}
