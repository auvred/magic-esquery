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
  // ParseIt<'CallExpression, MemberExpression:matches([computed=true],[computed=false])'>,
  ParseIt<'CallExpression:matches(:matches([aa].cccc), :matches([eee])):not([bb])'>,
  // ParseIt<':not(CallExpression, MemberExpression)'>,
  WildcardMeta
  // ParseIt<'[aa]:matches(A,B)'>
>

type PostprocessMetasFromAnd<
  Metas extends MetaAcc[],
  Acc extends {
    identifier: string | null
    notIdentifiers: string[]
    field: string | null
    notFields: string[]
    extract: any
    notExtract: any
    exclude: any
    notExclude: any
  } = {
    identifier: null
    notIdentifiers: []
    field: null
    notFields: []
    extract: unknown
    notExtract: never
    exclude: never
    notExclude: unknown
  },
> = Metas extends [infer Meta, ...infer Rest]
  ? Meta extends MetaAcc
    ? PostprocessMetasFromAnd<
        Rest,
        Meta extends {
          type: 'not'
          arg: any
        }
          ? 2
          : {
              notIdentifiers: Meta['identifier'] extends null
                ? Acc['notIdentifiers']
                : [...Acc['notIdentifiers'], Meta['identifier']]
              notFields: Meta['field'] extends null
                ? Acc['notFields']
                : [...Acc['notFields'], Meta['field']]
              notExtract: unknown extends Acc['extract'] ...
            }
      >
    : never
  : Acc

type PostprocessDnf<D> = D extends {
  type: 'or'
  args: any[]
}
  ? q
  : NeverError<['D is not "or"', D]>

type ddd = Dnf<adfs>

type CollapseTwoMetasInChildRelations<Left, Right> = 1
type CollapseChildBoundaries<Left, Right> = 1

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
