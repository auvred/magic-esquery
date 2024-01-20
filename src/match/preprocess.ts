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
import type {
  AttrValueIsUnsafeToIntersect,
  ExtractChildDeps,
  FilterNodes,
  MetaAcc,
  NeverError,
  PickNode,
  PreprocessExtract,
  TryToNarrowByExtracting,
  TryToParseAttrValue,
} from './utils'
import type { ParseIt } from '../parser'
import type { Equal } from '@type-challenges/utils'
import type { TSESTree } from '@typescript-eslint/typescript-estree'
import type { Simplify } from 'type-fest'

type PrepreprocessCompoundSelector<
  Selectors extends any[],
  SelectorAcc extends MetaAcc,
  Acc extends {
    selectors: any[]
    matches: any[]
    nots: any[]
  } = {
    selectors: []
    matches: []
    nots: []
  },
> = Selectors extends [infer Selector, ...infer Rest]
  ? Selector extends { type: 'matches' }
    ? PrepreprocessCompoundSelector<
        Rest,
        SelectorAcc,
        { matches: [...Acc['matches'], Selector] } & Omit<Acc, 'matches'>
      >
    : Selector extends { type: 'not' }
      ? PrepreprocessCompoundSelector<
          Rest,
          SelectorAcc,
          { nots: [...Acc['nots'], Selector] } & Omit<Acc, 'nots'>
        >
      : PrepreprocessCompoundSelector<
          Rest,
          SelectorAcc,
          { selectors: [...Acc['selectors'], Selector] } & Omit<
            Acc,
            'selectors'
          >
        >
  : Acc['matches'] extends [infer _, ...infer __]
    ? PreprocessCompoundSelector<
        // [...Acc['selectors'], ...Acc['matches'], ...Acc['nots']],
        [
          ...(Acc['matches'] extends [infer _, ...infer __]
            ? [
                {
                  type: 'matches'
                  selectors: [{ type: 'compound'; selectors: Acc['selectors'] }]
                },
              ]
            : Acc['nots'] extends [infer _, ...infer __]
              ? [
                  {
                    type: 'matches'
                    selectors: [
                      { type: 'compound'; selectors: Acc['selectors'] },
                    ]
                  },
                ]
              : Acc['selectors']),

          ...Acc['matches'],
          ...Acc['nots'],

          // ...Acc['selectors'],
          // TODO: yep yep
          // ...(Acc['matches'] extends [infer _, ...infer __]
          //   ? [
          //       {
          //         type: 'matches'
          //         selectors: [{ type: 'compound'; selectors: Acc['selectors'] }]
          //       },
          //       ...Acc['matches'],
          //     ]
          //   : []),
          // ...(Acc['matches'] extends [infer _, ...infer __]
          //   ? [
          //       {
          //         type: 'matches'
          //         selectors: [{ type: 'compound'; selectors: Acc['selectors'] }]
          //       },
          //       ...Acc['matches'],
          //     ]
          //   : []),
        ],
        SelectorAcc
      >
    : PreprocessCompoundSelector<
        [
          ...Acc['selectors'],
          ...(Acc['nots'] extends [infer _, ...infer __]
            ? [
                {
                  type: 'matches'
                  selectors: [{ type: 'compound'; selectors: Acc['selectors'] }]
                },
                ...Acc['nots'],
              ]
            : []),
        ],
        SelectorAcc
      >

type sdafsdfaweeqefew = ParseIt<':matches(aa[bb])'>

type eirqweri1 = PrepreprocessCompoundSelector<
  ParseIt<'MemberExpression:matches(MemberExpression):not([bb])'>['selectors'],
  WildcardMeta
>
type eirqweri2 = PrepreprocessCompoundSelector<
  ParseIt<'MemberExpression:not([bb])'>['selectors'],
  WildcardMeta
>
// TODO: ^ they should be equal

type aaabfd = Equal<eirqweri1, eirqweri2>

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
                  > extends infer AttrValue
                  ? AttrValue extends AttrValueIsUnsafeToIntersect
                    ? PreprocessCompoundSelector<Rest, SelectorAcc, Acc>
                    : // AttrValue extends boolean
                      //   ? PatchMeta<
                      //       SelectorAcc,
                      //       'exclude',
                      //       {
                      //         [K in Selector['name']]: AttrValue extends true
                      //           ? false
                      //           : true
                      //       }
                      //     > extends infer Res
                      //     ? Res extends MetaAcc
                      //       ? PatchMeta<
                      //           Res,
                      //           'extract',
                      //           {
                      //             [K in Selector['name']]: boolean
                      //           }
                      //         >
                      //       : NeverError<Res>
                      //     : never
                      //   :
                      PatchMeta<
                          SelectorAcc,
                          'extract',
                          {
                            [K in Selector['name']]: AttrValue
                          }
                        > extends infer PatchRes
                      ? PatchRes extends MetaAcc
                        ? PreprocessCompoundSelector<Rest, PatchRes, Acc>
                        : NeverError<PatchRes>
                      : never
                  : never
                : Selector['operator'] extends '!='
                  ? TryToParseAttrValue<
                      Selector['value']['value']
                    > extends infer AttrValue
                    ? AttrValue extends AttrValueIsUnsafeToIntersect
                      ? PreprocessCompoundSelector<Rest, SelectorAcc, Acc>
                      : // AttrValue extends boolean
                        //   ? PatchMeta<
                        //       SelectorAcc,
                        //       'exclude',
                        //       {
                        //         [K in Selector['name']]: AttrValue extends true
                        //           ? true
                        //           : true
                        //       }
                        //     > extends infer Res
                        //     ? Res extends MetaAcc
                        //       ? PatchMeta<
                        //           Res,
                        //           'extract',
                        //           {
                        //             [K in Selector['name']]: boolean
                        //           }
                        //         >
                        //       : NeverError<Res>
                        //     : never
                        //   :
                        PatchMeta<
                            SelectorAcc,
                            'exclude',
                            {
                              [K in Selector['name']]: AttrValue
                            }
                          > extends infer PatchRes
                        ? PatchRes extends MetaAcc
                          ? PreprocessCompoundSelector<Rest, PatchRes, Acc>
                          : NeverError<PatchRes>
                        : never
                    : never
                  : PreprocessCompoundSelector<Rest, SelectorAcc, Acc>
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

