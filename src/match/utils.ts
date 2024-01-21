import type { Simplify } from '../utils'

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

export type TryToNarrowByExtracting<T, U> =
  Extract<T, U> extends never
    ? Extract<T, { [K in keyof U]: any }>
    : Extract<T, U>

export type FilterNodes<T, AST extends { type: any }> =
  NonNullable<T> extends infer NonNullableT
    ? NonNullableT extends {
        type: AST['type']
      }
      ? NonNullableT
      : NonNullableT extends [...infer Elements]
        ? NonNullable<Elements[number]> extends {
            type: AST['type']
          }
          ? NonNullable<Elements[number]>
          : never
        : never
    : never

export type ExtractChildDeps<T, AST extends { type: any }> = NonNullable<
  {
    [K in keyof T]: K extends 'parent' ? never : FilterNodes<T[K], AST>
  }[keyof T]
>

export type PickNode<T, AST> = [T] extends [any]
  ? Extract<AST, { type: T }>
  : never

declare const _AttrValueIsUnsafeToIntersect: unique symbol
export type AttrValueIsUnsafeToIntersect = typeof _AttrValueIsUnsafeToIntersect

export type TryToParseAttrValue<T> = T extends 'true'
  ? true
  : T extends 'false'
    ? false
    : T extends 'null'
      ? null
      : T extends 'undefined'
        ? undefined
        : AttrValueIsUnsafeToIntersect

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
