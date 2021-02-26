'use strict';

const fs = require('fs');
const crypto = require('crypto');

module.exports = {
  // 创建一个 cache key 来决定是否执行 process方法
  getCacheKey(fileData, filename, configString, cacheKeyOptions) {
    const { instrument } = cacheKeyOptions;
    return crypto
      .createHash('md5')
      .update(fs.readFileSync(__filename)) // 当前文件名
      .update('\0', 'utf8')
      .update(fileData) // 被transform的文件内容
      .update('\0', 'utf8')
      .update(filename) // 被transform的文件名
      .update('\0', 'utf8')
      .update(configString) // jest config
      .update('\0', 'utf8')
      .update(instrument ? 'instrument' : '') // 在计算coverage时是否被检测
      .digest('hex');
  },

  process(fileData) {
    return `
      const styleInject = require('style-inject');

      styleInject(${JSON.stringify(fileData)});
      module.exports = {};
    `;
  },
};
