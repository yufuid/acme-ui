/**
 * commit message 命令行问题
 * */
const {generatePrefixHead} = require('./build-commit');

function autoCompleteSource(options) {
  return (answersSoFar, input) => {
    return new Promise((resolve) => {
      const matches = options.filter(({ name }) => (!input || name.toLowerCase().indexOf(input.toLowerCase()) === 0));
      resolve(
        matches
      );
    });
  };
}

module.exports = (allPackages, changedPackages, config) => ([
  {
    name: 'type',
    message: 'Select the TYPE of change that you\'re committing:\n',
    choices: config.typeChoices,
    type: 'autocomplete',
    source: autoCompleteSource(config.typeChoices),
  },
  {
    type: 'list',
    name: 'scope',
    choices() {
      const pkgs =  changedPackages.map((pkgName) => {
        return {value: pkgName.replace(/^@(\w|-)+\//, ''), name: pkgName};
      });
      return [{value: false, name: 'empty'}, ...pkgs];
    },
    message: 'Select the PACKAGE with the more significant changes (optional):\n',
  },
  {
    type: 'list',
    name: 'subScope',
    message: 'Denote the SUB_SCOPE of this change (optional):\n',
    choices(answers) {
      let scopes = [
        { value: false,    name: 'empty:    Do not need to select the SubScope option' },
        { value: 'custom', name: 'custom    📝 Customize the value of SubScope' },
      ];
      const typeOverrides = config.scopeOverrides && config.scopeOverrides[answers.type] || {};
      const defaultOverrides = typeOverrides.default || [];
      const pkgOverrides = typeOverrides[answers.scope] || [];

      return [...scopes, ...defaultOverrides, ...pkgOverrides];
    },
  },
  {
    type: 'input',
    name: 'subScope',
    message: 'Denote the SUB_SCOPE of this change:\n',
    when(answers) {
      return answers.subScope === 'custom';
    },
  },
  {
    type: 'input',
    name: 'subject',
    message: 'Write a SHORT, IMPERATIVE tense description of the change:\n',
    validate(value, answers) {
      const prefixHead = generatePrefixHead(answers, config);

      if (value.length > config.headerLimit - prefixHead.length) {
        return `Header must not be longer than ${config.headerLimit} characters.(Now: ${prefixHead.length + value.length})\n`;
      }
      return !!value;
    },
    filter(value) {
      const upperCaseSubject = config.upperCaseSubject || false;

      return (upperCaseSubject ? value.charAt(0).toUpperCase() : value.charAt(0).toLowerCase()) + value.slice(1);
    },
  },
  {
    type: 'input',
    name: 'body',
    message: `Provide a LONGER description of the change (optional). Use "${config.breakLineChar}" to break new line:\n`
  },
  {
    type: 'input',
    name: 'breaking',
    message: 'List any BREAKING CHANGES (optional):\n',
    when(answers) {
      return Array.isArray(config.allowBreakingChanges) && config.allowBreakingChanges.includes(answers.type)
    },
  },
  {
    type: 'input',
    name: 'footer',
    message: 'List any ISSUES CLOSED by this change (optional). E.g.: #31, #34:\n',
  },
  {
    type: 'checkbox',
    name: 'packages',
    'default': changedPackages,
    choices: allPackages,
    message: `The packages that this commit has affected (${changedPackages.length} detected)\n`,
  },
]);

