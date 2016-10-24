'use strict';

const spawn = require('child_process').spawn;

function execute(command, arrayAgs, callback) {
  const ref = spawn(command, arrayAgs);

  let stdout='';
  ref.stdout.on('data', (data) => {
    stdout += data;
    // console.log(`${command} stdout: ${data}`);
  });

  let stderr='';
  ref.stderr.on('data', (data) => {
    stderr += data;
    // console.log(`${command} stderr: ${data}`);
  });

  ref.on('close', (code) => {
    // console.log(`child process ${command} exited with code ${code}`);
    callback(code != 0 && stderr, stdout);
  });

  return ref;
}

module.exports = execute;