/**
 * tools
 * */

const shell = require('shelljs');
const path = require('path');
const fs = require('fs');
const { cosmiconfigSync } = require('cosmiconfig');
const { getPackages } = require('@lerna/project');

exports.getAllPackages = function () {
  return getPackages();
}

exports.getChangedPackages = function (allPackages) {
  const changedFiles = shell.exec('git diff --cached --name-only', { silent: true })
    .stdout
    .split('\n')
    .map(path.normalize);

  return allPackages
    .filter(function (pkg) {
      const packagePrefix = path.relative('.', pkg.location) + path.sep;
      for (let changedFile of changedFiles) {
        if (changedFile.indexOf(packagePrefix) === 0) {
          return true;
        }
      }
    })
    .map(function (pkg) {
      return pkg.name
    });
}

exports.makeAffectsLine = function (answers) {
  const selectedPackages = answers.packages;
  if (selectedPackages && selectedPackages.length) {
    return `affects: ${selectedPackages.join(', ')}`;
  }
}

exports.getCommitTypeMessage = function (type) {
  if (!type) {
    return 'This commit does not indicate any release'
  }
  return {
    patch: '🐛  This commit indicates a patch release (0.0.X)',
    minor: '✨  This commit indicates a minor release (0.X.0)',
    major: '💥  This commit indicates a major release (X.0.0)',
  }[type];
}

exports.getCustomConfig = function(customConfigFileName) {
  const explorerSync = cosmiconfigSync(customConfigFileName);
  const result = explorerSync.search();
  return result && result.config || {};
}
