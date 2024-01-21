import fs from 'node:fs'
import path from 'node:path'

import { buildTmpContext } from '../utils'

using tmpContext = buildTmpContext()

const { $, patchPackageJson, pathJoin, postProcessListeners } =
  tmpContext.cloneRepo('https://github.com/eslint-stylistic/eslint-stylistic')

fs.mkdirSync(pathJoin('patches'))
fs.copyFileSync(
  path.join(__dirname, 'eslint.patch'),
  pathJoin('patches', 'eslint@8.56.0.patch'),
)

patchPackageJson(pkgJson => {
  const pnpm = pkgJson.pnpm || (pkgJson.pnpm = {})
  const patchedDependencies =
    pnpm.patchedDependencies || (pnpm.patchedDependencies = {})
  patchedDependencies['eslint@8.56.0'] = 'patches/eslint@8.56.0.patch'
})

$('pnpm install')

$('pnpm run test --run')

postProcessListeners('listeners', 'eslint-stylistic')
