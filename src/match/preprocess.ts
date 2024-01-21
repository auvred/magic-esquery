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
import type { MatchIt } from '../matcher'
import type { Simplify } from '../utils'

type PrepreprocessCompoundSelector<
  Selectors extends any[],
  SelectorAcc extends MetaAcc,
  AST extends { type: any },
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
        AST,
        { matches: [...Acc['matches'], Selector] } & Omit<Acc, 'matches'>
      >
    : Selector extends { type: 'not' }
      ? PrepreprocessCompoundSelector<
          Rest,
          SelectorAcc,
          AST,
          { nots: [...Acc['nots'], Selector] } & Omit<Acc, 'nots'>
        >
      : PrepreprocessCompoundSelector<
          Rest,
          SelectorAcc,
          AST,
          { selectors: [...Acc['selectors'], Selector] } & Omit<
            Acc,
            'selectors'
          >
        >
  : PreprocessCompoundSelector<
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
                  selectors: [{ type: 'compound'; selectors: Acc['selectors'] }]
                },
              ]
            : Acc['selectors']),

        ...Acc['matches'],
        ...Acc['nots'],
      ],
      SelectorAcc,
      AST
    >

type PreprocessCompoundSelector<
  Selectors extends any[],
  SelectorAcc extends MetaAcc,
  AST extends { type: any },
  Acc extends any[] | null = null,
> = Selectors extends [infer Selector, ...infer Rest]
  ? Selector extends { type: 'wildcard' } | { type: 'class' } | { type: 'has' }
    ? PreprocessCompoundSelector<Rest, SelectorAcc, AST, Acc>
    : Selector extends { type: 'identifier'; value: any }
      ? PatchMeta<
          SelectorAcc,
          'identifier',
          Selector['value']
        > extends infer PatchRes
        ? PatchRes extends MetaAcc
          ? PreprocessCompoundSelector<Rest, PatchRes, AST, Acc>
          : NeverError<PatchRes>
        : never
      : Selector extends { type: 'attribute'; name: any }
        ? // TODO: add support for nested fields narrowing
          Selector['name'] extends `${string}.${string}`
          ? PreprocessCompoundSelector<Rest, SelectorAcc, AST, Acc>
          : Selector extends { operator: any; value: any }
            ? Selector['value'] extends { type: 'literal'; value: any }
              ? Selector['operator'] extends '='
                ? TryToParseAttrValue<
                    Selector['value']['value']
                  > extends infer AttrValue
                  ? AttrValue extends AttrValueIsUnsafeToIntersect
                    ? PreprocessCompoundSelector<Rest, SelectorAcc, AST, Acc>
                    : PatchMeta<
                          SelectorAcc,
                          'extract',
                          {
                            [K in Selector['name']]: AttrValue
                          }
                        > extends infer PatchRes
                      ? PatchRes extends MetaAcc
                        ? PreprocessCompoundSelector<Rest, PatchRes, AST, Acc>
                        : NeverError<PatchRes>
                      : never
                  : never
                : Selector['operator'] extends '!='
                  ? TryToParseAttrValue<
                      Selector['value']['value']
                    > extends infer AttrValue
                    ? AttrValue extends AttrValueIsUnsafeToIntersect
                      ? PreprocessCompoundSelector<Rest, SelectorAcc, AST, Acc>
                      : PatchMeta<
                            SelectorAcc,
                            'exclude',
                            {
                              [K in Selector['name']]: AttrValue
                            }
                          > extends infer PatchRes
                        ? PatchRes extends MetaAcc
                          ? PreprocessCompoundSelector<Rest, PatchRes, AST, Acc>
                          : NeverError<PatchRes>
                        : never
                    : never
                  : PreprocessCompoundSelector<Rest, SelectorAcc, AST, Acc>
              : PreprocessCompoundSelector<Rest, SelectorAcc, AST, Acc>
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
                ? PreprocessCompoundSelector<Rest, PatchRes, AST, Acc>
                : NeverError<PatchRes>
              : never
        : Selector extends { type: 'field'; name: any }
          ? PatchMeta<
              SelectorAcc,
              'field',
              Selector['name']
            > extends infer PatchRes
            ? PatchRes extends MetaAcc
              ? PreprocessCompoundSelector<Rest, PatchRes, AST, Acc>
              : NeverError<PatchRes>
            : never
          : PreprocessCompoundSelector<
              Rest,
              SelectorAcc,
              AST,
              [
                ...(Acc extends any[] ? Acc : []),
                PreprocessSelector<Selector, SelectorAcc, AST>,
              ]
            >
  : Acc extends any[]
    ? Acc
    : [SelectorAcc]

