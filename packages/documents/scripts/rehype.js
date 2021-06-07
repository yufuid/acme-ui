/**
 * 一个 rehype 插件
 * */

const flatten = require('lodash/flatten');
const nodeToString = require('hast-util-to-string')
const { format } = require('./utils/format')
const { componentName, sanitizeCode, removeTags } = require('./utils/jsx')
const { getImportsVariables } = require('./utils/imports')
const { getExportsVariables } = require('./utils/exports')

const isPlayground = (name) => {
  return name === 'Playground'
}

const addComponentsProps = (scopes) => async (node, idx) => {
  const name = componentName(node.value)
  const tagOpen = new RegExp(`^\\<${name}`)

  if (isPlayground(name)) {
    const formatted = await format(nodeToString(node))
    const code = formatted.slice(1, Infinity)
    const scope = `{props,${scopes.join(',')}}`
    const child = sanitizeCode(removeTags(code))

    node.value = node.value.replace(
      tagOpen,
      `<${name} __position={${idx}} __code={'${child}'} __scope={${scope}}`
    )
  }
}

module.exports = () => (tree) => {
  const importNodes = tree.children.filter((n) => n.type === 'import')
  const exportNodes = tree.children.filter((n) => n.type === 'export')
  const importedScopes = flatten(importNodes.map(getImportsVariables))
  const exportedScopes = flatten(exportNodes.map(getExportsVariables))
  // filter added to avoid throwing if an unexpected type is exported
  const scopes = [...importedScopes, ...exportedScopes].filter(Boolean)

  const nodes = tree.children
    .filter((node) => node.type === 'jsx')
    .map(addComponentsProps(scopes))
  return Promise.all(nodes).then(() => tree)
}
