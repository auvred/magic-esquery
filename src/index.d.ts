import type { MatchIt } from './matcher'
import type { ParseIt } from './parser'

export type Parse<Selector extends string> = ParseIt<Selector>
export type Match<SelectorAST, AST extends { type: string }> = MatchIt<
  SelectorAST,
  AST
>
export type Query<
  Selector extends string,
  AST extends { type: string },
> = Match<Parse<Selector>, AST>
