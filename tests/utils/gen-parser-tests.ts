import fs from 'node:fs'
import path from 'node:path'

import esquery from 'esquery'

import { queries } from './queries-for-parser-tests'

let content = `import type { Expect, Equal } from '@type-challenges/utils'
import type { ParseIt } from '../../src/hhh'

export type TestCases = [
`

function stringify(arg: unknown): string {
  return JSON.stringify(arg, (_, value) => {
    if (value instanceof RegExp) {
      return value.toString()
    }
    return value
  })
}

for (const query of queries) {
  const stringifiedQuery = stringify(query)
  try {
    const parsed = esquery.parse(query)
    content += `Expect<Equal<ParseIt<${stringifiedQuery}>, ${stringify(
      parsed,
    )}>>,\n`
  } catch (e) {
    console.error(`Err while parsing ${stringifiedQuery}`)
    throw e
  }
}

content += ']'

fs.writeFileSync(
  path.join(__dirname, '..', 'types', 'parse.test.ts'),
  content,
  { encoding: 'utf8' },
)
