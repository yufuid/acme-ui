/**
 * Fork [conventional-changelog-core](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-core)
 * 中 内置 finalizeContext 关于 linkCompare 的操作
*/
const _ = require('lodash')

module.exports = function (context, keyCommit, originalCommits, options) {
  const gitSemverTags = context.gitSemverTags
  const firstCommit = originalCommits[0]
  const lastCommit = originalCommits[originalCommits.length - 1]
  const firstCommitHash = firstCommit ? firstCommit.hash : null
  const lastCommitHash = lastCommit ? lastCommit.hash : null

  if ((!context.currentTag || !context.previousTag) && keyCommit) {
    const match = /tag:\s*(.+?)[,)]/gi.exec(keyCommit.gitTags)
    const currentTag = context.currentTag
    context.currentTag = currentTag || match ? match[1] : null
    const index = gitSemverTags.indexOf(context.currentTag)

    // if `keyCommit.gitTags` is not a semver
    if (index === -1) {
      context.currentTag = currentTag || null
    } else {
      const previousTag = context.previousTag = gitSemverTags[index + 1]

      if (!previousTag) {
        if (options.append) {
          context.previousTag = context.previousTag || firstCommitHash
        } else {
          context.previousTag = context.previousTag || lastCommitHash
        }
      }
    }
  } else {
    context.previousTag = context.previousTag || gitSemverTags[0]

    if (context.version === 'Unreleased') {
      if (options.append) {
        context.currentTag = context.currentTag || lastCommitHash
      } else {
        context.currentTag = context.currentTag || firstCommitHash
      }
    } else if (!context.currentTag) {
      if (options.lernaPackage) {
        context.currentTag = options.lernaPackage + '@' + context.version
      } else if (options.tagPrefix) {
        context.currentTag = options.tagPrefix + context.version
      } else {
        context.currentTag = guessNextTag(gitSemverTags[0], context.version)
      }
    }
  }

  if (!_.isBoolean(context.linkCompare) && context.previousTag && context.currentTag) {
    context.linkCompare = true
  }

  return context
}