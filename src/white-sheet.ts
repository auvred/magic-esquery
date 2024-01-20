import type { ParseIt } from './parser'
import type { Equal, Expect } from '@type-challenges/utils'
import type {
  TSESTree as A,
  AST_NODE_TYPES,
} from '@typescript-eslint/typescript-estree'
import type { Simplify } from 'type-fest'

type AST = A.Node

type PickNode<T> = Extract<AST, { type: T }>

declare const NeverErrorSymbol: unique symbol
type NeverError<Message = unknown> = [typeof NeverErrorSymbol, Message]

type ExtractNodeTypesFromNodes<T> =
  NonNullable<T>['type'] extends AST_NODE_TYPES
    ? NonNullable<T>['type']
    : NonNullable<T> extends [...infer Els]
      ? NonNullable<Els[number]>['type'] extends AST_NODE_TYPES
        ? NonNullable<Els[number]>['type']
        : never
      : never

type FilterNodes<T> = NonNullable<T>['type'] extends AST_NODE_TYPES
  ? NonNullable<T>
  : NonNullable<T> extends [...infer Els]
    ? NonNullable<Els[number]>['type'] extends AST_NODE_TYPES
      ? NonNullable<Els[number]>
      : never
    : never

type ExtractChildDeps<Node extends any> = NonNullable<
  {
    [K in keyof Node]: K extends 'parent' ? never : FilterNodes<Node[K]>
  }[keyof Node]
>

type _lalallal =
  //      ^?
  ParseIt<'CallExpression > :matches(* > :matches(.callee, .arguments))'>

// TODO:
// :matches(JSXMemberExpression, WithStatement) > [object]  - type should be Expression | JSXTagNameExpression
// :matches(Literal, MemberExpression):matches(Literal)  - type should be Literal

// prettier-ignore
type _testExtractChildDeps = [
  Expect<Equal<
    ExtractChildDeps<A.Program>,
    A.ProgramStatement['type']
  >>,
  Expect<Equal<
    ExtractChildDeps<A.CallExpression>,
    A.LeftHandSideExpression['type'] | A.CallExpressionArgument['type'] | A.TSTypeParameterInstantiation['type']
  >>,
]

type CollectBoundaries<
  Selector,
  Ctx extends { field: any | null },
> = Selector extends {
  type: 'identifier'

  value: infer IdentifierName
}
  ? PickNode<IdentifierName>
  : Selector extends {
        type: 'wildcard'
      }
    ? AST
    : Selector extends {
          type: 'child'
          left: infer Left
          right: infer Right
        }
      ? PostprocessSelectors<
          SelectorToSelectors<Right>
        > extends infer PostprocessedSelectors
        ? IntersectBoundariesAndSelectors<
            CollectBoundariesForChildRight<
              Left,
              { field: ResolvedSelectors['field'] }
            >,
            ResolvedSelectors
          >
        : never
      : PostprocessSelectors<
            SelectorToSelectors<Right>
          > extends infer ResolvedSelectors
        ? IntersectBoundariesAndSelectors<
            CollectBoundariesForChildRight<
              Left,
              { field: ResolvedSelectors['field'] }
            >,
            ResolvedSelectors
          >
        : never
//Ctx['field'] extends null
// ? ExtractChildDeps<Much<Left>>
// : NonNullable<
//     ExtractNodeTypesFromNodes<
//       Extract<
//         Much<Left>,
//         { [K in Ctx['field']['name']]: any }
//       >[Ctx['field']['name']]
//     >
//   >

type asdfs = CollectBoundariesForChildRight<
  //     ^?
  { type: 'wildcard' },
  { field: { type: 'field'; name: 'declarations' } }
>

// prettier-ignore
type _testCollectBoundariesForChildRight = [
  Expect<Equal<
    CollectBoundariesForChildRight<{ type: 'identifier'; value: 'CallExpression' }, { field: null }>,
    A.LeftHandSideExpression['type'] | A.CallExpressionArgument['type'] | A.TSTypeParameterInstantiation['type']
  >>,
  Expect<Equal<
    CollectBoundariesForChildRight<{ type: 'identifier'; value: 'CallExpression' }, { field: {type: 'field'; name: 'callee'}}>,
    A.LeftHandSideExpression['type']
  >>,
  Expect<Equal<
    CollectBoundariesForChildRight<{ type: 'wildcard'; value: '*' }, { field: {type: 'field'; name: 'declarations'}}>,
    AST_NODE_TYPES.VariableDeclarator
  >>,
]

