import fs from 'node:fs'
import path from 'node:path'

import esquery from 'esquery'

import { selectors as manualSelectors } from './selectors-for-parser-tests'

const ECOSYSTEM_SOURCES_DIR = path.join(__dirname, '..', 'ecosystem', 'sources')
const ECOSYSTEM_TESTS_DIR = path.join(__dirname, '..', 'ecosystem', 'tests')
const SRC_DIR_PATH = path.join(__dirname, '..', 'src')

function srcPathRelativeFrom(from: string): string {
  return path.relative(from, SRC_DIR_PATH)
}

function stringify(arg: unknown): string {
  return JSON.stringify(arg, (_, value) => {
    if (value instanceof RegExp) {
      return value.toString()
    }
    return value
  })
}

function genMatcherTestsFromPairs(
  destPath: string,
  pairs: [string, string][],
): void {
  const srcPath = srcPathRelativeFrom(destPath)
  const matcherPath = JSON.stringify(path.join(srcPath, 'matcher'))
  const parserPath = JSON.stringify(path.join(srcPath, 'parser'))
  const utilsPath = JSON.stringify(path.join(srcPath, 'utils'))
  let content = `import type { MatchIt } from ${matcherPath}
import type { ParseIt } from ${parserPath}
import type { Equal, Expect } from ${utilsPath}
import type { TSESTree as T } from '@typescript-eslint/typescript-estree'

type Match<_T extends string> = MatchIt<ParseIt<_T>, T.Node>

export type TestCases = [
`

  for (const [selector, types] of pairs) {
    const stringifiedSelector = stringify(selector)
    content += `Expect<Equal<Match<${stringifiedSelector}>, ${types}>>,\n`
  }

  content += ']'

  fs.writeFileSync(destPath, content, {
    encoding: 'utf8',
  })
}

function genParserTestsFromSelectors(
  destPath: string,
  selectors: string[],
): void {
  const srcPath = srcPathRelativeFrom(destPath)
  const utilsPath = JSON.stringify(path.join(srcPath, 'utils'))
  const parserPath = JSON.stringify(path.join(srcPath, 'parser'))
  let content = `import type { Expect, Equal } from ${utilsPath}
import type { ParseIt } from ${parserPath}

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

  fs.writeFileSync(destPath, content, {
    encoding: 'utf8',
  })
}

for (const txtSelector of ['ts-eslint', 'eslint-stylistic', 'jest']) {
  // matcher tests
  const lines = fs
    .readFileSync(
      path.join(ECOSYSTEM_SOURCES_DIR, `${txtSelector}.txt`),
      'utf8',
    )
    .split('\n')

  // matcher tests
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
  genMatcherTestsFromPairs(
    path.join(ECOSYSTEM_TESTS_DIR, `${txtSelector}.matcher.generated-test.ts`),
    pairs,
  )

  // parser tests
  const selectors = lines.filter(sel => {
    return sel.trim() && !sel.startsWith('  ') && !sel.startsWith('#')
  })
  genParserTestsFromSelectors(
    path.join(ECOSYSTEM_TESTS_DIR, `${txtSelector}.parse.generated-test.ts`),
    selectors,
  )
}

genParserTestsFromSelectors(
  path.join(__dirname, '..', 'types', 'parse.generated-test.ts'),
  manualSelectors,
)
