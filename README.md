<h1 align="center">🪄 magic-esquery</h1>

<p align="center">
<a target="_blank" href="https://npmjs.com/package/magic-esquery"><img alt="NPM Version" src="https://badgen.net/npm/v/magic-esquery"></a>
<a target="_blank" href="https://img.shields.io/github/license/auvred/magic-esquery"><img alt="License: MIT" src="https://img.shields.io/github/license/auvred/magic-esquery"></a>
<a target="_blank" href="https://packagephobia.com/result?p=magic-esquery"><img alt="Install size" src="https://packagephobia.now.sh/badge?p=magic-esquery"></a>
</p>

<p align="center">Type level <a target="_blank" href="https://github.com/estools/esquery">ESQuery</a> selector parser and matcher!</p>

<p align="center"><i><b><a target="_blank" href="https://www.typescriptlang.org/play?target=99&moduleResolution=99&module=199&jsx=0&inlineSourceMap=true#code/JYWwDg9gTgLgBDAnmApnA3nAigVxVROAXzgDMoIQ4ByEAQwHNgBjAWhQGcBHPA6gKFCRYCZGkwAVAMoBRKRKgo0JcpRoABJKg7MowMDHYcANsAB2MAPRbOu-Yc4xFKanH78bcRRwCMcALzYvIgAPNQAsiggAEb4MgAeYN4cwBBm1AA0cNJyCkoAdAByEAAmKAB8-JaWcLUAegD87p7eAEwBQfihEVGxUAlJnClpANrMlGA4MCgl-k54ALqZ2bLyzkWlFVU19U0eYl6cAMwduF1hAFz0MMwAFpwAFJExcYnJqWYXZhAwD2MTUxmcygiwAlFkAMJ0YzGAbvNJwcpwfLMaHGJQjMx0EAoBag5Y5NYFYplSrVWpwRpAA">✨ Try it out in the TypeScript Playground</a></i></b></p>

<img src="https://raw.githubusercontent.com/auvred/magic-esquery/main/docs/magic-esquery.png" alt="magic-esquery">

## Installation

```
npm i magic-esquery
```

## Usage

Currently the library exports only `Query`, `Match` and `Parse` types.

- `Parse` - parse selector into Selector AST

```ts
import type { Parse } from 'magic-esquery'

type res = Parse<'CallExpression'>
//   ^? type res = { type: "identifier"; value: "CallExpression" }
```

- `Match` - infer the AST Node type based on Selector AST

```ts
import type { TSESTree } from '@typescript-eslint/typescript-estree'
import type { Match } from 'magic-esquery'

type res = Match<{ type: 'identifier'; value: 'CallExpression' }, TSESTree.Node>
//   ^? type res = TSESTree.CallExpression
```

- `Query` - parse selector and infer AST Node type (basically `Parse` + `Match`)

```ts
import type { TSESTree } from '@typescript-eslint/typescript-estree'
import type { Query } from 'magic-esquery'

type res = Query<'CallExpression', TSESTree.Node>
//   ^? type res = TSESTree.CallExpression
```

## Features

This package is tested on selectors used in [`@typescript-eslint/eslint-plugin`](https://typescript-eslint.io/), [`@stylistic/eslint-plugin`](https://eslint.style/), [`eslint-plugin-jest`](https://github.com/jest-community/eslint-plugin-jest).

Check out the current ecosystem test suites [here](./tests/ecosystem/tests).

You can also check out additional tests for [matcher](./tests/types/match.test.ts) and [parser](./tests/types/parse.generated-test.ts).

### Highlights

- All [ESQuery grammars](https://github.com/estools/esquery/blob/909bea6745d33d33870b5d2c3382b4561d00d923/grammar.pegjs) are supported except `:first-child`, `:last-child`, `:nth-child` and `:nth-last-child`. They're not widely used. But if anyone wants `magic-esquery` to support them, issues/prs are welcome!
- Enhanced child type inference (`CallExpression > .callee`)
- Any combination of `:matches` and `:not` should work correctly, regardless of nesting combinations

## License

[MIT](./LICENSE)
