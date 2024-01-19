// Aa:matches([a], [b]):not([ccc], [ddd]):matches(.field:matches([child]):matches([child2]))
// {
//   subSelectors: [
//     {
//       type: 'or'
//       args: [
//         { 'Aa[a]' },
//         { 'Aa[b]' },
//       ]
//     },
//     {
//       type: 'not'
//       arg: {
//         type: 'or'
//         args: [
//           { 'Aa[ccc]' },
//           { 'Aa[ddd]' },
//         ]
//       }
//     },
//     {
//       type: 'or'
//       args: [
//         {
//           type: 'and'
//           args: [
//             { 'Aa.field[child]' },
//             { 'Aa.field[child2]' },
//           ]
//         }
//       ]
//     }
//   ]
// }
//
//
//
// [left]:matches(LogicalExpression, CallExpression > AssignmentExpression)
// [
//   {
//     type: 'or'
//     args: [
//       { 'LogicalExpression[left]' },
//       { AssignmentExpression & '[left]' },
//     ]
//   }
// ]

import type { Dnf } from './dnf'
import type { PatchMeta, WildcardMeta } from './merge-metas'
import type { MetaAcc, NeverError } from './utils'
import type { ParseIt } from '../parser'
import type {
  AST_NODE_TYPES,
  TSESTree,
} from '@typescript-eslint/typescript-estree'
import type { Simplify } from 'type-fest'

type TryToNarrowByExtracting<T, U> = Extract<T, U> extends never
  ? Extract<T, { [K in keyof U]: any }>
  : Extract<T, U>

type PickNode<T> = [T] extends [any]
  ? Extract<TSESTree.Node, { type: T }>
  : never

export declare const AttrValueIsUnsafeToIntersect: unique symbol
type AttrValueIsUnsafeToIntersect = typeof AttrValueIsUnsafeToIntersect

type FilterNodes<T> = NonNullable<T>['type'] extends AST_NODE_TYPES
  ? NonNullable<T>
  : NonNullable<T> extends [...infer Els]
    ? NonNullable<Els[number]>['type'] extends AST_NODE_TYPES
      ? NonNullable<Els[number]>
      : never
    : never

type ExtractChildDeps<Node> = NonNullable<
  {
    [K in keyof Node]: K extends 'parent' ? never : FilterNodes<Node[K]>
  }[keyof Node]
>

type TryToParseAttrValue<T> = T extends 'true'
  ? true
  : T extends 'false'
    ? false
    : T extends 'null'
      ? null
      : T extends 'undefined'
        ? undefined
        : AttrValueIsUnsafeToIntersect

// TODO: filter it before all to support :matches(...)[bbb]
type PreprocessCompoundSelector<
  Selectors extends any[],
  SelectorAcc extends MetaAcc,
  Acc extends any[] | null = null,
