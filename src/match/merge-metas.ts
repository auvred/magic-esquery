import type {
  CarefullyIntersectNodes,
  IntersectAndSimplify,
  MetaAcc,
  NeverError,
} from './utils'
import type { Equal, Expect } from '@type-challenges/utils'
import type { TSESTree } from '@typescript-eslint/typescript-estree'

// TODO: lowercase them
export type MergeTwoMetaIdentifiers<
  L extends string | null,
  R extends string | null,
> = L extends null
  ? R
  : R extends null
    ? L
    : Equal<L, R> extends true
      ? L
      : // one selector can't contain two different identifiers
        NeverError<`different identifiers: ${L}, ${R}`>

// prettier-ignore
type _testMergeTwoMetaIdentifiers = [
  Expect<Equal<MergeTwoMetaIdentifiers<null, 'B'>, 'B'>>,
  Expect<Equal<MergeTwoMetaIdentifiers<'A', null>, 'A'>>,
  Expect<Equal<MergeTwoMetaIdentifiers<null, null>, null>>,
  Expect<Equal<MergeTwoMetaIdentifiers<'A', 'A'>, 'A'>>,
  Expect<Equal<MergeTwoMetaIdentifiers<'A', 'B'>, NeverError<'different identifiers: A, B'>>>,
]

// for now just skipping composite fields (probably we should add it, but it may violate perf)
type CheckMetaField<T, If = null, Else = T> = T extends `${string}.${string}`
  ? If
  : Else
export type MergeTwoMetaFields<
  L extends string | null,
  R extends string | null,
> = L extends null
  ? CheckMetaField<R>
  : R extends null
    ? CheckMetaField<L>
    : CheckMetaField<
        L,
        CheckMetaField<R>,
        CheckMetaField<
          R,
          L,
          Equal<L, R> extends true
            ? L
            : // one selector can't contain two different fields
              NeverError<`different fields: ${L}, ${R}`>
        >
      >

// prettier-ignore
type _testMergeTwoMetaFields = [
  Expect<Equal<MergeTwoMetaFields<null, 'B'>, 'B'>>,
  Expect<Equal<MergeTwoMetaFields<'A', null>, 'A'>>,
  Expect<Equal<MergeTwoMetaFields<null, null>, null>>,
  Expect<Equal<MergeTwoMetaFields<'A', 'A'>, 'A'>>,
  Expect<Equal<MergeTwoMetaFields<'A', 'B'>, NeverError<'different fields: A, B'>>>,
  
  Expect<Equal<MergeTwoMetaFields<null, 'B.B'>, null>>,
  Expect<Equal<MergeTwoMetaFields<'A.A', 'B'>, 'B'>>,
  Expect<Equal<MergeTwoMetaFields<'A', 'B.B'>, 'A'>>,
]

