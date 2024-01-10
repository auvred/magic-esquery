import type { ParseIt } from './parser'
import type { TSESTree } from '@typescript-eslint/typescript-estree'
import type { Simplify, UnionToIntersection } from 'type-fest'

type Distribute<U> = (U extends any ? { type: U } : never)['type']

type PickNode<T, AST> = Extract<AST, { type: T }>

type PostProcessCompoundSelectors<Selectors> = Simplify<
  UnionToIntersection<Extract<Selectors, { type: 'identifier' }>>
>

export type MatchIt<T, AST> = T extends {
  type: 'identifier'
  value: infer IdentifierName
}
  ? PickNode<IdentifierName, AST>
  : T extends {
        type: 'matches'
        selectors: infer Selectors
      }
    ? Selectors extends unknown[]
      ? MatchIt<Selectors[number], AST>
      : never
    : T extends {
          type: 'compound'
          selectors: infer Selectors
        }
      ? Selectors extends unknown[]
        ? MatchIt<PostProcessCompoundSelectors<Selectors[number]>, AST>
        : never
      : unknown

type Y = 'CallExpression[a], MemberExpression[a], CallExpression'

type Parsed = ParseIt<Y>
//    ^?

export declare const res: MatchIt<ParseIt<Y>, TSESTree.Node>
//                    ^?
