/**
 * @acme-ui/cz-changelog 配置
 * */
const path = require('path');
const fs = require('fs');
const componentDir = path.resolve(__dirname, 'packages/core/src/components');
const cModuleNames = fs.readdirSync(path.resolve(componentDir)).filter((name) => !!/^[A-Z]\w*/.test(name));


// type(package): [scope] subject
module.exports = {
  allowBreakingChanges: ['feat', 'fix', 'refactor', 'docs', 'test', 'chore', 'revert'],
  scopeOverrides: {
    feat: {
      default: [
        {value: 'Project', name: 'Project:  🎉 Begin a project.'},
      ],
      core: cModuleNames,
    },
    fix: {
      default: [],
      core: cModuleNames,
    },
    refactor: {
      default: [],
      core: cModuleNames,
    },
    docs: {
      default: [],
    },
    test: {
      default: [],
    },
    chore: {
      default: [
        {value: 'CI',      name: 'CI:       👷 Add or update CI build system.'},
        {value: 'Format',  name: 'Format:   🎨 Improve structure / format of the code.'},
        {value: 'Upgrade', name: 'Upgrade:  ⬆️  Upgrade dependencies.'},
        {value: 'Build',   name: 'Build:    🏗  Update scripts or configuration files.'},
      ],
    }
  },
}