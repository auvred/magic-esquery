import type { ParseIt } from './parser'
import type { Equal } from '@type-challenges/utils'
import type {
  TSESTree as A,
  AST_NODE_TYPES,
} from '@typescript-eslint/typescript-estree'
import type { Simplify, TupleToUnion } from 'type-fest'

type AST = A.Node

interface PostprocessedSelectorsAcc {
  identifier: any | null
  field: any | null
  extract: any
  exclude: any
  subSelectors: Array<PostprocessedSelectorsAcc> | null
  matchesNodes: any[] | null
}

type FilterNodes<T> = NonNullable<T>['type'] extends AST_NODE_TYPES
  ? NonNullable<T>
  : NonNullable<T> extends [...infer Els]
    ? NonNullable<Els[number]>['type'] extends AST_NODE_TYPES
      ? NonNullable<Els[number]>
      : never
    : never

declare const NeverErrorSymbol: unique symbol
type NeverError<Message = unknown> = [typeof NeverErrorSymbol, Message]

export declare const AttrValueIsUnsafeToIntersect: unique symbol
type AttrValueIsUnsafeToIntersect = typeof AttrValueIsUnsafeToIntersect

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

type IntersectMatchedNodesInnerRecurser<
  CurrentNode,
  NewNodes extends Array<any>,
  Acc extends Array<any> = [],
> = NewNodes extends [infer NewNode, ...infer RestNewNodes]
  ? CurrentNode & NewNode extends infer MergeRes
    ? [MergeRes] extends [never]
      ? IntersectMatchedNodesInnerRecurser<CurrentNode, RestNewNodes, Acc>
      : IntersectMatchedNodesInnerRecurser<
          CurrentNode,
          RestNewNodes,
          [...Acc, MergeRes]
        >
    : never
  : Acc
type IntersectMatchedNodesImpl<
  Nodes extends Array<any>,
  NewNodes extends Array<any>,
  IntersectedNodes extends Array<any> = [],
> = Nodes extends [infer Node, ...infer RestNodes]
  ? IntersectMatchedNodesImpl<
      RestNodes,
      NewNodes,
      [
        ...IntersectedNodes,
        ...IntersectMatchedNodesInnerRecurser<Node, NewNodes>,
      ]
    >
  : IntersectedNodes
type IntersectMatchedNodes<
  Nodes extends Array<any> | null,
  NewNodes extends Array<any> | null,
  IntersectedNodes extends Array<any> = [],
> = Nodes extends null
  ? NewNodes
  : NewNodes extends null
    ? Nodes
    : IntersectMatchedNodesImpl<Nodes, NewNodes, IntersectedNodes>

type IntersectSelectorsInnerRecurser<
  CurrentSelector extends PostprocessedSelectorsAcc,
  NewSelectors extends Array<PostprocessedSelectorsAcc>,
  Acc extends Array<PostprocessedSelectorsAcc> = [],
> = NewSelectors extends [infer NewSelector, ...infer RestNewSelectors]
  ? MergeTwoSelectors<CurrentSelector, NewSelector> extends infer MergeRes
    ? MergeRes extends NeverError
      ? IntersectSelectorsInnerRecurser<CurrentSelector, RestNewSelectors, Acc>
      : IntersectSelectorsInnerRecurser<
          CurrentSelector,
          RestNewSelectors,
          [...Acc, MergeRes]
        >
    : never
  : Acc
type IntersectSelectorsImpl<
  Selectors extends Array<PostprocessedSelectorsAcc>,
  NewSelectors extends Array<PostprocessedSelectorsAcc>,
  IntersectedSelectors extends Array<PostprocessedSelectorsAcc> = [],
> = Selectors extends [infer Selector, ...infer RestSelectors]
  ? IntersectSelectorsImpl<
      RestSelectors,
      NewSelectors,
      [
        ...IntersectedSelectors,
        ...IntersectSelectorsInnerRecurser<Selector, NewSelectors>,
      ]
    >
  : IntersectedSelectors
type IntersectSelectors<
  Selectors extends Array<PostprocessedSelectorsAcc> | null,
  NewSelectors extends Array<PostprocessedSelectorsAcc> | null,
  IntersectedSelectors extends Array<PostprocessedSelectorsAcc> = [],
> = Selectors extends null
  ? NewSelectors
  : NewSelectors extends null
    ? Selectors
    : IntersectSelectorsImpl<Selectors, NewSelectors, IntersectedSelectors>

