import type { Dnf } from './match/dnf'
import type { WildcardMeta } from './match/merge-metas'
import type {
  CollapseChildRelations,
  LeftIsAny,
  PreprocessSelector,
} from './match/preprocess'

export type MatchIt<T> = CollapseChildRelations<
  LeftIsAny,
  Dnf<PreprocessSelector<T, WildcardMeta>>['args']
>
