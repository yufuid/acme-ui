const prettier = require('prettier')

const formatter = (code) =>
  prettier.format(code, {
    parser: 'babel',
    semi: false,
    singleQuote: true,
    trailingComma: 'all',
  })

const format = (code) =>
  new Promise(resolve => {
    try {
      const result = formatter(code)

      resolve(result)
    } catch (err) {
      resolve(code)
    }
  })

module.exports = {formatter, format}
