import type { MatchIt } from '../../src/matcher'
import type { ParseIt } from '../../src/parser'
import type { Equal, Expect } from '@type-challenges/utils'
import type { TSESTree as T } from '@typescript-eslint/typescript-estree'

type Match<_T extends string> = MatchIt<ParseIt<_T>, T.Node>

export type TestCases = [
  Expect<Equal<Match<'Program'>, T.Program>>,
  Expect<Equal<Match<'Program > *'>, T.Node>>,
  Expect<Equal<Match<'Program, MemberExpression'>, T.Program | T.MemberExpression>>,
  Expect<Equal<Match<'[attr]'>, T.Node>>,
  Expect<Equal<Match<'[attr][bbb=asdf]'>, T.Node>>,
  Expect<Equal<Match<'Program[body][bbbody="aa"]'>, T.Program>>,
  Expect<Equal<Match<'Program[body]Program'>, T.Program>>,
  Expect<Equal<Match<'Program[body]CallExpression'>, never>>,
  Expect<Equal<Match<'Program[body], MemberExpression[name=1]'>, T.Program | T.MemberExpression>>,
  Expect<Equal<Match<'Program[body], MemberExpression[name=1].expression, CallExpression'>, T.Program | T.MemberExpression | T.CallExpression>>,
  Expect<Equal<Match<'Program:body.field[attr], MemberExpression[name=1].expression, CallExpression'>, T.MemberExpression | T.CallExpression>>,
  Expect<Equal<Match<'Identifier.id'>, T.Identifier>>,
  Expect<Equal<Match<'MemberExpression > Identifier'>, T.Identifier>>,
  Expect<Equal<Match<'MemberExpression > Identifier[attr] > CallExpression[attr=value]'>, T.CallExpression>>,
  Expect<Equal<Match<'MemberExpression > .property'>, T.PrivateIdentifier | T.Expression>>,
  Expect<Equal<Match<'MemberExpression > .property > .elements'>, (T.SpreadElement | T.Expression | null)[] | (T.DestructuringPattern | null)[]>>,
  Expect<Equal<Match<'MemberExpression > .property.elements'>, (T.SpreadElement | T.Expression | null)[] | (T.DestructuringPattern | null)[]>>,

  Expect<Equal<Match<'ExportNamedDeclaration[source]'>, T.ExportNamedDeclarationWithSource>>,
  Expect<Equal<Match<'ExportNamedDeclaration[source!=null]'>, T.ExportNamedDeclarationWithSource>>,
  Expect<Equal<Match<'ExportNamedDeclaration[source!="null"]'>, T.ExportNamedDeclarationWithSource>>,
  Expect<Equal<Match<'ExportNamedDeclaration[source=null]'>, T.ExportNamedDeclarationWithoutSourceWithMultiple | T.ExportNamedDeclarationWithoutSourceWithSingle>>,

  Expect<Equal<Match<'MemberExpression[computed=false]'>, T.MemberExpressionNonComputedName>>,
  Expect<Equal<Match<'MemberExpression[computed!=false]'>, T.MemberExpressionComputedName>>,
  Expect<Equal<Match<'MemberExpression[computed=true]'>, T.MemberExpressionComputedName>>,
  Expect<Equal<Match<'MemberExpression[computed=true], MemberExpression[computed=false]'>, T.MemberExpression>>,
  Expect<Equal<Match<'MemberExpression[computed!="asdf"]'>, T.MemberExpression>>,

  Expect<Equal<Match<'Identifier[name = aaa]'>, T.Identifier>>,
  Expect<Equal<Match<'Identifier[name != aaa]'>, T.Identifier>>,

  Expect<Equal<Match<'VariableDeclarator :matches(Identifier,Literal)'>, T.Identifier | T.Literal>>,
  Expect<Equal<Match<'VariableDeclarator :matches(MemberExpression[computed=false],Literal)'>, T.Literal | T.MemberExpressionNonComputedName>>,
  Expect<Equal<Match<':matches(Identifier,Literal)'>, T.Identifier | T.Literal>>,
  Expect<Equal<Match<'Identifier:matches(Identifier,Literal)'>, T.Identifier>>,

  Expect<Equal<Match<'CallExpression:matches(CallExpression, MemberExpression)'>, T.CallExpression>>,
  Expect<Equal<Match<'[callee]:matches(CallExpression, MemberExpression)'>, T.CallExpression>>,
  Expect<Equal<Match<':matches(CallExpression, MemberExpression)[computed=true]'>, T.MemberExpressionComputedName>>,
  Expect<Equal<Match<'CallExpression[type]:matches(CallExpression, MemberExpression)[computed=true]'>, never>>,

  Expect<Equal<Match<'.body'>, TSESTree.ClassBody | TSESTree.TSInterfaceBody | TSESTree.TSModuleBlock | TSESTree.Expression | TSESTree.Statement | TSESTree.Statement[] | TSESTree.ClassElement[] | TSESTree.ProgramStatement[] |TSESTree.TypeElement[] | null | undefined>>,
  Expect<Equal<Match<'*.body'>, TSESTree.ClassBody | TSESTree.TSInterfaceBody | TSESTree.TSModuleBlock | TSESTree.Expression | TSESTree.Statement | TSESTree.Statement[] | TSESTree.ClassElement[] | TSESTree.ProgramStatement[] |TSESTree.TypeElement[] | null | undefined>>,

  Expect<Equal<Match<'VariableDeclarator > :matches(CallExpression, MemberExpression)'>, T.CallExpression | T.MemberExpression>>,
  Expect<Equal<Match<'CallExpression > .callee'>, T.LeftHandSideExpression>>,
  Expect<Equal<Match<'CallExpression > *.callee'>, T.LeftHandSideExpression>>,
  Expect<Equal<Match<'CallExpression > *[type].callee'>, T.LeftHandSideExpression>>,
  Expect<Equal<Match<'CallExpression > *.callee[type].callee'>, T.LeftHandSideExpression>>,
  Expect<Equal<Match<'MemberExpression > *.property[type].object'>, never>>,
  Expect<Equal<Match<'CallExpression > MemberExpression[type].callee'>, T.MemberExpression>>,
  Expect<Equal<Match<'CallExpression > :matches(MemberExpression, Literal)[type].callee'>, T.MemberExpression | T.Literal>>,

  Expect<Equal<Match<'BlockStatement > .body:matches(BreakStatement, ClassDeclarationWithName, Literal)'>, T.BreakStatement | T.ClassDeclarationWithName>>
]
