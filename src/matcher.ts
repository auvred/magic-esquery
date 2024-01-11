import type { ParseIt } from './parser'
import type { TSESTree } from '@typescript-eslint/typescript-estree'
import type { Simplify, UnionToIntersection } from 'type-fest'

type Distribute<U> = (U extends any ? { type: U } : never)['type']

type PickNode<T, AST> = Extract<AST, { type: T }>

type PostProcessCompoundSelectors<Selectors> = Simplify<
  UnionToIntersection<Extract<Selectors, { type: 'identifier' }>>
>

type PostProcessChildWithField<Left, Right> =
  Right extends `${infer Path}.${infer Rest}`
    ? Extract<Left, { [K in Path]: any }> extends infer ExtractRes
      ? ExtractRes extends never
        ? `Right (${Right}) is not a keyof Prev`
        : PostProcessChildWithField<ExtractRes[Path], Rest>
      : never
    : Right extends ''
      ? Left
      : Extract<Left, { [K in Right]: any }> extends infer ExtractRes
        ? ExtractRes extends never
          ? `Right is not a keyof Prev`
          : ExtractRes[Right]
        : never

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
      : T extends {
            type: 'child'
            left: infer Left
            right: infer Right
          }
        ? Right extends {
            type: 'field'
            name: infer RightName
          }
          ? PostProcessChildWithField<MatchIt<Left, AST>, RightName>
          : MatchIt<Right, AST>
        : T extends {
              type: 'wildcard'
            }
          ? AST
          : unknown

type Y = 'MemberExpression > Identifier'

type Parsed = ParseIt<Y>
//    ^?

export declare const res: MatchIt<Parsed, TSESTree.Node>
//                    ^?