// TODO: lowercase them
type MergeTwoSelectorsIdentifiers<L, R> = L extends null
  ? R
  : R extends null
    ? L
    : Equal<L, R> extends true
      ? L
      : // one selector can't contain two different identifiers
        NeverError

type MergeTwoSelectorsFields<L, R> = L extends null
  ? R
  : R extends null
    ? L
    : L['name'] extends `${string}.${string}`
      ? // for now just skipping composite fields (probably we should add it, but it may violate perf)
        R['name'] extends `${string}.${string}`
        ? null
        : R
      : R['name'] extends `${string}.${string}`
        ? null
        : Equal<L, R> extends true
          ? L
          : // one selector can't contain two different fields
            NeverError

type MergeTwoSelectors<
  L extends PostprocessedSelectorsAcc,
  R extends PostprocessedSelectorsAcc,
> = MergeTwoSelectorsIdentifiers<
  L['identifier'],
  R['identifier']
> extends infer MergedIdentifiers
  ? MergedIdentifiers extends NeverError
    ? NeverError
    : MergeTwoSelectorsFields<L['field'], R['field']> extends infer MergedFields
      ? MergedFields extends NeverError
        ? NeverError
        : IntersectSelectors<
              L['subSelectors'],
              R['subSelectors']
            > extends infer IntersectedSelectors
          ? IntersectedSelectors extends NeverError
            ? NeverError
            : {
                identifier: MergedIdentifiers
                field: MergedFields
                extract: Simplify<L['extract'] & R['extract']>
                exclude: L['exclude'] | R['exclude']
                subSelectors: IntersectedSelectors
                matchesNodes: [
                  ...(L['matchesNodes'] extends null ? [] : L['matchesNodes']),
                  ...(R['matchesNodes'] extends null ? [] : R['matchesNodes']),
                ]
              }
          : never
      : NeverError
  : NeverError

type PostprocessMatchesSelectors<
  Selectors extends any[],
  State extends {
    subSelectors: any[] | null
    matchesNodes: any[] | null
  },
  Acc extends {
    subSelectors: any[]
    matchesNodes: any[]
  } = {
    subSelectors: []
    matchesNodes: []
  },
> = Selectors extends [infer First, ...infer Rest]
  ? PostprocessParsedSelector<First> extends infer ParseRes
    ? PostprocessMatchesSelectors<
        Rest,
        State,
        {
          subSelectors: [...Acc['subSelectors'], ParseRes]
          matchesNodes: [
            ...(Acc['matchesNodes'] extends null ? [] : Acc['matchesNodes']),
            ...(ParseRes['matchesNodes'] extends null
              ? []
              : ParseRes['matchesNodes']),
          ]
        } & Omit<Acc, 'subSelectors' | 'matchesNodes'>
      >
    : never
  : {
      subSelectors: IntersectSelectors<
        Acc['subSelectors'],
        State['subSelectors']
      >
      matchesNodes: IntersectMatchedNodes<
        State['matchesNodes'],
        Acc['matchesNodes']
      >
    }
// subSelectors: IntersectSelectors<
//   PostprocessMatchesSelectors<SubSelectors>,
//   Acc['subSelectors']
// >

// extract: unknown
// exclude: never
type PostprocessSelectorsImpl<
  Selectors extends any[],
  Acc extends PostprocessedSelectorsAcc,
