import fs from 'node:fs'
import path from 'node:path'

import { buildTmpContext } from '../utils'

using tmpContext = buildTmpContext()

const { $, patchPackageJson, pathJoin, postProcessListeners } =
  tmpContext.cloneRepo('https://github.com/jest-community/eslint-plugin-jest')

fs.mkdirSync(pathJoin('.yarn', 'patches'))
fs.copyFileSync(
  path.join(__dirname, 'eslint.patch'),
  pathJoin('.yarn', 'patches', 'eslint-npm-8.56.0-6eec398a41.patch'),
)

patchPackageJson(pkgJson => {
  pkgJson.resolutions['eslint@^7.0.0 || ^8.0.0'] =
    'patch:eslint@npm%3A8.56.0#./.yarn/patches/eslint-npm-8.56.0-6eec398a41.patch'
})

$('yarn install')

$('yarn test --selectProjects test')

postProcessListeners('listeners', 'jest')
