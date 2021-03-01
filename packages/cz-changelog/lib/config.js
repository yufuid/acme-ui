const typeChoices = [
  {value: 'feat',     name: 'feat:     ✨ A new feature (note: this will indicate a release)'},
  {value: 'fix',      name: 'fix:      🐛 A bug fix (note: this will indicate a release)'},
  {value: 'docs',     name: 'docs:     📖 Documentation only changes'},
  {value: 'refactor', name: 'refactor: 🔨 A code change that neither fixes a bug nor adds a feature'},
  {value: 'test',     name: 'test:     🚨 Adding missing tests or correcting existing tests'},
  {value: 'chore',    name: 'chore:    🔧 Other changes that don\'t modify src or test files'},
  {value: 'revert',   name: 'revert:   ⏪ Reverts a previous commit'},
];

module.exports = {
  customConfigFileName: 'cz', // 配置文件名称 cosmiconfig 使用，外部设置无效
  headerLimit: 100, // header 字数限制
  upperCaseSubject: false, // subject 部分首字母大写
  allowBreakingChanges: ['feat', 'fix', 'refactor'], // 允许 BreakingChanges 的 type
  subjectSeparator: ': ', // subject 部分的分隔符
  breakLineChar: '|', // body 部分的分隔符
  breakingPrefix: 'BREAKING CHANGE:',
  footerPrefix: 'ISSUES CLOSED:',
  scopeOverrides: {},
  typePrefix: '', // 用来定义 commit msg 中 type 的展示
  typeSuffix: '',
  typeChoices
}
