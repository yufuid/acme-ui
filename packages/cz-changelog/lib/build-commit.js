const wrap = require('word-wrap');

const defaultMaxLineWidth = 100;

const addType = (type, config) => {
  const prefix = config.typePrefix || '';
  const suffix = config.typeSuffix || '';

  return `${prefix}${type}${suffix}`.trim();
};

const addScope = (scope, config) => {
  const separator = config.subjectSeparator;
  if (!scope) return separator;

  return `(${scope.trim()})${separator}`;
}

const addSubScope = (subScope) => {
  if (!subScope) return '';

  return `[${subScope.trim()}] `; // 有空格
};

const generatePrefixHead = (answers, config) => {
  return [
    addType(answers.type, config),
    addScope(answers.scope, config),
    addSubScope(answers.subScope)
  ].join('');
}

const addSubject = subject => subject && subject.trim();

const addBreakLinesIfNeeded = (value, breakLineChar) =>
  value
    .split(breakLineChar)
    .join('\n')
    .valueOf();

const addFooter = (footer, config) => {
  if (config && config.footerPrefix === '') return `\n\n${footer}`;

  return `\n\n${config.footerPrefix} ${addBreakLinesIfNeeded(footer, config.breakLineChar)}`;
};

const escapeSpecialChars = result => {
  const specialChars = ['`'];

  let newResult = result;
  specialChars.map(item => {
    // If user types "feat: `string`", the commit preview should show "feat: `\string\`".
    // Don't worry. The git log will be "feat: `string`"
    newResult = result.replace(new RegExp(item, 'g'), '\\`');
  });
  return newResult;
};

const buildCommit = (answers, config) => {
  const wrapOptions = {
    trim: true,
    newline: '\n',
    indent: '',
    width: defaultMaxLineWidth,
  };
  // 减去 scope subScope type的宽度
  const prefixHead = generatePrefixHead(answers, config);
  const subjectLimit = config.headerLimit - prefixHead.length;
  const head = [
    prefixHead,
    addSubject(answers.subject.slice(0, subjectLimit)),
  ].join('');

  // Wrap these lines at 100 characters
  let body = wrap(answers.body, wrapOptions) || '';
  body = addBreakLinesIfNeeded(body, config.breakLineChar);

  const breaking = wrap(answers.breaking, wrapOptions);
  const footer = wrap(answers.footer, wrapOptions);

  let result = head;
  if (body) {
    result += `\n\n${body}`;
  }
  if (breaking) {
    result += `\n\n${config.breakingPrefix}\n${breaking}`;
  }
  if (footer) {
    result += addFooter(footer, config);
  }

  return escapeSpecialChars(result);
};

module.exports = {
  buildCommit,
  generatePrefixHead
}