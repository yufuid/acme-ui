const parser = require('@babel/parser')
const generator = require('@babel/generator')
const traverse = require('@babel/traverse').default
const get = require('lodash/get')

const fromSpecifiers = (specifiers) =>
  Array.isArray(specifiers) && specifiers.length > 0
    ? specifiers.map(specifier => get(specifier, 'local.name'))
    : []

const traverseOnImports = (fn) => (node) => {
  try {
    const ast = parser.parse(node.value, { sourceType: 'module' })
    let populated = []

    traverse(ast, {
      enter(path) {
        if (path.isImportDeclaration()) {
          populated = populated.concat(fn(path))
          return
        }
      },
    })

    return populated
  } catch (err) {
    return []
  }
}

const getFullImports = traverseOnImports((path) => [
  get(generator.default(path.node), 'code'),
])

const getImportsVariables = traverseOnImports((path) =>
  fromSpecifiers(path.node.specifiers)
)

module.exports = {getFullImports, getImportsVariables}