export declare const AttrValueIsUnsafeToIntersect: unique symbol
type AttrValueIsUnsafeToIntersect = typeof AttrValueIsUnsafeToIntersect

type TryToParseAttrValue<T> = T extends 'true'
  ? true
  : T extends 'false'
    ? false
    : T extends 'null'
      ? null
      : T extends 'undefined'
        ? undefined
        : AttrValueIsUnsafeToIntersect

interface PostprocessedSelectorsAcc {
  identifier: any | null
  field: any | null
  extract: any
  exclude: any
  subSelectors: Array<PostprocessedSelectorsAcc> | null
}

type WildcardPostprocessedSelectorsAcc = PostprocessSelectors<[ParseIt<'*'>]>

// const subselectors = []
// const newSubselectors = []
// const intersectedSubselectors = []
// for (const subselector of subselectors) {
//   for (const newSubselector of newSubselectors) {
//     if (subselector & newSubselectors) {
//       intersectedSubselectors.push(subselector & newSubselectors)
//     }
//   }
// }
// return intersectedSubselectors

type IntersectSelectorsInnerRecurser<
  CurrentSelector extends PostprocessedSelectorsAcc,
  NewSelectors extends Array<PostprocessedSelectorsAcc>,
  Acc extends Array<PostprocessedSelectorsAcc> = [],
> = NewSelectors extends [infer NewSelector, ...infer RestNewSelectors]
  ? // TODO: exclude it if intersection failed
    MergeTwoSelectors<CurrentSelector, NewSelector> extends infer MergeRes
    ? MergeRes extends NeverError
      ? IntersectSelectorsInnerRecurser<CurrentSelector, RestNewSelectors, Acc>
      : IntersectSelectorsInnerRecurser<
          CurrentSelector,
          RestNewSelectors,
          [...Acc, MergeRes]
        >
    : never
  : Acc

type PostprocessAccForWildcard = PostprocessSelectors<
  [{ type: 'wildcard'; value: '*' }]
>

// PostprocessAcc['subSelectors'] extends null
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
// ? ExpandSubSelectors<
//     {
//       identifier: Selector['identifier']
//       field: Selector['field']
//       extract: Selector['extract']
//       exclude: Selector['exclude']
//       subSelectors: RestSubSelectors
//     },
//     SubSelector['subSelectors'] extends null
//       ? [
//           ...Acc,
//           {
//             identifier: MergeTwoSelectorsIdentifiers<
//               Selector['identifier'],
//               SubSelector['identifier']
//             >
//             field: MergeTwoSelectorsFields<
//               Selector['field'],
//               SubSelector['field']
//             >
//             extract: Selector['extract'] & SubSelector['extract']
//             exclude: Selector['exclude'] | SubSelector['exclude']
//             subSelectors: SubSelector['selectors']
//           },
//         ]
//       : [
//           ...Acc,
//           ...ExpandSubSelectors<{
//             identifier: MergeTwoSelectorsIdentifiers<
//               Selector['identifier'],
//               SubSelector['identifier']
//             >
//             field: MergeTwoSelectorsFields<
//               Selector['field'],
//               SubSelector['field']
//             >
//             extract: Selector['extract'] & SubSelector['extract']
//             exclude: Selector['exclude'] | SubSelector['exclude']
//             subSelectors: SubSelector['selectors']
//           }>,
//         ]
//   >
// : Acc

type pursed =
  ParseIt<'CallExpression > MemberExpression:matches(MemberExpression)[computed=true].callee'>
// ParseIt<':matches([l1]:matches([l2]:matches([l3]:matches(Aa[l4]))), Bb)'>
// // ParseIt<'[root]:matches([l1]:matches([l2]:matches([l3]Aaa, [l3][3])), [2]):matches(Aaa)'>
// // ParseIt<':matches(:matches(Aaa):matches(Aaa[1], Bbb[2]), :matches(Aaa[3], Bbb[4])):matches(Aaa)'>
type _mtyewr = PostprocessParsedSelector<pursed>
//      ^?
type afasf = ExpandSubSelectors<_mtyewr['left']>
//    ^?
type _afasf = ExpandSubSelectors<_mtyewr['right']>
//    ^?

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
              }
          : never
      : NeverError
  : NeverError

