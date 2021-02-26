module.exports = {
  hooks: {
    'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS',
    'pre-commit': 'lerna run --concurrency 1 --stream lint-staged --since HEAD --exclude-dependents'
  }
}
