'use strict'

const compareFunc = require('compare-func')
const Q = require('q')
const _ = require('lodash');
const readFile = Q.denodeify(require('fs').readFile)
const { Project } = require('@lerna/project');
const resolve = require('path').resolve
const addBangNotes = require('./add-bang-notes')
const addLinkCompare = require('./add-link-compare')
const {functionify, sequenceArray} = require('./tools')

module.exports = function (config) {
  return Q.all([
    readFile(resolve(__dirname, './templates/template.hbs'), 'utf-8'),
    readFile(resolve(__dirname, './templates/header.hbs'), 'utf-8'),
    readFile(resolve(__dirname, './templates/commit.hbs'), 'utf-8'),
    readFile(resolve(__dirname, './templates/footer.hbs'), 'utf-8'),
    readFile(resolve(__dirname, './templates/references.hbs'), 'utf-8')
  ])
    .spread((template, header, commit, footer, references) => {
      const writerOpts = getWriterOpts(config)
      
      // 重置 handlebars 模板
      writerOpts.mainTemplate = template
      writerOpts.headerPartial = header
      writerOpts.commitPartial = commit
      writerOpts.footerPartial = footer
      writerOpts.partials = {
        references: references
      }
  
      return writerOpts
    })
}

function getWriterOpts (config) {
  config.lernaPackage = new Project().isIndependent();
  const typesMap = config.types.reduce((map, c) => ({...map, [c.type]: c}), {});
  const scopeSequenceMap = Array.isArray(config.scopeSequence) 
    ? config.scopeSequence.reduce((map, s) => {
      return _.isString(s) ? {...map, [s.replace(/^@(\w|-)+\//, '')]: s} : map;
    }, {})
    : {};

  return {
    // 给每一次 commit 做前期转换
    transform: (commit, context) => {
      let discard = true
      const issues = []
      
      // adds additional breaking change notes
      // for the special case, test(system)!: hello world, where there is
      // a '!' but no 'BREAKING CHANGE' in body:
      addBangNotes(commit)
      commit.notes.forEach(note => {
        note.title = '💥 BREAKING CHANGES'
        discard = false
      })
      const entry = typesMap[commit.type];

      // breaking changes attached to any type are still displayed.
      if (discard && (!entry || entry.hidden)) return;

      if (commit.scope === '*') {
        commit.scope = ''
      }

      if (typeof commit.hash === 'string') {
        commit.shortHash = commit.hash.substring(0, 7)
      }

      if (typeof commit.subject === 'string') {
        let url = context.repository
          ? `${context.host}/${context.owner}/${context.repository}`
          : context.repoUrl
        if (url) {
          url = `${url}/issues/`
          // Issue URLs.
          commit.subject = commit.subject.replace(/#([0-9]+)/g, (_, issue) => {
            issues.push(issue)
            return `[#${issue}](${url}${issue})`
          })
        }
        if (context.host) {
          // User URLs.
          commit.subject = commit.subject.replace(/\B@([a-z0-9](?:-?[a-z0-9/]){0,38})/g, (_, username) => {
            if (username.includes('/')) {
              return `@${username}`
            }

            return `[@${username}](${context.host}/${username})`
          })
        }
      }

      // remove references that already appear in the subject
      commit.references = commit.references.filter(reference => {
        if (issues.indexOf(reference.issue) === -1) {
          return true
        }

        return false
      })

      return commit
    },
    // 数据再传递给 handlebars 模板渲染前，最后一次处理机会
    finalizeContext(context, writerOpts, filteredCommits, keyCommit, originalCommits) {
      // TODO: 子级 package 的 changelog 要特殊处理
      const {typeSequence} = config;
      const isSubPackage = !_.get(context, 'packageData.workspaces');
      
      // TODO: scopeGroup.title 如何处理 npm scope 的命名（@acme-ui/core） 需要提出一个公共的方法
      if (isSubPackage) {
        const subPkgName = (_.get(context, 'packageData.name') || '').replace(/^@(\w|-)+\//, '');
        const subPkgCommitGroups = {
          [subPkgName]: {title: '', commits: []}, // title = '' 可以不显示 scope
          others: {title: '👽 Other Effect', commits: []}
        };
        context.commitGroups.forEach(scopeGroup => {
          if (!Array.isArray(scopeGroup.commits)) return;
          
          subPkgCommitGroups[scopeGroup.title === subPkgName ? subPkgName : 'others'].commits.push(...scopeGroup.commits);
        });

        context.commitGroups = [subPkgCommitGroups[subPkgName]];
        if (subPkgCommitGroups.others.commits.length > 0) {
          context.commitGroups.push(subPkgCommitGroups.others);
        }
      }

      let nextCommitGroups = [];
      let otherCommitGroups = {};
      context.commitGroups.map((scopeGroup) => {
        const commits = scopeGroup.commits;
        const preTypeGroup = sequenceArray(commits, typeSequence, (commit) => commit.type);
        const isDisplayScope = isSubPackage || scopeSequenceMap[scopeGroup.title];
        let typeGroups = []
        
        preTypeGroup.forEach(typeCommits => {
          const type = _.get(typeCommits, '[0].type') || '';
          const entry = typesMap[type] || {};
          const sortedCommits = typeCommits.sort(functionify(config.commitsSort));
          const typeSection =  _.get(entry, 'section') || '';
          if (isDisplayScope) {
            typeGroups.push({ type, typeSection, commits: sortedCommits });
          } else {
            otherCommitGroups[type] = {type, typeSection, commits: (_.get(otherCommitGroups, `${type}.commits`) || []).concat(sortedCommits)}
          }
        })
        
        if (isSubPackage) {
          nextCommitGroups.push({title: scopeGroup.title, typeGroups});
        } else if (scopeSequenceMap[scopeGroup.title]) {
          nextCommitGroups.push({title: scopeSequenceMap[scopeGroup.title], typeGroups})
        }
      });
      
      const others = Object.values(otherCommitGroups);

      context.commitGroups = others.length > 0 ? nextCommitGroups.concat([{
        title: '👽 Other Effect',
        typeGroups: _.flatten(sequenceArray(others, typeSequence, g => g.type))
      }]) : nextCommitGroups;
      
      /**
       * 由于 finalizeContext 这个配置会将  conventional-changelog-core 内置的 finalizeContext 覆盖掉，
       * 导致 linkCompare 属性没有插入，因此这里 fork 了 conventional-changelog-core 的 finalizeContext 
       * 来追加响应的处理
       * */ 
      context = addLinkCompare(context, keyCommit, originalCommits, {
        append: false,
        tagPrefix: 'v', // 暂不提供配置能力（实际上由 lerna 配置 与 lerna 命令行参数共同决定）
        lernaPackage: config.lernaPackage
      });
      
      return context;
    },
    // 排序的依据, 其值需要是 commit 对象上包含的的属性（commit 对象上的属性可以通过 transform 添加）
    groupBy: 'scope',
    commitGroupsSort(a, b) {
      // title 即为 groupBy 的值
      const {scopeSequence} = config;
      
      let idxA = scopeSequence.indexOf(scopeSequenceMap[a.title] || a.title)
      let idxB = scopeSequence.indexOf(scopeSequenceMap[b.title] || b.title)
      return idxA >= idxB ? 1 : -1;
    },
    commitsSort: config.commitsSort,
    noteGroupsSort: 'title',
    notesSort: compareFunc
  }
}