// expand subSelectors outside of PostprocessSelectors
type adsf = MergeTwoSelectors<
  PostprocessSelectors<[ParseIt<'Bbb'>, ParseIt<'.aaa'>]>,
  PostprocessSelectors<ParseIt<'Bbb.aaa > a[b]'>['r']>
>

// extract: unknown
// exclude: never
type MergeSelectorsImpl<
  PostprocessedSelectors extends PostprocessSelectorsAcc[],
  Acc extends PostprocessedSelectorsAcc,
> = PostprocessedSelectors extends [infer PostprocessedSelector, ...infer Rest]
  ? PostprocessedSelector extends PostprocessedSelectorsAcc
    ? "PostprocessedSelector['identifier'] extends "
    : never
  : Acc

type PostprocessMatchesSelectors<
  Selectors extends any[],
  Acc extends any[] = [],
> = Selectors extends [infer First, ...infer Rest]
  ? PostprocessMatchesSelectors<
      Rest,
      [...Acc, PostprocessParsedSelector<First>]
    >
  : Acc

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
                {
                  subSelectors: IntersectSelectors<
                    PostprocessMatchesSelectors<SubSelectors>,
                    Acc['subSelectors']
                  >
                } & Omit<Acc, 'subSelectors'>
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
    }
  >
>

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
      ? MegaCollapseBoundaries<
          ExpandSubSelectors<PostprocessParsedSelector<Left>>,
          ExpandSubSelectors<PostprocessParsedSelector<Right>>
        >
      : //ExpandSubSelectors<
        PostprocessSelectors<[T]>

type PrecollapseCollectBoundaries<
  Boundary extends PostprocessedSelectorsAcc,
  Ctx extends { field: any | null },
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
    ? ExtractChildDeps<Res>
    : //NonNullable<
      // ExtractNodeTypesFromNodes<
      Extract<Res, { [K in Ctx['field']['name']]: any }>[Ctx['field']['name']]
  : //  >
    // >
    never

type gooo1 = CollapseBoundariesAndPostprocessedSelector<
  //    ^?
  {
    identifier: 'CallExpression'
    field: null
    extract: unknown
    exclude: never
    subSelectors: null
  },
  {
    identifier: 'MemberExpression'
    field: null
    extract: unknown
    exclude: never
    subSelectors: null
  }
>

type CollapseBoundariesAndPostprocessedSelector<
  Boundary extends PostprocessedSelectorsAcc,
  Selector extends PostprocessedSelectorsAcc,
> = PrecollapseCollectBoundaries<Boundary, { field: Selector['field'] }> &
  // ExtractNodeTypesFromNodes<
  Exclude<
    TryToNarrowByExtracting<
      Selector['identifier'] extends null
        ? AST
        : PickNode<Selector['identifier']>,
      Selector['extract']
    >,
    Selector['exclude']
  >

type MegaCollapseBoundariesRecurser<
  Boundary extends PostprocessedSelectorsAcc,
  Selectors extends Array<PostprocessedSelectorsAcc>,
  Acc = [],
> = Selectors extends [infer First, ...infer Rest]
  ? MegaCollapseBoundariesRecurser<
      Boundary,
      Rest,
      [CollapseBoundariesAndPostprocessedSelector<Boundary, First>] extends [
        infer Res,
      ]
        ? [Res] extends [never]
          ? Acc
          : [...Acc, Res]
        : never
    >
  : Acc

type MegaCollapseBoundaries<
  Boundaries extends Array<PostprocessedSelectorsAcc>,
  Selectors extends Array<PostprocessedSelectorsAcc>,
  Acc = [],
> = Boundaries extends [infer First, ...infer Rest]
  ? MegaCollapseBoundaries<
      Rest,
      Selectors,
      [...Acc, ...MegaCollapseBoundariesRecurser<First, Selectors>]
    >
  : Acc

type ooo1 = CollapseBoundariesAndPostprocessedSelector<
  //    ^?
  {
    identifier: 'CallExpression'
    field: null
    extract: unknown
    exclude: never
    subSelectors: null
  },
  {
    identifier: 'MemberExpression'
    field: null
    extract: {
      computed: true
    }
    exclude: never
    subSelectors: null
  }
>

