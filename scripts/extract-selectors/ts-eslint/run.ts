import fs from 'node:fs'
import path from 'node:path'

import { buildTmpContext } from '../utils'

using tmpContext = buildTmpContext()

const { $, patchPackageJson, pathJoin, postProcessListeners } =
  tmpContext.cloneRepo('https://github.com/typescript-eslint/typescript-eslint')

fs.copyFileSync(
  path.join(__dirname, 'eslint.patch'),
  pathJoin('.yarn', 'patches', 'eslint-npm-8.48.0-0dd1c36629.patch'),
)

patchPackageJson(pkgJson => {
  pkgJson.resolutions['eslint@*'] = pkgJson.resolutions['eslint@^8.47.0'] =
    'patch:eslint@npm%3A8.48.0#./.yarn/patches/eslint-npm-8.48.0-0dd1c36629.patch'
})

$('yarn install')

const eslintPluginDir = path.join('packages', 'eslint-plugin')
$('yarn test tests/rules', { cwd: eslintPluginDir })

postProcessListeners(path.join(eslintPluginDir, 'listeners'), 'ts-eslint')
