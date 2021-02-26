'use strict'
const Q = require('q')
const conventionalChangelog = require('./conventional-changelog')
const parserOpts = require('./parser-opts')
const recommendedBumpOpts = require('./conventional-recommended-bump')
const writerOpts = require('./writer-opts')

module.exports = function (config) {
  config = mergeDefaultConfig(config);
  return Q.all([
    conventionalChangelog(config), 
    parserOpts(config), 
    recommendedBumpOpts(config), 
    writerOpts(config)
  ])
  .spread((conventionalChangelog, parserOpts, recommendedBumpOpts, writerOpts) => {
    return { conventionalChangelog, parserOpts, recommendedBumpOpts, writerOpts }
  })
}

function mergeDefaultConfig(config) {
  return {
    types: [
      { type: 'feat',     section: '✨ Features'},
      { type: 'fix',      section: '🐛 Bug Fixes'},
      { type: 'docs',     section: '📖 Documentation'},
      { type: 'refactor', section: '🔨 Code Refactoring'},
      { type: 'test',     section: '🚨 Tests', hidden: true },
      { type: 'chore',    section: '🔧 Miscellaneous Chores', hidden: true},
      { type: 'revert',   section: '⏪ Reverts'},
    ],
    commitsSort: ['subScope', 'subject'],
    scopeSequence: [],
    typeSequence: ['feat', 'fix', 'refactor', 'docs'],
    ...(config || {})
  };
}