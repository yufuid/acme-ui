/**
 * commitlint 默认 rule 配置
 * https://github.com/conventional-changelog/commitlint/blob/master/docs/reference-rules.md
*/
const defaultConfig = require('./config');
const {getAllPackages, getCustomConfig} = require('./tools');
const customConfig =  getCustomConfig(defaultConfig.customConfigFileName)
const config = {...defaultConfig, ...customConfig };

module.exports = {
  rules: {
    'body-leading-blank': [1, 'always'],
    'footer-leading-blank': [1, 'always'],
    'scope-case': [0, 'always', 'lower-case'],
    'subject-case': [
			2,
			'never',
			['sentence-case', 'start-case', 'pascal-case', 'upper-case'],
    ],
    'subject-empty': [2, 'never'],
    'type-enum': [2, 'always', config.typeChoices.map(o => o.value)],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'header-max-length': [2, 'always', config.headerLimit],
    'scope-enum': async function () {
      const pkgs = await getAllPackages();
      const enums = pkgs.map(pkg => pkg.name && pkg.name.replace(/^@(\w|-)+\//, ''))
      
      return [2, 'always', enums];
    },
    'scope-case': [2, 'always', 'lower-case'],
  },
}