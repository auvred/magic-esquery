import type { MatchIt } from '../../src/matcher'
import type { ParseIt } from '../../src/parser'
import type { Equal, Expect } from '@type-challenges/utils'
import type { TSESTree as T } from '@typescript-eslint/typescript-estree'

type Match<_T extends string> = MatchIt<ParseIt<_T>, T.Node>

export type TestCases = [
  Expect<Equal<Match<'Program'>, T.Program>>,
  Expect<Equal<Match<'Program > *'>, T.Node>>,
  Expect<
    Equal<Match<'Program, MemberExpression'>, T.Program | T.MemberExpression>
  >,
  Expect<Equal<Match<'[attr]'>, T.Node>>,
  Expect<Equal<Match<'[attr][bbb=asdf]'>, T.Node>>,
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

  Expect<
    Equal<
      Match<'ExportNamedDeclaration[source]'>,
      T.ExportNamedDeclarationWithSource
    >
  >,
  Expect<
    Equal<
      Match<'ExportNamedDeclaration[source!=null]'>,
      T.ExportNamedDeclarationWithSource
    >
  >,
  Expect<
    Equal<
      Match<'ExportNamedDeclaration[source!="null"]'>,
      T.ExportNamedDeclarationWithSource
    >
  >,
  Expect<
    Equal<
      Match<'ExportNamedDeclaration[source=null]'>,
      | T.ExportNamedDeclarationWithoutSourceWithMultiple
      | T.ExportNamedDeclarationWithoutSourceWithSingle
    >
  >,

  Expect<
    Equal<
      Match<'MemberExpression[computed=false]'>,
      T.MemberExpressionNonComputedName
    >
  >,
  Expect<
    Equal<
      Match<'MemberExpression[computed!=false]'>,
      T.MemberExpressionComputedName
    >
  >,
  Expect<
    Equal<
      Match<'MemberExpression[computed=true]'>,
      T.MemberExpressionComputedName
    >
  >,
  Expect<
    Equal<Match<'MemberExpression[computed!="asdf"]'>, T.MemberExpression>
  >,

  Expect<Equal<Match<'Identifier[name = aaa]'>, T.Identifier>>,
  Expect<Equal<Match<'Identifier[name != aaa]'>, T.Identifier>>,

  Expect<
    Equal<
      Match<'VariableDeclarator :matches(Identifier,Literal)'>,
      T.Identifier | T.Literal
    >
  >,
  Expect<
    Equal<
      Match<'VariableDeclarator :matches(MemberExpression[computed=false],Literal)'>,
      T.Literal | T.MemberExpressionNonComputedName
    >
  >,
  Expect<
    Equal<Match<':matches(Identifier,Literal)'>, T.Identifier | T.Literal>
  >,
  Expect<Equal<Match<'Identifier:matches(Identifier,Literal)'>, T.Identifier>>,
]
