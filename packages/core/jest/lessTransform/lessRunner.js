'use strict';

const less = require('less');
const path = require('path');

const args = process.argv.slice(2);
const lessContent = args[0];
const filename = args[1];

if (!lessContent || typeof lessContent !== 'string') {
  console.error('transform-less: Must transfer less content string!');
  return;
}

if (!filename || typeof filename !== 'string') {
  console.error('transform-less: Must transfer filename!');
  return;
}

less
  .render(lessContent, {
    paths: [],
    filename: filename,
  })
  .then(
    (result) => console.log(JSON.stringify(result)),
    (error) => console.error(error),
  );
