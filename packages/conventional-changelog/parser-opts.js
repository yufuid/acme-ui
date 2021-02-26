'use strict'

module.exports = function (config) {
  return {
    headerPattern: /^(\w*)(?:\((.*)\))?!?: (?:\[([a-zA-Z0-9_\-]*)\])?(.*)$/,
    breakingHeaderPattern: /^(\w*)(?:\((.*)\))?!: (?:\[([a-zA-Z0-9_\-]*)\])?(.*)$/,
    headerCorrespondence: [
      'type',
      'scope',
      'subScope',
      'subject'
    ],
    noteKeywords: ['BREAKING CHANGE'],
    revertPattern: /^(?:Revert|revert:)\s"?([\s\S]+?)"?\s*This reverts commit (\w*)\./i,
    revertCorrespondence: ['header', 'hash'],
    issuePrefixes: ['#']
  }
}