type ipursed =
  // ParseIt<'CallExpression > :matches(CallExpression > Identifier):matches(CallExpression > MemberExpression, Identifier)'>
  ParseIt<'CallExpression > :matches(:matches(MemberExpression[computed=true], Identifier),:matches(ArrayPattern, ArrayExpression))'>
// ParseIt<':matches([l1]:matches([l2]:matches([l3]:matches(Aa[l4]))), Bb)'>
// // ParseIt<'[root]:matches([l1]:matches([l2]:matches([l3]Aaa, [l3][3])), [2]):matches(Aaa)'>
// // ParseIt<':matches(:matches(Aaa):matches(Aaa[1], Bbb[2]), :matches(Aaa[3], Bbb[4])):matches(Aaa)'>
type i_mtyewr = PostprocessParsedSelector<ipursed>
//      ^?
type iafasf = MegaCollapseBoundaries<i_mtyewr['left'], i_mtyewr['right']>
//    ^?

// prettier-ignore
type _testPostprocessSelectors = [
  Expect<Equal<
    PostprocessSelectors<[{ type: 'attribute'; name: 'aaa' }]>,
    { extract: { aaa: string | number | boolean | symbol | object; }; exclude: never; identifier: null; field: null }
  >>,
  Expect<Equal<
    PostprocessSelectors<[{ type: 'identifier'; name: 'aaa' }]>,
    { attrs: []; identifier: { type: 'identifier'; name: 'aaa' }; field: null }
  >>,
  Expect<Equal<
    PostprocessSelectors<[{ type: 'identifier'; name: 'aaa' }, { type: 'identifier'; name: 'aaa' }]>,
    { attrs: []; identifier: { type: 'identifier'; name: 'aaa' }; field: null }
  >>,
  Expect<Equal<
    PostprocessSelectors<[{ type: 'identifier'; name: 'aaa' }, { type: 'identifier'; name: 'bbb' }]>,
    never
  >>,
  Expect<Equal<
    PostprocessSelectors<[{ type: 'field'; name: 'aaa' }]>,
    { attrs: []; identifier: null; field: { type: 'field'; name: 'aaa' } }
  >>,
]

type NameToAstNodeType<Name> = (typeof AST_NODE_TYPES)[Name]

type TryToNarrowByExtracting<T, U> = Extract<T, U> extends never
  ? Extract<T, { [K in keyof U]: any }>
  : Extract<T, U>

type IntersectBoundariesAndSelectors<
  Boundaries extends AST_NODE_TYPES,
  Selectors extends {
    identifier: any | null
    field: any | null
    extract: any
    exclude: any
  },
> = Exclude<
  TryToNarrowByExtracting<
    PickNode<
      Selectors['identifier'] extends null
        ? Boundaries
        : Boundaries & NameToAstNodeType<Selectors['identifier']['value']>
    >,
    Selectors['extract']
  >,
  Selectors['exclude']
>

type Parsed = ParseIt<'CallExpression > CallExpression > [callee]'>

type resolved = PostprocessSelectors<SelectorToSelectors<Parsed['right']>>
//     ^?
type afsaf = IntersectBoundariesAndSelectors<
  CollectBoundariesForChildRight<Parsed['left'], { field: ['field'] }>,
  PostprocessSelectors<SelectorToSelectors<Parsed['right']>>
>

type _res = Much<Parsed>
//    ^?

type SelectorToSelectors<Selector> = Selector extends {
  type: 'compound'
  selectors: infer Selectors
}
  ? Selectors
  : Selector extends
        | {
            type: 'identifier'
          }
        | {
            type: 'wildcard'
          }
        | {
            type: 'attribute'
          }
        | {
            type: 'field'
          }
    ? [Selector]
    : never

// matches
// compound +
// wildcard
// identifier +
// attribute
// literal /
// type /
// regexp /
// field
// not
// has
// class
type Much<T> = T extends {
  type: 'child'
  left: infer Left
  right: infer Right
}
  ? PostprocessSelectors<
      SelectorToSelectors<Right>
    > extends infer ResolvedSelectors
    ? IntersectBoundariesAndSelectors<
        CollectBoundariesForChildRight<
          Left,
          { field: ResolvedSelectors['field'] }
        >,
        ResolvedSelectors
      >
    : never
  : T extends {
        type: 'identifier'
        value: infer IdentifierName
      }
    ? PickNode<IdentifierName>
    : T extends {
          type: 'wildcard'
        }
      ? AST
      : 'unsupported'
