import type { Dnf } from './match/dnf'
import type { WildcardMeta } from './match/merge-metas'
import type {
  CollapseChildRelations,
  LeftIsAny,
  PreprocessSelector,
} from './match/preprocess'

export type MatchIt<T, AST extends { type: any }> = CollapseChildRelations<
  LeftIsAny,
  Dnf<PreprocessSelector<T, WildcardMeta, AST>> extends infer Res
    ? Res extends { args: any[] }
      ? Res['args']
      : never
    : never,
  AST
>