type MatchSplittedConjunction<Left, Splitted> = Extract<
  CollapsePositivesFromConjunction<Left, Splitted['and']>,
  CollapseNegativesFromConjunction<Left, Splitted['not']>
>

declare const LeftIsAny: unique symbol
type LeftIsAny = typeof LeftIsAny

// TODO: extract inferredNodes too
// TODO: change Acc default value accordingly
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
            Left extends LeftIsAny
              ? TSESTree.Node
              : PrecollapseCollectChildBoundaries<
                  Left,
                  { field: First['field'] }
                >,
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
  Acc = Left extends LeftIsAny
    ? TSESTree.Node
    : PrecollapseCollectChildBoundaries<Left, { field: null }>,
> = Positives extends [infer First, ...infer Rest]
  ? First extends MetaAcc
    ? CollapsePositivesFromConjunction<
        Left,
        Rest,
        Extract<
          Acc,
          Extract<
            Extract<
              Left extends LeftIsAny
                ? First['field'] extends null
                  ? TSESTree.Node
                  : PrecollapseCollectChildBoundaries<
                      TSESTree.Node,
                      { field: First['field'] }
                    >
                : PrecollapseCollectChildBoundaries<
                    Left,
                    { field: First['field'] }
                  >,
              unknown extends First['extract']
                ? Exclude<
                    TryToNarrowByExtracting<
                      First['identifier'] extends null
                        ? TSESTree.Node
                        : PickNode<First['identifier']>,
                      First['extract']
                    >,
                    First['exclude']
                  >
                : Exclude<
                    Exclude<
                      TryToNarrowByExtracting<
                        First['identifier'] extends null
                          ? TSESTree.Node
                          : PickNode<First['identifier']>,
                        PreprocessExtract<First['extract']>['extract']
                      >,
                      First['exclude']
                    >,
                    PreprocessExtract<First['extract']>['exclude']
                  >
            >,
            First['inferredNodes'] extends null ? any : First['inferredNodes']
          >
        >
      >
    : never
  : Acc
type ddd34 = CollapsePositivesFromConjunction<
  LeftIsAny,
  [
    //  ^?
    {
      identifier: 'VariableDeclarator'
      field: null
      extract: unknown
      exclude: {
        init: null
      }
      inferredNodes: null
    },
  ]
>

type dreee = Extract<
  Extract<
    TSESTree.Node,
    TSESTree.LetOrConstOrVarDeclarator | TSESTree.UsingInNomalConextDeclarator
  >,
  TSESTree.Identifier | TSESTree.UsingInNomalConextDeclarator
>
type _dreeae = Extract<
  TSESTree.LetOrConstOrVarDeclarator | TSESTree.UsingDeclarator,
  TSESTree.LetOrConstOrVarDeclarator | TSESTree.UsingInNomalConextDeclarator
>
//     TODO: ^^^^^ WTF??
type dd = PrecollapseCollectChildBoundaries<
  TSESTree.Node,
  { field: 'decorators' }
>
//   ^?
type CollapseChildRelations<Left, Right, Acc = []> = Right extends [
  infer First,
  ...infer Rest,
]
  ? CollapseChildRelations<
      Left,
      Rest,
      [
        ...Acc,
        // SplitConjunction<First['args']>,
        MatchSplittedConjunction<Left, SplitConjunction<First['args']>>,
      ]
    >
  : Acc[number]

type dsafasd =
  //     ^?
  Dnf<PreprocessSelector<ParseIt<'TSModuleDeclaration'>, WildcardMeta>>

export type Mmatch<T> = CollapseChildRelations<
  LeftIsAny,
  Dnf<PreprocessSelector<T, WildcardMeta>>['args']
>

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
          args: PrepreprocessCompoundSelector<T['selectors'], SelectorAcc>
        }
      : T extends { type: 'child' }
        ? CollapseChildRelations<
            /* Left */ Mmatch<T['left']>,
            Dnf<PreprocessSelector<T['right'], WildcardMeta>>['args']
          > extends infer InferredNodes
          ? [InferredNodes] extends [never]
            ? never
            : {
                identifier: null
                field: null
                extract: unknown
                exclude: never
                inferredNodes: InferredNodes
              }
          : never
        : T extends { type: 'matches'; selectors: any }
          ? PreprocessSelectorsList<T['selectors'], SelectorAcc>
          : T extends { type: 'not'; selectors: any }
            ? {
                type: 'and'
                args: [
                  // SelectorAcc,
                  {
                    type: 'not'
                    arg: {
                      type: 'not'
                      arg: SelectorAcc
                    }
                  },
                  {
                    type: 'not'
                    arg: PreprocessSelectorsList<T['selectors'], SelectorAcc>
                  },
                ]
              }
            : NeverError<'not impleeemented'>
