import fs from 'node:fs'
import path from 'node:path'

function stringify(arg: unknown): string {
  return JSON.stringify(arg, (_, value) => {
    if (value instanceof RegExp) {
      return value.toString()
    }
    return value
  })
}

function genFromPairs(fileName: string, pairs: [string, string][]): void {
  let content = `import type { MatchIt } from '../../src/matcher'
import type { ParseIt } from '../../src/parser'
import type { Equal, Expect } from '@type-challenges/utils'
import type { TSESTree as T } from '@typescript-eslint/typescript-estree'

type Match<_T extends string> = MatchIt<ParseIt<_T>/*, T.Node*/>

export type TestCases = [
`

  for (const [selector, types] of pairs) {
    const stringifiedSelector = stringify(selector)
    content += `Expect<Equal<Match<${stringifiedSelector}>, ${types}>>,\n`
  }

  content += ']'

  fs.writeFileSync(path.join(__dirname, '..', 'types', fileName), content, {
    encoding: 'utf8',
  })
}

const lines = fs
  .readFileSync(path.join(__dirname, 'ts-eslint-selectors.txt'), 'utf8')
  .split('\n')
const pairs: [string, string][] = []
for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
  const line = lines[lineIndex]
  if (typeof line === 'undefined') {
    throw new Error('line is undefined')
  }
  if (!line.trim() || line.startsWith('#')) {
    continue
  }

  const nextLine = lines[lineIndex + 1]
  if (!nextLine) {
    throw new Error('nextLine is falsy')
  }
  if (!nextLine.startsWith('  ')) {
    throw new Error('nextLine is not starts with two spaces')
  }

  pairs.push([line, nextLine.slice(2)])
  lineIndex++
}
genFromPairs('ts-eslint-matcher.generated-test.ts', pairs)