// Few thoughts about merging logic
// n: - means resolved AST Nodes
// s: - means matched meta
//
// ':matches(CallExpression > MemberExpression, Identifier):matches(CallExpression > *, *)'
// n:MemberExpression + s:Identifier
//
// ':matches(:matches(CallExpression > MemberExpression), :matches(Literal)):matches(CallExpression > [computed=true], [bigint])'
// ((n:MemberExpression) + (s:Literal)) & (n:MemberExpressionComputedName + s:[bigint])
// (n:MemberExpression + s:Literal) & (n:MemberExpressionComputedName + s:[bigint])
// n:MemberExpressionComputedName + s:Literal[bigint]
//
// ':matches(:matches(CallExpression > MemberExpression), :matches(Literal)):matches([computed=true], * > [bigint])'
// ((n:MemberExpression) + (s:Literal)) & (s:[computed=true] + n:BigIntLiteral)
// (n:MemberExpression + s:Literal) & (s:[computed=true] + n:BigIntLiteral)
// (n:MemberExpression & s:[computed=true]) + (n:MemberExpression & n:BigIntLiteral) + (s:Literal & s:[computed=true]) + (s:Literal & n:BigIntLiteral)
// --- expanding (uses merge internally)!
//   1) (n:MemberExpression & s:[computed=true]) = n:MemberExpression|s:[computed=true]
//   2) (n:MemberExpression & n:BigIntLiteral) = never
//   3) (s:Literal & s:[computed=true]) = s:Literal[computed=true]
//   4) (s:Literal & n:BigIntLiteral) = n:BigIntLiteral|s:Literal
// n:MemberExpression|s:[computed=true] + s:Literal[computed=true] + n:BigIntLiteral|s:Literal               --- expanded metas
// --- then extracting expanded metas from the universe of all AST Nodes (collapsing boundaries)
//   1) n:MemberExpression|s:[computed=true] = (AST & s:[computed=true]) & n:MemberExpression = n:MemberExpressionComputedName
//   2) s:Literal[computed=true] = AST & s:Literal[computed=true] = never
//   3) n:BigIntLiteral|s:Literal = (AST & s:Literal) & n:BigIntLiteral = n:BigIntLiteral
// n:MemberExpressionComputedName + n:BigIntLiteral
//
// ':matches(CallExpression > MemberExpression, MemberExpression)[computed=true]'
// (n:MemberExpression + s:MemberExpression) & s:[computed=true]
// --- expanding
// (n:MemberExpression & s:[computed=true]) + (s:MemberExpression & s:[computed=true])
//   1) (n:MemberExpression & s:[computed=true]) = n:MemberExpression|s:[computed=true]        --- merging metas
//   2) (s:MemberExpression & s:[computed=true]) = s:MemberExpression[computed=true]           --- merging metas
// n:MemberExpression|s:[computed=true] + s:MemberExpression[computed=true]
// --- collapsing boundaries
//   1) n:MemberExpression|s:[computed=true] = (AST & s:[computed=true]) & n:MemberExpression = n:MemberExpressionComputedName
//   2) s:MemberExpression[computed=true] = (AST & s:MemberExpression[computed=true]) = n:MemberExpressionComputedName
// n:MemberExpressionComputedName + n:MemberExpressionComputedName
// n:MemberExpressionComputedName
//
//
// ':matches(:matches(CallExpression > MemberExpression, * > Literal)):matches(* > Identifier)
// n:MemberExpression|s:[computed=true]         --- so we just blindly merging all metas and nodes
//
// ':matches(:matches(CallExpression > MemberExpression, [type]), :matches(Literal))'
// :matches(:matches(CallExpression > MemberExpression, [type]), :matches(Literal)) - parsing:
//   :matches - parsing matches:
//     expanding all child selectors:
//       :matches(CallExpression > MemberExpression, [type]) - parsing:
//         :matches - parsing matches:
//           expanding all child selectors:
//             CallExpression > MemberExpression - parsing:
//               n:MemberExpression
//             [type] - computing it:
//               s:[type]
//           n:MemberExpression + s:[type]
//         n:MemberExpression + s:[type]
//       :matches(Literal) - parsing
//         :matches - parsing matches:
//           expanding all child selectors:
//             Literal - parsing:
//               s:Literal
//             s:Literal
//           s:Literal
//         s:Literal
//       should expand [n:MemberExpression + s:[type], s:Literal]:
//         (n:MemberExpression & s:Literal) + (s:[type] & s:Literal)
//         n:MemberExpression|s:Literal + s:Literal[type]
//
//       gotcha! we don't even need to keep subSelectors ( we compute them before initializing parent !!! )
//
//
// ':matches(:not(CallExpression > MemberExpression, Literal), Identifier)
// {
//   not: [
//     n:MemberExpression,
//     s:Literal
//   ]
// }
//
//
// TODO:
// ':not(* > :not(CallExpression > MemberExpression, Literal), * > Literal)'
// :not(CallExpression > MemberExpression, Literal) - any node except
//
//
//
//
//
// NOTE: :not matches only nodes that doesn't match every child selector of :not
//
//
// ForStatement > :not([type]:matches([name=update], .init), .test)
// ForStatement > :not([type][name=update], [type].init, .test)
//
// ForStatement > :not([type]:matches(:not([name=update]), .init), .test)
// ForStatement > :not([type]:not([name=update]), [type].init, .test)
//
// NOTE: we ignore any non-compound child of :not
// child, sibling, adjacent, descendant
// These things are filtering nodes that live in some context. In most cases
// that I can imagine it doesn't really change the type of matched nodes
//
// so:
// expand nots,matches, etc
//
// :not(a, b) = not(a) and not(b)
// :not(:not(a), :not(b)) = a and b
// :not(:not(a, b)) = not(not(a) and not(b)) = not(not(a)) or not(not(b)) = a or b
// :not(:not(a, b), c, d) = (a or b) and not(c) and not(d) = (a and not(c) and not(d)) or (b and not(c) and not(d))
//
// okay, we should convert it to disjunctive normal form, this may be a bit painful to implement on type-level
// https://stackoverflow.com/a/70847281
//
// :matches(:not(a, b), c) = (not(a) and not(b)) or c
//
//
// :matches(:matches(CallExpression > MemberExpression), :matches(Literal)):matches([computed=true], * > [bigint])
// (n:MemberExpression or s:Literal) and (s:[computed=true] or n:BigIntLiteral)
// (n:MemberExpression and s:[computed=true]) or (s:Literal and s:[computed=true]) or (n:MemberExpression and n:BigIntLiteral) or (s:Literal and n:BigIntLiteral)
// n:MemberExpression|s:[computed=true] or s:Literal[computed=true] or false or n:BigIntLiteral|s:Literal
// n:MemberExpressionComputedName or false or false or n:BigIntLiteral
// n:MemberExpressionComputedName or n:BigIntLiteral
//