> = Selectors extends [infer Selector, ...infer Rest]
  ? Selector extends {
      type: 'wildcard'
    }
    ? PostprocessSelectorsImpl<Rest, Acc>
    : Selector extends {
          type: 'attribute'
          name: infer AttrName
        }
      ? // TODO: add support for nested fields narrowing
        AttrName extends `${string}.${string}`
        ? PostprocessSelectorsImpl<Rest, Acc>
        : Selector extends {
              operator: infer AttrOp
              value: infer AttrValue
            }
          ? AttrValue extends {
              type: 'literal'
              value: infer AttrValueValue
            }
            ? AttrOp extends '='
              ? TryToParseAttrValue<AttrValueValue> extends AttrValueIsUnsafeToIntersect
                ? PostprocessSelectorsImpl<Rest, Acc>
                : PostprocessSelectorsImpl<
                    Rest,
                    {
                      extract: Acc['extract'] & {
                        [K in AttrName]: TryToParseAttrValue<AttrValueValue>
                      }
                    } & Omit<Acc, 'extract'>
                  >
              : PostprocessSelectorsImpl<
                  Rest,
                  {
                    exclude:
                      | Acc['exclude']
                      | {
                          [K in AttrName]: TryToParseAttrValue<AttrValueValue>
                        }
                  } & Omit<Acc, 'exclude'>
                >
            : PostprocessSelectorsImpl<Rest, Acc>
          : PostprocessSelectorsImpl<
              Rest,
              {
                extract: Acc['extract'] & {
                  // https://github.com/estools/esquery/blob/909bea6745d33d33870b5d2c3382b4561d00d923/esquery.js#L221
                  // != null
                  [K in AttrName]: string | number | boolean | symbol | object
                  // 1
                }
              } & Omit<Acc, 'extract'>
            >
      : Selector extends {
            type: 'field'
          }
        ? MergeTwoSelectorsFields<
            Selector,
            Acc['field']
          > extends infer MergedFields
          ? MergedFields extends NeverError
            ? NeverError<[Selector, Acc['field']]>
            : PostprocessSelectorsImpl<
                Rest,
                { field: MergedFields } & Omit<Acc, 'field'>
              >
          : never
        : Selector extends {
              type: 'identifier'
            }
          ? MergeTwoSelectorsIdentifiers<
              Selector['value'],
              Acc['identifier']
            > extends infer MergedIdentifiers
            ? MergedIdentifiers extends NeverError
              ? NeverError<[Selector, Acc['identifier']]>
              : PostprocessSelectorsImpl<
                  Rest,
                  { identifier: MergedIdentifiers } & Omit<Acc, 'identifier'>
                >
            : never
          : Selector extends {
                type: 'matches'
                selectors: infer SubSelectors
              }
            ? PostprocessSelectorsImpl<
                Rest,
                // {
                //   subSelectors: IntersectSelectors<
                PostprocessMatchesSelectors<SubSelectors, Acc> &
                  //   , Acc['subSelectors']
                  // >
                  // }
                  Omit<Acc, 'subSelectors' | 'matchesNodes'>
              >
            : ['unimplemented', Selector]
  : Acc

type PostprocessSelectors<Selectors extends any[]> = Simplify<
  PostprocessSelectorsImpl<
    Selectors,
    {
      identifier: null
      field: null
      extract: unknown
      exclude: never
      subSelectors: null
      matchesNodes: null
    }
  >
>

type ExpandSubSelectorsImpl<
  Selector extends PostprocessedSelectorsAcc,
  Acc = [],
> = Selector['subSelectors'] extends [
  infer SubSelector,
  ...infer RestSubSelectors,
]
  ? Simplify<
      MergeTwoSelectors<
        { subSelectors: null } & Omit<Selector, 'subSelectors'>,
        SubSelector
      >
    > extends infer Merged
    ? //Merged extends NeverError
      // ? Acc
      ExpandSubSelectorsImpl<
        { subSelectors: RestSubSelectors } & Omit<Selector, 'subSelectors'>,
        SubSelector['subSelectors'] extends null
          ? Merged extends NeverError
            ? Acc
            : [...Acc, Merged]
          : Merged extends NeverError
            ? Acc
            : [...Acc, ...ExpandSubSelectorsImpl<Merged>]
      >
    : never
  : Acc

type ExpandSubSelectors<Selector extends PostprocessedSelectorsAcc> =
  Selector['subSelectors'] extends null
    ? [Selector]
    : ExpandSubSelectorsImpl<Selector, []>

type PrecollapseCollectBoundaries<
  Boundary extends PostprocessedSelectorsAcc,
  Ctx extends { field: any | null; child: boolean },
> = Exclude<
  TryToNarrowByExtracting<
    Boundary['identifier'] extends null
      ? AST
      : PickNode<Boundary['identifier']>,
    Boundary['extract']
  >,
  Boundary['exclude']
> extends infer Res
  ? Ctx['field'] extends null
    ? Ctx['child'] extends true
      ? ExtractChildDeps<Res>
      : Res
    : //NonNullable<
      // ExtractNodeTypesFromNodes<
      Extract<Res, { [K in Ctx['field']['name']]: any }>[Ctx['field']['name']]
  : //  >
    // >
    never

type TryToNarrowByExtracting<T, U> = Extract<T, U> extends never
  ? Extract<T, { [K in keyof U]: any }>
  : Extract<T, U>