> = Selectors extends [infer Selector, ...infer Rest]
  ? Selector extends { type: 'wildcard' } | { type: 'class' } | { type: 'has' }
    ? PreprocessCompoundSelector<Rest, SelectorAcc, Acc>
    : Selector extends { type: 'identifier'; value: any }
      ? PatchMeta<
          SelectorAcc,
          'identifier',
          Selector['value']
        > extends infer PatchRes
        ? PatchRes extends MetaAcc
          ? PreprocessCompoundSelector<Rest, PatchRes, Acc>
          : NeverError<PatchRes>
        : never
      : Selector extends { type: 'attribute'; name: any }
        ? // TODO: add support for nested fields narrowing
          Selector['name'] extends `${string}.${string}`
          ? PreprocessCompoundSelector<Rest, SelectorAcc, Acc>
          : Selector extends { operator: any; value: any }
            ? Selector['value'] extends { type: 'literal'; value: any }
              ? Selector['operator'] extends '='
                ? TryToParseAttrValue<
                    Selector['value']['value']
                  > extends AttrValueIsUnsafeToIntersect
                  ? PreprocessCompoundSelector<Rest, SelectorAcc, Acc>
                  : PatchMeta<
                        SelectorAcc,
                        'extract',
                        {
                          [K in Selector['name']]: TryToParseAttrValue<
                            Selector['value']['value']
                          >
                        }
                      > extends infer PatchRes
                    ? PatchRes extends MetaAcc
                      ? PreprocessCompoundSelector<Rest, PatchRes, Acc>
                      : NeverError<PatchRes>
                    : never
                : PatchMeta<
                      SelectorAcc,
                      'exclude',
                      {
                        [K in Selector['name']]: TryToParseAttrValue<
                          Selector['value']['value']
                        >
                      }
                    > extends infer PatchRes
                  ? PatchRes extends MetaAcc
                    ? PreprocessCompoundSelector<Rest, PatchRes, Acc>
                    : NeverError<PatchRes>
                  : never
              : PreprocessCompoundSelector<Rest, SelectorAcc, Acc>
            : PatchMeta<
                  SelectorAcc,
                  'extract',
                  {
                    // https://github.com/estools/esquery/blob/909bea6745d33d33870b5d2c3382b4561d00d923/esquery.js#L221
                    // != null
                    [K in Selector['name']]:
                      | string
                      | number
                      | boolean
                      | symbol
                      | object
                  }
                > extends infer PatchRes
              ? PatchRes extends MetaAcc
                ? PreprocessCompoundSelector<Rest, PatchRes, Acc>
                : NeverError<PatchRes>
              : never
        : Selector extends { type: 'field'; name: any }
          ? PatchMeta<
              SelectorAcc,
              'field',
              Selector['name']
            > extends infer PatchRes
            ? PatchRes extends MetaAcc
              ? PreprocessCompoundSelector<Rest, PatchRes, Acc>
              : NeverError<PatchRes>
            : never
          : PreprocessCompoundSelector<
              Rest,
              SelectorAcc,
              [
                ...(Acc extends any[] ? Acc : []),
                PreprocessSelector<Selector, SelectorAcc>,
              ]
            >
  : Acc extends any[]
    ? Acc
    : [SelectorAcc]

type adfs = PreprocessSelector<
  //   ^?
  // ParseIt<':matches(:not(.init), .init)'>,
  ParseIt<'ExportNamedDeclaration.body:not([source])'>,
  WildcardMeta
>
type ddd = Dnf<adfs> // ['args'][0]['args']

type SplitConjunction<
  T,
  Acc extends {
    // field: string | null
    // notFields: string[]
    and: MetaAcc[]
    not: MetaAcc[]
  } = {
    // field: null
    // notFields: []
    and: []
    not: []
  },
> = T extends [infer First, ...infer Rest]
  ? First extends {
      type: 'not'
      arg: MetaAcc
    }
    ? SplitConjunction<
        Rest,
        // (First['arg']['field'] extends string
        //   ? { notFields: [...Acc['notFields'], First['arg']['field']] }
        //   : { notFields: Acc['notFields'] }) &
        {
          not: [...Acc['not'], First['arg']]
        } & Omit<Acc, /*'notFields' |*/ 'not'>
      >
    : First extends MetaAcc
      ? SplitConjunction<
          Rest,
          // TODO: error if fields dont match ( merge them )
          // (First['field'] extends string
          //   ? { field: First['field'] }
          //   : { field: Acc['field'] }) &
          {
            and: [...Acc['and'], First]
          } & Omit<Acc, /*'field' |*/ 'and'>
        >
      : never
  : Simplify<Acc>

type fdsaf = SplitConjunction<ddd['args'][0]['args']>

type PrecollapseCollectChildBoundaries<
  Boundary,
  Ctx extends { field: any | null },
> = Ctx['field'] extends null
  ? ExtractChildDeps<Boundary>
  : FilterNodes<Extract<Boundary, { [K in Ctx['field']]: any }>[Ctx['field']]>

