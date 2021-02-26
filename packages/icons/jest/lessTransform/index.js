'use strict';

const path = require('path');
const crossSpawn = require('cross-spawn');
const { getCacheKey, process } = require('../cssTransform');

module.exports = {
  getCacheKey: getCacheKey,
  process: (fileData, filename, config, options) => {
    const lessRunner = path.resolve(__dirname, 'lessRunner.js');
    const result = crossSpawn.sync('node', [lessRunner, fileData, filename]);

    const error = result.stderr.toString();
    if (error) throw error;

    let css;
    try {
      const parsed = JSON.parse(result.stdout.toString());
      css = parsed.css;
      if (Array.isArray(parsed.warnings))
        parsed.warnings.forEach((warning) => {
          console.warn(warning);
        });
    } catch (error) {
      console.error(`jest transform less: Failed to load '${filename}'`);
      throw error;
    }

    return process(css, filename, config, options);
  },
};