type SplitConjunction<
  T,
  Acc extends {
    and: MetaAcc[]
    not: MetaAcc[]
  } = {
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
        {
          not: [...Acc['not'], First['arg']]
        } & Omit<Acc, 'not'>
      >
    : First extends MetaAcc
      ? SplitConjunction<
          Rest,
          // TODO: error if fields dont match ( merge them )
          {
            and: [...Acc['and'], First]
          } & Omit<Acc, 'and'>
        >
      : never
  : Simplify<Acc>

type PrecollapseCollectChildBoundaries<
  Boundary,
  Ctx extends { field: any | null },
  AST extends { type: any },
> = Ctx['field'] extends null
  ? ExtractChildDeps<Boundary, AST>
  : FilterNodes<
      Extract<Boundary, { [K in Ctx['field']]: any }>[Ctx['field']],
      AST
    >

type MatchSplittedConjunction<
  Left,
  Splitted extends { and: any; not: any },
  AST extends { type: any },
> = Extract<
  CollapsePositivesFromConjunction<Left, Splitted['and'], AST>,
  CollapseNegativesFromConjunction<Left, Splitted['not'], AST>
>

declare const LeftIsAny: unique symbol
export type LeftIsAny = typeof LeftIsAny

// TODO: extract inferredNodes too
// TODO: change Acc default value accordingly
type CollapseNegativesFromConjunction<
  Left,
  Negatives,
  AST extends { type: any },
  Acc = AST,
> = Negatives extends [infer First, ...infer Rest]
  ? First extends MetaAcc
    ? CollapseNegativesFromConjunction<
        Left,
        Rest,
        AST,
        Exclude<
          Acc,
          Extract<
            Left extends LeftIsAny
              ? AST
              : PrecollapseCollectChildBoundaries<
                  Left,
                  { field: First['field'] },
                  AST
                >,
            Exclude<
              TryToNarrowByExtracting<
                First['identifier'] extends null
                  ? AST
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
  AST extends { type: any },
  Acc = Left extends LeftIsAny
    ? AST
    : PrecollapseCollectChildBoundaries<Left, { field: null }, AST>,
> = Positives extends [infer First, ...infer Rest]
  ? First extends MetaAcc
    ? CollapsePositivesFromConjunction<
        Left,
        Rest,
        AST,
        Extract<
          Acc,
          Extract<
            Extract<
              Left extends LeftIsAny
                ? First['field'] extends null
                  ? AST
                  : PrecollapseCollectChildBoundaries<
                      AST,
                      { field: First['field'] },
                      AST
                    >
                : PrecollapseCollectChildBoundaries<
                    Left,
                    { field: First['field'] },
                    AST
                  >,
              unknown extends First['extract']
                ? Exclude<
                    TryToNarrowByExtracting<
                      First['identifier'] extends null
                        ? AST
                        : PickNode<First['identifier']>,
                      First['extract']
                    >,
                    First['exclude']
                  >
                : Exclude<
                    Exclude<
                      TryToNarrowByExtracting<
                        First['identifier'] extends null
                          ? AST
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

export type CollapseChildRelations<
  Left,
  Right,
  AST extends { type: any },
  Acc extends unknown[] = [],
> = Right extends [infer First, ...infer Rest]
  ? First extends { args: any[] }
    ? CollapseChildRelations<
        Left,
        Rest,
        AST,
        [
          ...Acc,
          MatchSplittedConjunction<Left, SplitConjunction<First['args']>, AST>,
        ]
      >
    : never
  : Acc[number]

type PreprocessSelectorsList<
  Selectors extends any[],
  SelectorAcc extends MetaAcc,
  AST extends { type: any },
  Acc extends any[] = [],
> = Selectors extends [infer Selector, ...infer Rest]
  ? PreprocessSelectorsList<
      Rest,
      SelectorAcc,
      AST,
      [...Acc, PreprocessSelector<Selector, SelectorAcc, AST>]
    >
  : { type: 'or'; args: Acc }

export type PreprocessSelector<
  T,
  SelectorAcc extends MetaAcc,
  AST extends { type: any },
> = T extends
  | { type: 'sibling' }
  | { type: 'adjacent' }
  | { type: 'descendant' }
  ? T extends { right: any }
    ? PreprocessSelector<T['right'], SelectorAcc, AST>
    : never
  : T extends
        | { type: 'wildcard' }
        | { type: 'identifier' }
        | { type: 'attribute' }
        | { type: 'field' }
        | { type: 'class' }
        | { type: 'has' }
    ? PreprocessSelector<{ type: 'compound'; selectors: [T] }, SelectorAcc, AST>
    : T extends { type: 'compound'; selectors: any }
      ? {
          type: 'and'
          args: PrepreprocessCompoundSelector<T['selectors'], SelectorAcc, AST>
        }
      : T extends { type: 'child'; left: any; right: any }
        ? CollapseChildRelations<
            MatchIt<T['left'], AST>,
            Dnf<
              PreprocessSelector<T['right'], WildcardMeta, AST>
            > extends infer Res
              ? Res extends { args: any[] }
                ? Res['args']
                : never
              : never,
            AST
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
          ? PreprocessSelectorsList<T['selectors'], SelectorAcc, AST>
          : T extends { type: 'not'; selectors: any }
            ? {
                type: 'and'
                args: [
                  {
                    type: 'not'
                    arg: {
                      type: 'not'
                      arg: SelectorAcc
                    }
                  },
                  {
                    type: 'not'
                    arg: PreprocessSelectorsList<
                      T['selectors'],
                      SelectorAcc,
                      AST
                    >
                  },
                ]
              }
            : NeverError<'not impleeemented'>
