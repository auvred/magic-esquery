import type { Equal } from '@type-challenges/utils'

type PickNode<T, AST> = Extract<AST, { type: T }>

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

type MergeAttrs<
  Attrs extends any[],
  Acc extends {
    explicit: any
    implicitExclude: any
    implicitInclude: any
  } = {
    explicit: unknown
    implicitExclude: never
    implicitInclude: unknown
  },
> = Attrs extends [infer First, ...infer Rest]
  ? First extends {
      name: infer AttrName
    }
    ? AttrName extends string
      ? First extends {
          operator: infer AttrOp
          value: infer AttrValue
        }
        ? AttrValue extends {
            type: 'literal'
            value: infer AttrValueValue
          }
          ? AttrOp extends '='
            ? MergeAttrs<
                Rest,
                {
                  implicitInclude: Acc['implicitInclude'] &
                    TryToParseAttrValue<AttrValueValue> extends AttrValueIsUnsafeToIntersect
                    ? unknown
                    : {
                        [K in AttrName]: TryToParseAttrValue<AttrValueValue>
                      }
                  implicitExclude: Acc['implicitExclude']
                  explicit: Acc['explicit']
                }
              >
            : MergeAttrs<
                Rest,
                {
                  implicitInclude: Acc['implicitInclude']
                  implicitExclude:
                    | Acc['implicitExclude']
                    | {
                        [K in AttrName]: TryToParseAttrValue<AttrValueValue>
                      }
                  explicit: Acc['explicit']
                }
              >
          : MergeAttrs<Rest, Acc>
        : MergeAttrs<
            Rest,
            {
              implicitInclude: Acc['implicitInclude']
              implicitExclude: Acc['implicitExclude']
              explicit: Acc['explicit'] & {
                // https://github.com/estools/esquery/blob/909bea6745d33d33870b5d2c3382b4561d00d923/esquery.js#L221
                // != null
                [K in AttrName]: string | number | boolean | symbol | object
              }
            }
          >
      : never
    : never
  : Acc

type TryToNarrowByExtracting<T, U> = Extract<T, U> extends never
  ? T
  : Extract<T, U>

type PostProcessCompoundSelectors<
  Selectors extends any[],
  AST,
  Acc extends {
    identifier: any
    attrs: any[]
  } = {
    identifier: null
    attrs: []
  },
> = Selectors extends [infer First, ...infer Rest]
  ? First extends {
      type: 'identifier'
    }
    ? Acc['identifier'] extends null
      ? PostProcessCompoundSelectors<
          Rest,
          AST,
          { identifier: First; attrs: Acc['attrs'] }
        >
      : Equal<Acc['identifier'], First> extends true
        ? PostProcessCompoundSelectors<Rest, AST, Acc>
        : never
    : First extends {
          type: 'wildcard'
        }
      ? PostProcessCompoundSelectors<
          Rest,
          AST,
          { identifier: Acc['identifier']; attrs: Acc['attrs'] }
        >
      : First extends {
            type: 'attribute'
          }
        ? PostProcessCompoundSelectors<
            Rest,
            AST,
            { identifier: Acc['identifier']; attrs: [...Acc['attrs'], First] }
          >
        : PostProcessCompoundSelectors<Rest, AST, Acc>
  : Acc['identifier'] extends null
    ? AST
    : MergeAttrs<Acc['attrs']> extends {
          implicitExclude: infer ImplicitExclude
          implicitInclude: infer ImplicitInclude
          explicit: infer Explicit
        }
      ? TryToNarrowByExtracting<
          TryToNarrowByExtracting<
            Exclude<MatchIt<Acc['identifier'], AST>, ImplicitExclude>,
            Explicit
          >,
          ImplicitInclude
        >
      : never

type PostProcessChildWithField<Left, Right> =
  Right extends `${infer Path}.${infer Rest}`
    ? Extract<Left, { [K in Path]: any }> extends infer ExtractRes
      ? ExtractRes extends never
        ? `Right (${Right}) is not a keyof Prev`
        : ExtractRes extends {
              [K in Path]: infer Value
            }
          ? PostProcessChildWithField<Value, Rest>
          : never
      : never
    : Right extends ''
      ? Left
      : Right extends string
        ? Extract<Left, { [K in Right]: any }> extends infer ExtractRes
          ? ExtractRes extends never
            ? `Right is not a keyof Prev`
            : ExtractRes extends {
                  [K in Right]: infer Value
                }
              ? Value
              : never
          : never
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
        ? PostProcessCompoundSelectors<Selectors, AST>
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
          : T extends {
                type: 'attribute'
              }
            ? PostProcessCompoundSelectors<[T], AST>
            : T extends {
                  type: 'descendant'
                  // we don't care what's on left
                  right: infer Right
                }
              ? MatchIt<Right, AST>
              : unknown