type PickNode<T> = [T] extends [any] ? Extract<AST, { type: T }> : never

type CollapseBoundariesAndPostprocessedSelector<
  Boundary extends PostprocessedSelectorsAcc,
  Selector extends PostprocessedSelectorsAcc,
  Ctx extends {
    child: boolean
  },
> = Extract<
  PrecollapseCollectBoundaries<
    Boundary,
    { field: Selector['field']; child: Ctx['child'] }
  >,
  Exclude<
    TryToNarrowByExtracting<
      Selector['identifier'] extends null
        ? AST
        : PickNode<Selector['identifier']>,
      Selector['extract']
    >,
    Selector['exclude']
  >
>

type MegaCollapseBoundariesRecurser<
  Boundary extends PostprocessedSelectorsAcc,
  Selectors extends Array<PostprocessedSelectorsAcc>,
  Acc = [],
  Ctx extends {
    child: boolean
  },
> = Selectors extends [infer First, ...infer Rest]
  ? MegaCollapseBoundariesRecurser<
      Boundary,
      Rest,
      [
        CollapseBoundariesAndPostprocessedSelector<Boundary, First, Ctx>,
      ] extends [infer Res]
        ? [Res] extends [never]
          ? Acc
          : [...Acc, Res]
        : never,
      Ctx
    >
  : Acc

type MegaCollapseBoundaries<
  Boundaries extends Array<PostprocessedSelectorsAcc>,
  Selectors extends Array<PostprocessedSelectorsAcc>,
  Acc = [],
  Ctx extends {
    child: boolean
  },
> = Boundaries extends [infer First, ...infer Rest]
  ? MegaCollapseBoundaries<
      Rest,
      Selectors,
      [...Acc, ...MegaCollapseBoundariesRecurser<First, Selectors, [], Ctx>],
      Ctx
    >
  : Acc

type PostprocessParsedSelector<T> = T extends
  | { type: 'descendant' }
  | { type: 'sibling' }
  | { type: 'adjacent' }
  ? T extends {
      right: infer Right
    }
    ? PostprocessParsedSelector<Right>
    : never
  : T extends {
        type: 'compound'
        selectors: infer Selectors
      }
    ? PostprocessSelectors<Selectors>
    : T extends { type: 'child'; left: infer Left; right: infer Right }
      ? {
          identifier: null
          field: null
          extract: unknown
          exclude: never
          subSelectors: null
          matchesNodes: [
            ...MegaCollapseBoundaries<
              ExpandSubSelectors<PostprocessParsedSelector<Left>>,
              ExpandSubSelectors<PostprocessParsedSelector<Right>>,
              [],
              {
                child: true
              }
            >,
            ...(PostprocessParsedSelector<Right>['matchesNodes'] extends null
              ? []
              : PostprocessParsedSelector<Right>['matchesNodes']),
          ]
        }
      : //ExpandSubSelectors<
        PostprocessSelectors<[T]>

export type MatchIt<T> = PostprocessParsedSelector<T> extends infer Res
  ? Res extends {
      identifier: any
    }
    ? TupleToUnion<
        MegaCollapseBoundariesRecurser<
          {
            identifier: null
            field: null
            extract: unknown
            exclude: never
            subSelectors: null
            matchesNodes: null
          },
          ExpandSubSelectors<Res>,
          [],
          { child: false }
        >
      >
    : TupleToUnion<Res['matchesNodes']>
  : never

type _parsed =
  ParseIt<':matches(CallExpression, :matches(CallExpression > MemberExpression, CallExpression > Identifier))'>
// ParseIt<'CallExpression > :matches(ArrayExpression, CallExpression > MemberExpression, CallExpression > Identifier):matches(ArrayExpression, CallExpression > MemberExpression[computed=false], CallExpression > Identifier)'>
type _aaa = MatchIt<_parsed>
//     ^?
// type _res = MegaCollapseBoundariesRecurser<
//   //   ^?
//   {
//     identifier: null
//     field: null
//     extract: unknown
//     exclude: never
//     subSelectors: null
//     matchesNodes: null
//   },
type a = ExpandSubSelectors<PostprocessParsedSelector<_parsed>>
//   ^?

//   [],
//   {
//     child: false
//   }
// >
// type expanded = ExpandSubSelectors<res>
//     ^?
