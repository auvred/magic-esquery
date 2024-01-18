import type { Equal, Expect } from '@type-challenges/utils'
import type { TSESTree } from '@typescript-eslint/typescript-estree'
import type { Simplify } from 'type-fest'

declare const NeverErrorSymbol: unique symbol
export type NeverError<Message = unknown> = [typeof NeverErrorSymbol, Message]

// defaults
//   extract: unknown
//   exclude: never
export interface MetaAcc {
  identifier: string | null
  field: string | null
  extract: any
  exclude: any
  inferredNodes: any | null
}

export type CarefullyIntersectNodes<
  L extends any | null,
  R extends any | null,
> = L extends null ? R : R extends null ? L : Extract<L, R>

export type IntersectAndSimplify<L, R> = unknown extends L
  ? R
  : unknown extends R
    ? L
    : Simplify<L & R>

// prettier-ignore
type _testCarefullyIntersectNodes = [
  Expect<Equal<CarefullyIntersectNodes<TSESTree.Literal | TSESTree.ExportDeclaration, TSESTree.Literal | TSESTree.ImportDeclaration>, TSESTree.Literal>>,
  Expect<Equal<CarefullyIntersectNodes<TSESTree.Node, TSESTree.Literal | TSESTree.ImportDeclaration>, TSESTree.Literal | TSESTree.ImportDeclaration>>,
  Expect<Equal<CarefullyIntersectNodes<TSESTree.Literal | TSESTree.ImportDeclaration, TSESTree.Node>, TSESTree.Literal | TSESTree.ImportDeclaration>>,
]
