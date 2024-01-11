import type { ParseIt } from './parser'
import type { TSESTree } from '@typescript-eslint/typescript-estree'

type PickNode<T, AST> = Extract<AST, { type: T }>

export declare const AttrValueIsUnsafeToIntersect: unique symbol
type AttrValueIsUnsafeToIntersect = typeof AttrValueIsUnsafeToIntersect

type Distribute<U> = (U extends any ? { type: U } : never)['type']

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
  ? Extract<T, { [K in keyof U]: any }>
  : Extract<T, U>

type PostProcessCompoundSelectors<
  Selectors extends any[],
  AST,
  Acc extends {
    identifier: any
    field: string | null
    attrs: any[]
  } = {
    identifier: null
    field: null
    attrs: []
  },
> = Selectors extends [infer First, ...infer Rest]
  ? First extends {
      type: 'wildcard'
    }
    ? PostProcessCompoundSelectors<
        Rest,
        AST,
        {
          identifier: Acc['identifier']
          attrs: Acc['attrs']
          field: Acc['field']
        }
      >
    : First extends {
          type: 'attribute'
        }
      ? PostProcessCompoundSelectors<
          Rest,
          AST,
          {
            identifier: Acc['identifier']
            attrs: [...Acc['attrs'], First]
            field: Acc['field']
          }
        >
      : First extends {
            type: 'field'
            name: infer Name
          }
        ? Name extends string
          ? Acc['field'] extends null
            ? PostProcessCompoundSelectors<
                Rest,
                AST,
                {
                  identifier: Acc['identifier']
                  attrs: Acc['attrs']
                  field: Name
                }
              >
            : Name extends Acc['field']
              ? PostProcessCompoundSelectors<
                  Rest,
                  AST,
                  {
                    identifier: Acc['identifier']
                    attrs: Acc['attrs']
                    field: Acc['field']
                  }
                >
              : never
          : never
        : Acc['identifier'] extends null
          ? PostProcessCompoundSelectors<
              Rest,
              AST,
              {
                identifier: MatchIt<First, AST>
                attrs: Acc['attrs']
                field: Acc['field']
              }
            >
          : MatchIt<First, AST> extends infer Matched
            ? Acc['identifier'] & Matched extends never
              ? never
              : PostProcessCompoundSelectors<
                  Rest,
                  AST,
                  {
                    identifier: Acc['identifier'] & Matched
                    attrs: Acc['attrs']
                    field: Acc['field']
                  }
                >
            : never
  : Acc['field'] extends never
    ? // wrong fields combination
      never
    : Acc['identifier'] extends null
      ? MatchByField<AST, Acc['field'], AST>
      : MergeAttrs<Acc['attrs']> extends {
            implicitExclude: infer ImplicitExclude
            implicitInclude: infer ImplicitInclude
            explicit: infer Explicit
          }
        ? Extract<MatchByField<AST, Acc['field'], AST>, { type: any }> &
            TryToNarrowByExtracting<
              TryToNarrowByExtracting<
                Exclude<Acc['identifier'], ImplicitExclude>,
                Explicit
              >,
              ImplicitInclude
            >
        : never

type fadsfas = (
  | (TSESTree.SpreadElement | TSESTree.Expression | null)[]
  | (TSESTree.DestructuringPattern | null)[]
) &
  TSESTree.Node

// type S = 'VariableDeclarator > :matches(CallExpression, MemberExpression)'
type S = 'CallExpression > .callee'
type pppp = ParseIt<S>
//     ^?
type fasqf = PostProcessCompoundSelectors<
  //     ^?
  pppp['selectors'],
  TSESTree.Node
>
type Res = PostProcessChild<pppp['left'], pppp['right'], TSESTree.Node>
//   ^?

type MatchByField<Left, Right, AST> = Right extends string
  ? Right extends `${infer Path}.${infer Rest}`
    ? Extract<Left, { [K in Path]: any }> extends infer ExtractRes
      ? ExtractRes extends never
        ? `Right (${Right}) is not a keyof Prev`
        : ExtractRes extends {
              [K in Path]: infer Value
            }
          ? MatchByField<Value, Rest, AST>
          : never
      : never
    : Right extends ''
      ? Left
      : Right extends string
        ? Extract<Left, { [K in Right]: any }> extends never
          ? never
          : Extract<Left, { [K in Right]: any }> extends {
                [K in Right]: infer Value
              }
            ? Value
            : never
        : never
  : AST

type FilterFields<
  Selectors extends any[],
  Acc extends string | null = null,
> = Selectors extends [infer First, ...infer Rest]
  ? First extends {
      type: 'field'
      name: infer Name
    }
    ? Name extends string
      ? Acc extends null
        ? FilterFields<Rest, Name>
        : Name extends Acc
          ? FilterFields<Rest, Acc>
          : never
      : never
    : FilterFields<Rest, Acc>
  : Acc

// if we try to intersect these types manually, tsserver just says:
//  - "Expression produces a union type that is too complex to represent"
//
// So instead we're intersecting just 'type'
//
// After a simple benchmarking it shows better time on tsc up to 25% faster
type CalculateSuperMegaIntersection<AST, Left, Right> = Left extends {
  type: infer LeftTypes
}
  ? Right extends {
      type: infer RightTypes
    }
    ? Extract<AST, { type: LeftTypes & RightTypes }>
    : Left & Right
  : Left & Right

type PostProcessChild<Left, Right, AST> = Right extends {
  type: 'compound'
  selectors: infer Selectors
}
  ? Selectors extends unknown[]
    ? // MatchByField<MatchIt<Left, AST>, FilterFields<Selectors>, AST>,
      // PostProcessCompoundSelectors<Selectors, AST>,
      CalculateSuperMegaIntersection<
        AST,
        MatchByField<MatchIt<Left, AST>, FilterFields<Selectors>, AST>,
        PostProcessCompoundSelectors<Selectors, AST>
      >
    : never
  : Right extends
        | {
            type: 'field'
          }
        | {
            type: 'matches'
          }
    ? PostProcessChild<Left, { type: 'compound'; selectors: [Right] }, AST>
    : Right extends {
          type: 'identifier'
        }
      ? MatchIt<Right, AST>
      : 'todo'

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
        ? PostProcessChild<Left, Right, AST>
        : T extends {
              type: 'wildcard'
            }
          ? AST
          : T extends {
                type: 'attribute'
              }
            ? PostProcessCompoundSelectors<[T], AST>
            : T extends
                  | {
                      type: 'descendant'
                    }
                  | {
                      type: 'adjacent'
                    }
                  | {
                      type: 'sibling'
                    }
              ? T extends {
                  // we don't care what's on left
                  right: infer Right
                }
                ? MatchIt<Right, AST>
                : never
              : unknown
