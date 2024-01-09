import fs from 'node:fs'
import path from 'node:path'

import esquery from 'esquery'

import { queries } from './queries.test'

let content = `import type { Expect, Equal } from './utils'
import type { ParseIt } from '../../src/hhh'

export type TestCases = [
`

for (const query of queries) {
  try {
    const parsed = esquery.parse(query)
    content += `Expect<Equal<ParseIt<${JSON.stringify(
      query,
    )}>, ${JSON.stringify(parsed)}>>,\n`
  } catch (e) {
    console.error(`Err while parsing ${JSON.stringify(query)}`)
    throw e
  }
}

content += ']'

fs.writeFileSync(path.join(__dirname, 'test.ts'), content, {})
