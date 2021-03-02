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
  const scopeSequenceMap = computeScopeSequenceMap(config);

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
      // type commitGroups = Array<{
      //   title: string,
      //   typeGroups: Array<{
      //     typeSection: string,
      //     type: string,
      //     subScopeGroups: Array<{
      //       subScope: string,
      //       commits: Array<Object>
      //     }>
      //   }>
      // }>
      const {typeSequence} = config;
      const isSubPackage = !_.get(context, 'packageData.workspaces');
      
      // sub package 仅显示自己的 commit, 不区分 scope , 这里需要预处理一下将所有 scopeGroup 合并
      if (isSubPackage) {
        const subPkgCommitGroups = {title: '', commits: []}; // title = '' 可以不显示 scope
        context.commitGroups.forEach(scopeGroup => {
          if (!Array.isArray(scopeGroup.commits)) return;
          subPkgCommitGroups.commits.push(...scopeGroup.commits);
        });

        context.commitGroups = [subPkgCommitGroups];
      }

      let nextCommitGroups = [];
      context.commitGroups.map((scopeGroup) => {
        const commits = scopeGroup.commits;
        const preTypeGroup = sequenceArray(commits, typeSequence, (commit) => commit.type);
        const currentScopeConfig = scopeSequenceMap[scopeGroup.title];
        const isDisplayScope = isSubPackage || currentScopeConfig;
        let typeGroups = []
        
        // mixin 的 scope 不再有 type 区分
        if (!isSubPackage && currentScopeConfig && currentScopeConfig.mixin) {
          const subScopeGroups = formatSubScope(config, _.flatten(preTypeGroup));
          nextCommitGroups.push({
            title: currentScopeConfig.title, 
            typeGroups: [{type: '', typeSection: '', subScopeGroups}]
          });
          return;
        }

        preTypeGroup.forEach(typeCommits => {
          if (isDisplayScope) {
            const type = _.get(typeCommits, '[0].type') || '';
            const entry = typesMap[type] || {};
            const subScopeGroups = formatSubScope(config, typeCommits);
            const typeSection =  _.get(entry, 'section') || '';
            typeGroups.push({ type, typeSection, subScopeGroups });
          }
        })
        
        if (isSubPackage) {
          nextCommitGroups.push({title: scopeGroup.title, typeGroups});
        } else if (currentScopeConfig) {
          nextCommitGroups.push({title: currentScopeConfig.title, typeGroups})
        }
      });
      
      /**
       * NOTICE: 顶层 changelog 不显示 scopeSequence 以外的 scope 所包含的 commit
       * 子级 package 会显示全部相关的 commit
       * */ 
      context.commitGroups = nextCommitGroups;
      
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
      
      const idxA = scopeSequenceMap[a.title] ? scopeSequenceMap[a.title].idx : -1;
      const idxB = scopeSequenceMap[b.title] ? scopeSequenceMap[b.title].idx : -1;
      return idxA >= idxB ? 1 : -1;
    },
    commitsSort: config.commitsSort,
    noteGroupsSort: 'title',
    notesSort: compareFunc
  }
}

function computeScopeSequenceMap (config) {
  const scopeSequenceMap = {};
  if (Array.isArray(config.scopeSequence)) {
    config.scopeSequence.forEach((c, idx) => {
      const s = _.get(c, 'scope') || '';
      if (_.isString(s)) {
        scopeSequenceMap[s.replace(/^@(\w|-)+\//, '')] = {
          title: _.get(c, 'alias') || s,
          mixin: _.get(c, 'mixin') || false,
          idx
        };
      }
    });
  }
  return scopeSequenceMap;
}

function formatSubScope (config, commits) {
  const sortedCommits = commits.sort(functionify(config.commitsSort));
  const subScopeCommits = [];
  const recorder = {};
  sortedCommits.forEach(commit => {
    const subScope = commit.subScope || '';
    const idx = recorder[subScope]
    if (_.isNumber(idx) && idx >= 0) {
      subScopeCommits[idx].commits.push(commit);
    } else {
      const len = subScopeCommits.push({subScope, commits: [commit]});
      recorder[subScope] = len - 1;
    }
  });
  return subScopeCommits;
}