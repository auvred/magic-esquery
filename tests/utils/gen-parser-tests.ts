import fs from 'node:fs'
import path from 'node:path'

import esquery from 'esquery'

import { selectors as manualSelectors } from './selectors-for-parser-tests'

function stringify(arg: unknown): string {
  return JSON.stringify(arg, (_, value) => {
    if (value instanceof RegExp) {
      return value.toString()
    }
    return value
  })
}

function genFromSelectors(fileName: string, selectors: string[]): void {
  let content = `import type { Expect, Equal } from '@type-challenges/utils'
import type { ParseIt } from '../../src/parser'

export type TestCases = [
`

  for (const selector of selectors) {
    const stringifiedSelector = stringify(selector)
    try {
      const parsed = esquery.parse(selector)
      content += `Expect<Equal<ParseIt<${stringifiedSelector}>, ${stringify(
        parsed,
      )}>>,\n`
    } catch (e) {
      console.error(`Err while parsing ${stringifiedSelector}`)
      throw e
    }
  }

  content += ']'

  fs.writeFileSync(path.join(__dirname, '..', 'types', fileName), content, {
    encoding: 'utf8',
  })
}

genFromSelectors('parse.generated-test.ts', manualSelectors)

const tsEslintSelectors = fs
  .readFileSync(path.join(__dirname, 'ts-eslint-selectors.txt'), 'utf8')
  .split('\n')
  .filter(selector => {
    const sel = selector.trim()
    return sel && !sel.startsWith('#')
  })
genFromSelectors('ts-eslint-parse.generated-test.ts', tsEslintSelectors)