export type MergeTwoMetas<
  L extends MetaAcc,
  R extends MetaAcc,
> = MergeTwoMetaIdentifiers<
  L['identifier'],
  R['identifier']
> extends infer MergedIdentifiers
  ? MergedIdentifiers extends NeverError
    ? NeverError<MergedIdentifiers>
    : MergeTwoMetaFields<L['field'], R['field']> extends infer MergedFields
      ? MergedFields extends NeverError
        ? NeverError<MergedFields>
        : {
            identifier: MergedIdentifiers
            field: MergedFields
            extract: IntersectAndSimplify<L['extract'], R['extract']>
            exclude: L['exclude'] | R['exclude']
            inferredNodes: CarefullyIntersectNodes<
              L['inferredNodes'],
              R['inferredNodes']
            >
          }
      : NeverError
  : NeverError

// prettier-ignore
type _testMergeTwoMetas = [
  Expect<Equal<MergeTwoMetas<{
    identifier: null
    field: null
    extract: unknown
    exclude: never
    inferredNodes: null
  }, {
    identifier: null
    field: null
    extract: unknown
    exclude: never
    inferredNodes: null
  }>, {
    identifier: null
    field: null
    extract: unknown
    exclude: never
    inferredNodes: null
  }>>,
  Expect<Equal<MergeTwoMetas<{
    identifier: 'A'
    field: null
    extract: {
      computed: false
    }
    exclude: {
      string: string | number | boolean | symbol | object
    }
    inferredNodes: TSESTree.BigIntLiteral | TSESTree.BooleanLiteral | TSESTree.ClassDeclarationWithName
  }, {
    identifier: null
    field: 'field'
    extract: {
      bigint: string | number | boolean | symbol | object
    }
    exclude: {
      computed: true
    }
    inferredNodes: TSESTree.Literal | TSESTree.ImportSpecifier
  }>, {
    identifier: 'A'
    field: 'field'
    extract: {
      computed: false
      bigint: string | number | boolean | symbol | object
    }
    exclude: {
      string: string | number | boolean | symbol | object
    } | {
      computed: true
    }
    inferredNodes: TSESTree.BigIntLiteral | TSESTree.BooleanLiteral
  }>>,
]

export type PatchMeta<
  T extends MetaAcc,
  Field extends keyof MetaAcc,
  Value,
> = MergeTwoMetas<
  T,
  // @ts-expect-error - Field is keyof T
  { [K in Field]: Value } & Omit<WildcardMeta, Field>
>

export type WildcardMeta = {
  identifier: null
  field: null
  extract: unknown
  exclude: never
  inferredNodes: null
}

// TODO:
// :matches(MemberExpression, Literal):not([computed=true]):not(:matches(:not(:matches(:not(Program MemberExpression)))))
