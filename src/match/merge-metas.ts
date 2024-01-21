import type {
  CarefullyIntersectNodes,
  IntersectAndSimplify,
  MetaAcc,
  NeverError,
} from './utils'
import type { Equal } from '../utils'

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
