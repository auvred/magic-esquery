import type { MatchIt } from './matcher'
import type { ParseIt } from './parser'

export type Parse<Query extends string> = ParseIt<Query>
export type Match<Selector, AST extends { type: string }> = MatchIt<
  Selector,
  AST
>
