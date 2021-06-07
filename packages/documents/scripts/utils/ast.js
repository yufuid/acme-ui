
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

const valueFromTraverse = (condition, predicate) => (code) => {
  let value = ''
  const ast = parser.parse(code, { plugins: ['jsx'] })

  traverse(ast, {
    enter(path) {
      if (condition(path)) {
        value = predicate(path)
        path.stop()
        return
      }
    },
  })

  return value
}

const codeFromNode = (condition) => (code) =>
  valueFromTraverse(condition, p => code.slice(p.node.start, p.node.end))(code)

module.exports = {valueFromTraverse, codeFromNode};
