import type { Equal, Expect, Simplify } from '../utils'
import type {
  AST_NODE_TYPES,
  TSESTree,
} from '@typescript-eslint/typescript-estree'

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

export type TryToNarrowByExtracting<T, U> = Extract<T, U> extends never
  ? Extract<T, { [K in keyof U]: any }>
  : Extract<T, U>

// prettier-ignore
type _testTryToNarrowByExtracting = [
  Expect<Equal<TryToNarrowByExtracting<{type: 'a'} | {type: 'b'} | {withoutType: 'c'}, {type: 'd'}>, {type: 'a'} | {type: 'b'}>>,
  Expect<Equal<TryToNarrowByExtracting<{type: 'a'} | {type: 'b'} | {withoutType: 'c'}, {type: 'a'}>, {type: 'a'}>>,
]

export type FilterNodes<T> = NonNullable<T> extends infer NonNullableT
  ? NonNullableT extends {
      type: AST_NODE_TYPES
    }
    ? NonNullableT
    : NonNullableT extends [...infer Elements]
      ? NonNullable<Elements[number]> extends {
          type: AST_NODE_TYPES
        }
        ? NonNullable<Elements[number]>
        : never
      : never
  : never

// prettier-ignore
type _testFilterNodes = [
  Expect<Equal<FilterNodes<TSESTree.CallExpression | TSESTree.MemberExpression>, TSESTree.CallExpression | TSESTree.MemberExpression>>,
  Expect<Equal<FilterNodes<TSESTree.CallExpression[] | TSESTree.MemberExpression[]>, TSESTree.CallExpression | TSESTree.MemberExpression>>,
  Expect<Equal<FilterNodes<(TSESTree.CallExpression | TSESTree.MemberExpression)[]>, TSESTree.CallExpression | TSESTree.MemberExpression>>,
]

export type ExtractChildDeps<T> = NonNullable<
  {
    [K in keyof T]: K extends 'parent' ? never : FilterNodes<T[K]>
  }[keyof T]
>

// prettier-ignore
type _testExtractChildDeps = [
  Expect<Equal<ExtractChildDeps<TSESTree.CallExpression>, TSESTree.LeftHandSideExpression | TSESTree.CallExpressionArgument | TSESTree.TSTypeParameterInstantiation | TSESTree.TSTypeParameterInstantiation>>,
  Expect<Equal<ExtractChildDeps<TSESTree.Program>, TSESTree.ProgramStatement>>,
]

export type PickNode<T> = [T] extends [any]
  ? Extract<TSESTree.Node, { type: T }>
  : never

// prettier-ignore
type _testPickNode = [
  Expect<Equal<PickNode<'CallExpression'>, TSESTree.CallExpression>>,
  Expect<Equal<PickNode<'ExportNamedDeclaration'>, TSESTree.ExportNamedDeclaration>>,
  Expect<Equal<PickNode<'something'>, never>>,
]

declare const AttrValueIsUnsafeToIntersect: unique symbol
export type AttrValueIsUnsafeToIntersect = typeof AttrValueIsUnsafeToIntersect

export type TryToParseAttrValue<T> = T extends 'true'
  ? true
  : T extends 'false'
    ? false
    : T extends 'null'
      ? null
      : T extends 'undefined'
        ? undefined
        : AttrValueIsUnsafeToIntersect

// prettier-ignore
type _testTryToParseAttrValue = [
  Expect<Equal<TryToParseAttrValue<'true'>, true>>,
  Expect<Equal<TryToParseAttrValue<'false'>, false>>,
  Expect<Equal<TryToParseAttrValue<'null'>, null>>,
  Expect<Equal<TryToParseAttrValue<'undefined'>, undefined>>,
  Expect<Equal<TryToParseAttrValue<'something'>, AttrValueIsUnsafeToIntersect>>,
]

export type PreprocessExtract<T> = {
  extract: {
    [K in keyof T]: T[K] extends boolean ? boolean : T[K]
  }
  exclude: {
    [K in keyof T]: T[K] extends boolean
      ? T[K] extends true
        ? false
        : true
      : never
  }
}
