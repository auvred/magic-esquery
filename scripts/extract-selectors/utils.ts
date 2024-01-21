import cp from 'node:child_process'
import crypto from 'node:crypto'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'

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

export interface ClonedRepoHandle {
  $: (
    cmd: string,
    options?: { cwd?: string; stdio?: cp.StdioOptions },
  ) => cp.SpawnSyncReturns<string>
  pathJoin: (...paths: string[]) => string
  patchPackageJson: (patcher: (content: any) => void) => void
  postProcessListeners: (
    listenersFilePath: string,
    destinationKey: string,
  ) => void
}
export interface TmpContext extends Disposable {
  tmpdir: () => string
  cloneRepo: (url: string) => ClonedRepoHandle
}

export function buildTmpContext(): TmpContext {
  const tmpDirs: string[] = []

  function tmpdir(): string {
    const dirpath = path.join(
      os.tmpdir(),
      `magic-esquery-${crypto.randomUUID().slice(0, 8)}`,
    )
    tmpDirs.push(dirpath)

    return dirpath
  }
  return {
    tmpdir,
    cloneRepo(url): ClonedRepoHandle {
      const repoPath = tmpdir()

      $(`git clone --depth 1 --single-branch ${url} ${repoPath}`)

      function pathJoin(...paths: string[]): string {
        return path.join(repoPath, ...paths)
      }

      // eslint-disable-next-line func-style
      const $local: typeof $ = (cmd, options) => {
        return $(cmd, {
          ...options,
          cwd: options?.cwd ? pathJoin(options.cwd) : repoPath,
        })
      }

      return {
        pathJoin,
        $: $local,
        patchPackageJson(patcher): void {
          const pkgJsonPath = pathJoin('package.json')
          const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'))
          patcher(pkgJson)
          fs.writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2))
        },
        postProcessListeners(listenersFilePath, destinationKey): void {
          const outPath = pathJoin('out-listeners')
          $local(
            `cat listeners | xargs --delimiter '\n' | jq -r '.[]' | sort -u > ${outPath}`,
            { cwd: path.dirname(listenersFilePath) },
          )
          const existingSelectorsPath = path.join(
            __dirname,
            '..',
            '..',
            'tests',
            'utils',
            `${destinationKey}-selectors.txt`,
          )

          const existingSelectors = fs.existsSync(existingSelectorsPath)
            ? fs.readFileSync(existingSelectorsPath, 'utf8').split('\n')
            : []

          const newSelectors = fs
            .readFileSync(outPath, 'utf8')
            .split('\n')
            .filter(selector => {
              const sel = selector.trim()
              if (!sel) {
                return false
              }
              return !existingSelectorsPath.includes(selector)
            })
            .map(selector => [selector, '  TODO_Replace_with_actual_type'])
            .flat(20)

          if (newSelectors.length === 0) {
            return
          }

          const rev = $local('git rev-parse HEAD', {
            stdio: 'pipe',
          }).stdout.trim()

          existingSelectors.push(`# ${rev}`, ...newSelectors.flat(20), '')

          fs.writeFileSync(existingSelectorsPath, existingSelectors.join('\n'))
        },
      }
    },
    [Symbol.dispose](): void {
      for (const dirPath of tmpDirs) {
        fs.rmSync(dirPath, { recursive: true, force: true })
      }
    },
  }
}
