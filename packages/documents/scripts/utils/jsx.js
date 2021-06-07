
const strip = require('strip-indent')
const escapeJS = require('js-string-escape')
const { codeFromNode } = require('./ast')

const removeTags = (code) => {
  const open = codeFromNode(p => p.isJSXOpeningElement())
  const close = codeFromNode(p => p.isJSXClosingElement())

  return code.replace(open(code), '').replace(close(code), '')
}

const sanitizeCode = (code) => {
  const trimmed = strip(code).trim()
  const newCode =
    trimmed.startsWith('{') && trimmed.endsWith('}')
      ? trimmed.substr(1, trimmed.length - 2).trim()
      : trimmed

  return escapeJS(strip(newCode))
}

const componentName = (value) => {
  const match = value.match(/^\<\\?(\w+)/)
  return match && match[1]
}

module.exports = {removeTags, sanitizeCode, componentName};