type aasdfa = MatchSplittedConjunction<
  //    ^?
  TSESTree.Program,
  fdsaf
>

type ddafa = CollapsePositivesFromConjunction<TSESTree.Program, fdsaf['and']>

type MatchSplittedConjunction<Left, Splitted> = Extract<
  CollapsePositivesFromConjunction<Left, Splitted['and']>,
  CollapseNegativesFromConjunction<Left, Splitted['not']>
>

type CollapseNegativesFromConjunction<
  Left,
  Negatives,
  Acc = TSESTree.Node,
> = Negatives extends [infer First, ...infer Rest]
  ? First extends MetaAcc
    ? CollapseNegativesFromConjunction<
        Left,
        Rest,
        Exclude<
          Acc,
          Extract<
            PrecollapseCollectChildBoundaries<Left, { field: First['field'] }>,
            Exclude<
              TryToNarrowByExtracting<
                First['identifier'] extends null
                  ? TSESTree.Node
                  : PickNode<First['identifier']>,
                First['extract']
              >,
              First['exclude']
            >
          >
        >
      >
    : never
  : Acc

type CollapsePositivesFromConjunction<
  Left,
  Positives,
  Acc = PrecollapseCollectChildBoundaries<Left, { field: null }>,
> = Positives extends [infer First, ...infer Rest]
  ? First extends MetaAcc
    ? CollapsePositivesFromConjunction<
        Left,
        Rest,
        Extract<
          Acc,
          Extract<
            PrecollapseCollectChildBoundaries<Left, { field: First['field'] }>,
            Exclude<
              TryToNarrowByExtracting<
                First['identifier'] extends null
                  ? TSESTree.Node
                  : PickNode<First['identifier']>,
                First['extract']
              >,
              First['exclude']
            >
          >
        >
      >
    : never
  : Acc

type PostprocessDnf<D> = D extends {
  type: 'or'
  args: any[]
}
  ? q
  : NeverError<['D is not "or"', D]>

type CollapseChildRelations<Left, Right, Acc = []> = Right extends [
  infer First,
  ...infer Rest,
]
  ? CollapseChildRelations<
      Left,
      Rest,
      [...Acc, MatchSplittedConjunction<Left, SplitConjunction<First['args']>>]
    >
  : Acc

type collll = CollapseChildRelations<TSESTree.Program, ddd['args']>
//    ^?

type PreprocessSelectorsList<
  Selectors extends any[],
  SelectorAcc extends MetaAcc,
  Acc extends any[] = [],
> = Selectors extends [infer Selector, ...infer Rest]
  ? PreprocessSelectorsList<
      Rest,
      SelectorAcc,
      [...Acc, PreprocessSelector<Selector, SelectorAcc>]
    >
  : { type: 'or'; args: Acc }

export type PreprocessSelector<T, SelectorAcc extends MetaAcc> = T extends
  | { type: 'sibling' }
  | { type: 'adjacent' }
  | { type: 'descendant' }
  ? T extends { right: any }
    ? PreprocessSelector<T['right'], SelectorAcc>
    : never
  : T extends
        | { type: 'wildcard' }
        | { type: 'identifier' }
        | { type: 'attribute' }
        | { type: 'field' }
        | { type: 'class' }
        | { type: 'has' }
    ? PreprocessSelector<{ type: 'compound'; selectors: [T] }, SelectorAcc>
    : T extends { type: 'compound'; selectors: any }
      ? {
          type: 'and'
          args: PreprocessCompoundSelector<T['selectors'], SelectorAcc>
        }
      : T extends { type: 'child' }
        ? 'the most complicated thing'
        : T extends { type: 'matches'; selectors: any }
          ? PreprocessSelectorsList<T['selectors'], SelectorAcc>
          : T extends { type: 'not'; selectors: any }
            ? {
                type: 'not'
                arg: PreprocessSelectorsList<T['selectors'], SelectorAcc>
              }
            : NeverError<'not impleeemented'>
