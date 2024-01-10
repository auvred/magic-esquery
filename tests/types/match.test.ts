import type { MatchIt } from '../../src/matcher'
import type { ParseIt } from '../../src/parser'
import type { Equal, Expect } from '@type-challenges/utils'
import type { TSESTree as T } from '@typescript-eslint/typescript-estree'

type Match<_T extends string> = MatchIt<ParseIt<_T>, T.Node>

type a = T.Expression extends T.Node ? 1 : 2

export type TestCases = [
  Expect<Equal<Match<'Program'>, T.Program>>,
  Expect<
    Equal<Match<'Program, MemberExpression'>, T.Program | T.MemberExpression>
  >,
  Expect<Equal<Match<'Program[body][bbbody="aa"]'>, T.Program>>,
  Expect<Equal<Match<'Program[body]Program'>, T.Program>>,
  Expect<Equal<Match<'Program[body]CallExpression'>, never>>,
  Expect<
    Equal<
      Match<'Program[body], MemberExpression[name=1]'>,
      T.Program | T.MemberExpression
    >
  >,
  Expect<
    Equal<
      Match<'Program:body.field[attr], MemberExpression[name=1].field, CallExpression'>,
      T.Program | T.MemberExpression | T.CallExpression
    >
  >,
  Expect<Equal<Match<'Identifier.id'>, T.Identifier>>,
  Expect<Equal<Match<'MemberExpression > Identifier'>, T.Identifier>>,
  Expect<
    Equal<
      Match<'MemberExpression > Identifier[attr] > CallExpression[attr=value]'>,
      T.CallExpression
    >
  >,
  Expect<
    Equal<
      Match<'MemberExpression > .property'>,
      T.PrivateIdentifier | T.Expression
    >
  >,
  Expect<
    Equal<
      Match<'MemberExpression > .property > .elements'>,
      | (T.SpreadElement | T.Expression | null)[]
      | (T.DestructuringPattern | null)[]
    >
  >,
]
