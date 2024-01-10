import cp from 'node:child_process'
import crypto from 'node:crypto'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'

const tmpdir = path.join(
  os.tmpdir(),
  `ts-eslint-${crypto.randomUUID().slice(0, 8)}`,
)

function $(
  cmd: string,
  {
    cwd = process.cwd(),
    stdio = 'inherit',
  }: { cwd?: string; stdio?: cp.StdioOptions } = {},
): cp.SpawnSyncReturns<string> {
  console.log(`\n[${cwd}] >>>  ${cmd}\n`)
  return cp.spawnSync(cmd, { shell: true, stdio, encoding: 'utf8', cwd })
}

try {
  $(
    `git clone --depth 1 --single-branch https://github.com/typescript-eslint/typescript-eslint ${tmpdir}`,
  )

  fs.copyFileSync(
    path.join(__dirname, 'eslint.patch'),
    path.join(tmpdir, '.yarn', 'patches', 'eslint-npm-8.48.0-0dd1c36629.patch'),
  )

  const pkgJsonPath = path.join(tmpdir, 'package.json')
  const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'))
  pkgJson.resolutions['eslint@*'] = pkgJson.resolutions['eslint@^8.47.0'] =
    'patch:eslint@npm%3A8.48.0#./.yarn/patches/eslint-npm-8.48.0-0dd1c36629.patch'
  fs.writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2))

  $('yarn install', { cwd: tmpdir })

  const eslintPluginDir = path.join(tmpdir, 'packages', 'eslint-plugin')
  $('yarn test tests/rules', { cwd: eslintPluginDir })

  $(
    `cat listeners | xargs --delimiter '\n' | jq -r '.[]' | sort -u > out-listeners`,
    {
      cwd: eslintPluginDir,
    },
  )

  const newlyGeneratedSelectors = fs
    .readFileSync(path.join(eslintPluginDir, 'out-listeners'), 'utf8')
    .split('\n')

  const tsEslintSelectorsPath = path.join(
    __dirname,
    '..',
    '..',
    'tests',
    'utils',
    'ts-eslint-selectors.txt',
  )

  const tsEslintSelectors = fs.existsSync(tsEslintSelectorsPath)
    ? fs.readFileSync(tsEslintSelectorsPath, 'utf8').split('\n')
    : []

  const newSelectors = newlyGeneratedSelectors
    .filter(selector => {
      const sel = selector.trim()
      if (!sel) {
        return false
      }
      return !tsEslintSelectors.includes(selector)
    })
    .map(selector => [selector, '  TODO_Replace_with_actual_type'])
  const tsEslintRev = $('git rev-parse HEAD', {
    cwd: tmpdir,
    stdio: 'pipe',
  }).stdout.trim()
  tsEslintSelectors.push(`# ${tsEslintRev}`, ...newSelectors.flat(20), '')

  fs.writeFileSync(tsEslintSelectorsPath, tsEslintSelectors.join('\n'))
} finally {
  fs.rmSync(tmpdir, { recursive: true, force: true })
}
