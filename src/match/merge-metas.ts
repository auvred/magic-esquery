import type {
  CarefullyIntersectNodes,
  IntersectAndSimplify,
  MetaAcc,
  NeverError,
} from './utils'
import type { Equal, Expect } from '../utils'
import type { TSESTree } from '@typescript-eslint/typescript-estree'

// TODO: lowercase them
export type MergeTwoMetaIdentifiers<
  L extends string | null,
  R extends string | null,
> = L extends null
  ? R
  : R extends null
    ? L
    : Equal<L, R> extends true
      ? L
      : // one selector can't contain two different identifiers
        NeverError<`different identifiers: ${L}, ${R}`>

// prettier-ignore
type _testMergeTwoMetaIdentifiers = [
  Expect<Equal<MergeTwoMetaIdentifiers<null, 'B'>, 'B'>>,
  Expect<Equal<MergeTwoMetaIdentifiers<'A', null>, 'A'>>,
  Expect<Equal<MergeTwoMetaIdentifiers<null, null>, null>>,
  Expect<Equal<MergeTwoMetaIdentifiers<'A', 'A'>, 'A'>>,
  Expect<Equal<MergeTwoMetaIdentifiers<'A', 'B'>, NeverError<'different identifiers: A, B'>>>,
]

// for now just skipping composite fields (probably we should add it, but it may violate perf)
type CheckMetaField<T, If = null, Else = T> = T extends `${string}.${string}`
  ? If
  : Else
export type MergeTwoMetaFields<
  L extends string | null,
  R extends string | null,
> = L extends null
  ? CheckMetaField<R>
  : R extends null
    ? CheckMetaField<L>
    : CheckMetaField<
        L,
        CheckMetaField<R>,
        CheckMetaField<
          R,
          L,
          Equal<L, R> extends true
            ? L
            : // one selector can't contain two different fields
              NeverError<`different fields: ${L}, ${R}`>
        >
      >

// prettier-ignore
type _testMergeTwoMetaFields = [
  Expect<Equal<MergeTwoMetaFields<null, 'B'>, 'B'>>,
  Expect<Equal<MergeTwoMetaFields<'A', null>, 'A'>>,
  Expect<Equal<MergeTwoMetaFields<null, null>, null>>,
  Expect<Equal<MergeTwoMetaFields<'A', 'A'>, 'A'>>,
  Expect<Equal<MergeTwoMetaFields<'A', 'B'>, NeverError<'different fields: A, B'>>>,
  
  Expect<Equal<MergeTwoMetaFields<null, 'B.B'>, null>>,
  Expect<Equal<MergeTwoMetaFields<'A.A', 'B'>, 'B'>>,
  Expect<Equal<MergeTwoMetaFields<'A', 'B.B'>, 'A'>>,
]

export type MergeTwoMetas<
  L extends MetaAcc,
  R extends MetaAcc,
> = MergeTwoMetaIdentifiers<
  L['identifier'],
  R['identifier']
> extends infer MergedIdentifiers
  ? MergedIdentifiers extends NeverError
    ? NeverError<MergedIdentifiers>
    : MergeTwoMetaFields<L['field'], R['field']> extends infer MergedFields
      ? MergedFields extends NeverError
        ? NeverError<MergedFields>
        : {
            identifier: MergedIdentifiers
            field: MergedFields
            extract: IntersectAndSimplify<L['extract'], R['extract']>
            exclude: L['exclude'] | R['exclude']
            inferredNodes: CarefullyIntersectNodes<
              L['inferredNodes'],
              R['inferredNodes']
            >
          }
      : NeverError
  : NeverError

// prettier-ignore
type _testMergeTwoMetas = [
  Expect<Equal<MergeTwoMetas<{
    identifier: null
    field: null
    extract: unknown
    exclude: never
    inferredNodes: null
  }, {
    identifier: null
    field: null
    extract: unknown
    exclude: never
    inferredNodes: null
  }>, {
    identifier: null
    field: null
    extract: unknown
    exclude: never
    inferredNodes: null
  }>>,
  Expect<Equal<MergeTwoMetas<{
    identifier: 'A'
    field: null
    extract: {
      computed: false
    }
    exclude: {
      string: string | number | boolean | symbol | object
    }
    inferredNodes: TSESTree.BigIntLiteral | TSESTree.BooleanLiteral | TSESTree.ClassDeclarationWithName
  }, {
    identifier: null
    field: 'field'
    extract: {
      bigint: string | number | boolean | symbol | object
    }
    exclude: {
      computed: true
    }
    inferredNodes: TSESTree.Literal | TSESTree.ImportSpecifier
  }>, {
    identifier: 'A'
    field: 'field'
    extract: {
      computed: false
      bigint: string | number | boolean | symbol | object
    }
    exclude: {
      string: string | number | boolean | symbol | object
    } | {
      computed: true
    }
    inferredNodes: TSESTree.BigIntLiteral | TSESTree.BooleanLiteral
  }>>,
]

export type PatchMeta<
  T extends MetaAcc,
  Field extends keyof MetaAcc,
  Value,
> = MergeTwoMetas<
  T,
  { [K in Field]: Value } & Omit<WildcardMeta, Field> extends infer Res
    ? Res extends MetaAcc
      ? Res
      : never
    : never
>

export type WildcardMeta = {
  identifier: null
  field: null
  extract: unknown
  exclude: never
  inferredNodes: null
}
