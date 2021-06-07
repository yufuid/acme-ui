const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const get = require('lodash/get')

const fromDeclarations = (declarations) =>
  Array.isArray(declarations) && declarations.length > 0
    ? declarations.map(declaration => get(declaration, 'id.name'))
    : []

const traverseOnExports = (fn) => (node) => {
  try {
    const ast = parser.parse(node.value, {
      sourceType: 'module',
    })
    let populated = []
    traverse(ast, {
      enter(path) {
        if (path.isExportDeclaration()) {
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

const getExportsVariables = traverseOnExports(path => {
  const type = get(path, 'node.declaration.type')
  switch (type) {
    case 'VariableDeclaration':
      return fromDeclarations(get(path, 'node.declaration.declarations', []))
    case 'FunctionDeclaration':
      const declaration = get(path, 'node.declaration', false)
      return fromDeclarations(declaration ? [declaration] : [])
    case 'Identifier':
      return get(path, 'node.declaration.name')
    default:
      console.error(`Unexpected export type ${type} in docz-utils/exports`)
  }
})

module.exports = {getExportsVariables}
