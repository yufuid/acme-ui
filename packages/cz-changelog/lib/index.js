/**
 * 组件库项目 commitizen 定制化
 * */

const chalk = require('chalk');
const autocomplete = require('inquirer-autocomplete-prompt');
const { analyzeCommits } = require('@semantic-release/commit-analyzer');
const defaultConfig = require('./config');
const {buildCommit} = require('./build-commit');
const getQuestions = require('./commit-msg-questions');
const {
  getChangedPackages, getAllPackages, getCommitTypeMessage, makeAffectsLine, getCustomConfig
} = require('./tools');
const customConfig =  getCustomConfig(defaultConfig.customConfigFileName)
const config = {...defaultConfig, ...customConfig };

module.exports = {
  prompter(cz, commit) {
    getAllPackages().then(pkgs => {
      const allPackages = pkgs.map(pkg => pkg.name);
      const changedPackages = getChangedPackages(pkgs);
      const questions = getQuestions(allPackages, changedPackages, config);

      console.log('\n\nLine 1 will be cropped at 100 characters. All other lines will be wrapped after 100 characters.\n');

      cz.registerPrompt('autocomplete', autocomplete);
      cz.prompt(questions).then((answers) => {
        const affectsLine = makeAffectsLine(answers);
        if (affectsLine) {
          answers.body = `${affectsLine}\n` + answers.body;
        }

        const message = buildCommit(answers, config);
        analyzeCommits({}, {
          commits: [{
            hash: '',
            message,
          }],
          logger: console
        }).then((type) => {
          console.log(chalk.green(`\n${getCommitTypeMessage(type)}\n`));
          console.log('\n\nCommit message:');
          console.log(chalk.blue(`\n\n${message}\n`));
          commit(message)
        }).catch((err) => console.error(err));
      });
    })
  },
};
