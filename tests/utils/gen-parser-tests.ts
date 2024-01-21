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
  let content = `import type { Expect, Equal } from '../../src/utils'
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

for (const txtSelector of ['ts-eslint', 'eslint-stylistic', 'jest']) {
  const selectors = fs
    .readFileSync(path.join(__dirname, `${txtSelector}-selectors.txt`), 'utf8')
    .split('\n')
    .filter(sel => {
      return sel.trim() && !sel.startsWith('  ') && !sel.startsWith('#')
    })
  genFromSelectors(`${txtSelector}-parse.generated-test.ts`, selectors)
}
