import type { MatchIt } from '../../src/matcher'
import type { ParseIt } from '../../src/parser'
import type { Equal, Expect } from '../../src/utils'
import type { TSESTree as T } from '@typescript-eslint/typescript-estree'

type Match<_T extends string> = MatchIt<ParseIt<_T>, T.Node>

export type TestCases = [
  Expect<Equal<Match<'Program'>, T.Program>>,
  Expect<Equal<Match<'Program > *'>, T.ProgramStatement>>,
  Expect<Equal<Match<'Program, MemberExpression'>, T.Program | T.MemberExpression>>,
  Expect<Equal<Match<'[attr]'>, never>>,
  Expect<Equal<Match<'[callee]'>, T.CallExpression | T.NewExpression>>,
  Expect<Equal<Match<'[callee][type]'>, T.CallExpression | T.NewExpression>>,
  Expect<Equal<Match<'[attr][bbb=asdf]'>, never>>,
  Expect<Equal<Match<'Program[body][bbbody="aa"]'>, T.Program>>,
  Expect<Equal<Match<'Program[body]Program'>, T.Program>>,
  Expect<Equal<Match<'Program[body]CallExpression'>, never>>,
  Expect<Equal<Match<'Program[body], MemberExpression[name=1]'>, T.Program | T.MemberExpression>>,
  Expect<Equal<Match<'Program[body], MemberExpression[name=1].expression, CallExpression'>, T.Program | T.MemberExpression | T.CallExpression>>,
  Expect<Equal<Match<'Program:body.field[attr], MemberExpression[name=1].expression, CallExpression'>, T.MemberExpression | T.CallExpression>>,
  Expect<Equal<Match<'Identifier.id'>, T.Identifier>>,
  Expect<Equal<Match<'MemberExpression > Identifier'>, T.Identifier>>,
  Expect<Equal<Match<'Identifier > CallExpression'>, never /* Identifier can't contain CallExpression */>>,
  Expect<Equal<Match<'CallExpression[callee] > Identifier[type]'>, T.Identifier>>,
  Expect<Equal<Match<'MemberExpression > Identifier[type] > CallExpression[callee]'>, never>>,
  Expect<Equal<Match<'MemberExpression > Identifier[attr] > CallExpression[attr=value]'>, never>>,
  Expect<Equal<Match<'MemberExpression > .property'>, T.PrivateIdentifier | T.Expression>>,
  Expect<Equal<Match<'MemberExpression > .property > .elements'>, T.SpreadElement | T.Expression | T.DestructuringPattern>>,
  // Expect<Equal<Match<'MemberExpression > .property.elements'>, T.SpreadElement | T.Expression | T.DestructuringPattern>>,

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

  Expect<Equal<Match<'.body'>, T.TSModuleBlock | T.Statement | T.BlockStatement | T.Expression | T.ClassBody | T.ClassElement | T.ProgramStatement | T.TypeElement | T.TSInterfaceBody>>,
  Expect<Equal<Match<'*.body'>, T.TSModuleBlock | T.Statement | T.BlockStatement | T.Expression | T.ClassBody | T.ClassElement | T.ProgramStatement | T.TypeElement | T.TSInterfaceBody>>,

  Expect<Equal<Match<'VariableDeclarator > :matches(CallExpression, MemberExpression)'>, T.CallExpression | T.MemberExpression>>,
  Expect<Equal<Match<'CallExpression > .callee'>, T.LeftHandSideExpression>>,
  Expect<Equal<Match<'CallExpression > [object]'>, T.MemberExpression>>,
  Expect<Equal<Match<'CallExpression > :not(VariableDeclaration)'>, Exclude<T.LeftHandSideExpression | T.CallExpressionArgument | T.TSTypeParameterInstantiation | T.TSTypeParameterInstantiation, T.VariableDeclaration>>>,
  Expect<Equal<Match<'CallExpression > *:not(VariableDeclaration)'>, Exclude<T.LeftHandSideExpression | T.CallExpressionArgument | T.TSTypeParameterInstantiation | T.TSTypeParameterInstantiation, T.VariableDeclaration>>>,
  Expect<Equal<Match<'CallExpression > :not(VariableDeclaration, ArrayPattern)'>, Exclude<T.LeftHandSideExpression | T.CallExpressionArgument | T.TSTypeParameterInstantiation | T.TSTypeParameterInstantiation, T.VariableDeclaration | T.ArrayPattern>>>,
  Expect<Equal<Match<'CallExpression > *.callee'>, T.LeftHandSideExpression>>,
  Expect<Equal<Match<'CallExpression > *[type].callee'>, T.LeftHandSideExpression>>,
  Expect<Equal<Match<'CallExpression > *.callee[type].callee'>, T.LeftHandSideExpression>>,
  // Expect<Equal<Match<'MemberExpression > *.property[type].object'>, never>>,
  Expect<Equal<Match<'CallExpression > MemberExpression[type].callee'>, T.MemberExpression>>,
  Expect<Equal<Match<'CallExpression > :matches(MemberExpression, Literal)[type].callee'>, T.MemberExpression | T.Literal>>,

  Expect<Equal<Match<':matches(CallExpression)'>, T.CallExpression>>,
  Expect<Equal<Match<':matches(CallExpression, CallExpression)'>, T.CallExpression>>,
  Expect<Equal<Match<':matches(CallExpression):matches(Identifier)'>, never>>,
  Expect<Equal<Match<'CallExpression:matches(CallExpression, CallExpression):matches(CallExpression)'>, T.CallExpression>>,
  Expect<Equal<Match<'CallExpression:matches(CallExpression, Identifier):matches(CallExpression)'>, T.CallExpression>>,
  Expect<Equal<Match<':matches(:matches(:matches(CallExpression))):matches(CallExpression)'>, T.CallExpression>>,

  Expect<Equal<Match<'MemberExpression:not([computed=true])'>, T.MemberExpressionNonComputedName>>,
  Expect<Equal<Match<':matches(MemberExpression, Identifier):not([computed=true])'>, T.MemberExpressionNonComputedName | T.Identifier>>,
  Expect<Equal<Match<'MemberExpression:not(:not([computed=true]))'>, T.MemberExpressionComputedName>>,
  Expect<Equal<Match<'MemberExpression:not(:not(:not([computed=true])))'>, T.MemberExpressionNonComputedName>>,
  Expect<Equal<Match<':matches(CallExpression > MemberExpression)'>, T.MemberExpression>>,
  Expect<Equal<Match<':matches(CallExpression > MemberExpression, Identifier)'>, T.MemberExpression | T.Identifier>>,
  Expect<Equal<Match<':matches(CallExpression > Identifier, MemberExpression:not([computed=true]))'>, T.MemberExpressionNonComputedName | T.Identifier>>,
  Expect<Equal<Match<'MemberExpression:matches(Program [computed=true])'>, T.MemberExpressionComputedName>>,

  Expect<Equal<Match<'[declare=true]:matches(TSModuleDeclaration)'>, T.TSModuleDeclarationGlobal | T.TSModuleDeclarationNamespace | T.TSModuleDeclarationModuleWithIdentifierId | T.TSModuleDeclarationModuleWithStringIdDeclared>>,
  Expect<Equal<Match<'[declare=true]:matches(TSModuleDeclaration, TSDeclareFunction)'>, T.TSModuleDeclarationGlobal | T.TSModuleDeclarationNamespace | T.TSModuleDeclarationModuleWithIdentifierId | T.TSModuleDeclarationModuleWithStringIdDeclared | T.TSDeclareFunction>>,
  Expect<Equal<Match<'[declare=true]:matches(TSModuleDeclaration, TSDeclareFunction, Identifier)'>, T.TSModuleDeclarationGlobal | T.TSModuleDeclarationNamespace | T.TSModuleDeclarationModuleWithIdentifierId | T.TSModuleDeclarationModuleWithStringIdDeclared | T.TSDeclareFunction>>,
  Expect<Equal<Match<'Identifier[declare=true]'>, never>>,
  Expect<Equal<Match<':matches(Identifier)[declare=true]'>, never>>,
  Expect<Equal<Match<':matches(TSDeclareFunction, Identifier)[declare=true]'>, T.TSDeclareFunction>>,
  
  Expect<Equal<Match<'[declare=false]:matches(TSModuleDeclaration)'>, T.TSModuleDeclarationGlobal | T.TSModuleDeclarationNamespace | T.TSModuleDeclarationModuleWithIdentifierId | T.TSModuleDeclarationModuleWithStringIdNotDeclared>>,
  Expect<Equal<Match<'[declare=false]:matches(TSModuleDeclaration, TSDeclareFunction)'>, T.TSModuleDeclarationGlobal | T.TSModuleDeclarationNamespace | T.TSModuleDeclarationModuleWithIdentifierId | T.TSModuleDeclarationModuleWithStringIdNotDeclared | T.TSDeclareFunction>>,
  Expect<Equal<Match<'[declare=false]:matches(TSModuleDeclaration, TSDeclareFunction, Identifier)'>, T.TSModuleDeclarationGlobal | T.TSModuleDeclarationNamespace | T.TSModuleDeclarationModuleWithIdentifierId | T.TSModuleDeclarationModuleWithStringIdNotDeclared | T.TSDeclareFunction>>,
  Expect<Equal<Match<'Identifier[declare=false]'>, never>>,
  Expect<Equal<Match<':matches(Identifier)[declare=false]'>, never>>,
  Expect<Equal<Match<':matches(TSDeclareFunction, Identifier)[declare=false]'>, T.TSDeclareFunction>>,
  
  Expect<Equal<Match<':not([declare=true]):matches(TSModuleDeclaration)'>, T.TSModuleDeclarationGlobal | T.TSModuleDeclarationNamespace | T.TSModuleDeclarationModuleWithIdentifierId | T.TSModuleDeclarationModuleWithStringIdNotDeclared>>,
  Expect<Equal<Match<':not([declare=true]):matches(TSModuleDeclaration, TSDeclareFunction)'>, T.TSModuleDeclarationGlobal | T.TSModuleDeclarationNamespace | T.TSModuleDeclarationModuleWithIdentifierId | T.TSModuleDeclarationModuleWithStringIdNotDeclared | T.TSDeclareFunction>>,
  Expect<Equal<Match<':not([declare=true]):matches(TSModuleDeclaration, TSDeclareFunction, Identifier)'>, T.TSModuleDeclarationGlobal | T.TSModuleDeclarationNamespace | T.TSModuleDeclarationModuleWithIdentifierId | T.TSModuleDeclarationModuleWithStringIdNotDeclared | T.TSDeclareFunction | T.Identifier>>,
  Expect<Equal<Match<'Identifier:not([declare=true])'>, T.Identifier>>,
  Expect<Equal<Match<':matches(Identifier):not([declare=true])'>, T.Identifier>>,
  Expect<Equal<Match<':matches(TSDeclareFunction, Identifier):not([declare=true])'>, T.TSDeclareFunction | T.Identifier>>,
]
