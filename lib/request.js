'use strict';
/* eslint-disable no-console */

const querystring = require('querystring');

const post = (protocol, host, path, postObj) => new Promise((resolve) => {
  const
    http     = require(protocol),
    postData = querystring.stringify(postObj),
    requestParams = {
      host,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
      }
    },
    request = http.request(requestParams, (res) => {
      console.log('request completed!');
      let body = '';
      res.setEncoding('utf8');
      res.on('data',  (chunk) => body += chunk);
      res.on('error', (error) => console.error(error));
      res.on('end', () => resolve({response: body, postObj}));
    });

  request.on('error', (err) => console.error('POST ERROR', err, err.stack));
  request.write(postData);
  request.end();
});

exports.post = post;
