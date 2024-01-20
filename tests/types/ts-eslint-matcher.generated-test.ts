import type { Mmatch } from '../../src/match/preprocess'
import type { ParseIt } from '../../src/parser'
import type { Equal, Expect } from '@type-challenges/utils'
import type { TSESTree as T } from '@typescript-eslint/typescript-estree'

type Match<_T extends string> = Mmatch<ParseIt<_T>>

export type TestCases = [
Expect<Equal<Match<"*">, T.Node>>,
Expect<Equal<Match<"ArrayExpression">, T.ArrayExpression>>,
Expect<Equal<Match<"ArrayExpression, ArrayPattern">, T.ArrayExpression | T.ArrayPattern>>,
Expect<Equal<Match<"ArrayExpression > SpreadElement">, T.SpreadElement>>,
Expect<Equal<Match<"ArrayPattern">, T.ArrayPattern>>,
Expect<Equal<Match<"ArrowFunctionExpression">, T.ArrowFunctionExpression>>,
Expect<Equal<Match<"ArrowFunctionExpression[async = false]">, T.ArrowFunctionExpression>>,
Expect<Equal<Match<"ArrowFunctionExpression[async = true]:exit">, T.ArrowFunctionExpression>>,
Expect<Equal<Match<"ArrowFunctionExpression[async = true] > :not(BlockStatement, AwaitExpression)">, Exclude<T.Parameter | T.BlockStatement | T.Expression | T.TSTypeAnnotation | T.TSTypeParameterDeclaration, T.BlockStatement | T.AwaitExpression>>>,
Expect<Equal<Match<"ArrowFunctionExpression:exit">, T.ArrowFunctionExpression>>,
Expect<Equal<Match<"ArrowFunctionExpression, FunctionDeclaration, FunctionExpression">, T.ArrowFunctionExpression | T.FunctionDeclaration | T.FunctionExpression>>,
Expect<Equal<Match<"ArrowFunctionExpression, FunctionDeclaration, FunctionExpression, MethodDefinition">, T.ArrowFunctionExpression | T.FunctionDeclaration | T.FunctionExpression | T.MethodDefinition>>,
Expect<Equal<Match<"ArrowFunctionExpression, FunctionDeclaration, FunctionExpression, MethodDefinition:exit">, T.ArrowFunctionExpression | T.FunctionDeclaration | T.FunctionExpression | T.MethodDefinition>>,
Expect<Equal<Match<"ArrowFunctionExpression, FunctionDeclaration, FunctionExpression, TSCallSignatureDeclaration, TSConstructSignatureDeclaration, TSDeclareFunction, TSEmptyBodyFunctionExpression, TSFunctionType, TSMethodSignature">, T.ArrowFunctionExpression | T.FunctionDeclaration | T.FunctionExpression | T.TSCallSignatureDeclaration | T.TSConstructSignatureDeclaration | T.TSDeclareFunction | T.TSEmptyBodyFunctionExpression | T.TSFunctionType | T.TSMethodSignature>>,
Expect<Equal<Match<"ArrowFunctionExpression, FunctionExpression">, T.ArrowFunctionExpression | T.FunctionExpression>>,
Expect<Equal<Match<"ArrowFunctionExpression > :not(BlockStatement).body">, Exclude<T.BlockStatement | T.Expression, T.BlockStatement>>>,
Expect<Equal<Match<"ArrowFunctionExpression > TSTypeParameterDeclaration > TSTypeParameter[constraint]">, T.TSTypeParameter>>,
Expect<Equal<Match<"AssignmentExpression">, T.AssignmentExpression>>,
Expect<Equal<Match<"AssignmentExpression[operator='+=']">, T.AssignmentExpression>>,
Expect<Equal<Match<"AssignmentExpression[operator = \"=\"], AssignmentPattern">, T.AssignmentExpression | T.AssignmentPattern>>,
Expect<Equal<Match<"AssignmentExpression[operator = \"+=\"], BinaryExpression[operator = \"+\"]">, T.AssignmentExpression | T.BinaryExpression>>,
Expect<Equal<Match<"AssignmentPattern">, T.AssignmentPattern>>,
Expect<Equal<Match<"AwaitExpression">, T.AwaitExpression>>,
Expect<Equal<Match<"AwaitExpression, CallExpression, TaggedTemplateExpression">, T.AwaitExpression | T.CallExpression | T.TaggedTemplateExpression>>,
Expect<Equal<Match<"BinaryExpression">, T.BinaryExpression>>,
Expect<Equal<Match<"BinaryExpression, AssignmentExpression">, T.BinaryExpression | T.AssignmentExpression>>,
Expect<Equal<Match<"BinaryExpression > CallExpression.left > MemberExpression.callee[property.name='indexOf'][computed=false]">, T.MemberExpressionNonComputedName>>,
Expect<Equal<Match<"BinaryExpression > CallExpression.left > MemberExpression.callee[property.name=\"indexOf\"][computed=false], BinaryExpression > ChainExpression.left > CallExpression > MemberExpression.callee[property.name=\"indexOf\"][computed=false]">, T.MemberExpressionNonComputedName>>,
Expect<Equal<Match<"BinaryExpression > CallExpression.left > MemberExpression.callee[property.name=\"lastIndexOf\"][computed=false], BinaryExpression > ChainExpression.left > CallExpression > MemberExpression.callee[property.name=\"lastIndexOf\"][computed=false]">, T.MemberExpressionNonComputedName>>,
Expect<Equal<Match<"BinaryExpression > CallExpression.left > MemberExpression.callee[property.name=\"match\"][computed=false], BinaryExpression > ChainExpression.left > CallExpression > MemberExpression.callee[property.name=\"match\"][computed=false]">, T.MemberExpressionNonComputedName>>,
Expect<Equal<Match<"BinaryExpression > CallExpression.left > MemberExpression.callee[property.name=\"slice\"][computed=false], BinaryExpression > CallExpression.left > MemberExpression.callee[property.name=\"substring\"][computed=false], BinaryExpression > ChainExpression.left > CallExpression > MemberExpression.callee[property.name=\"slice\"][computed=false], BinaryExpression > ChainExpression.left > CallExpression > MemberExpression.callee[property.name=\"substring\"][computed=false]">, T.MemberExpressionNonComputedName>>,
Expect<Equal<Match<"BinaryExpression > ChainExpression.left > CallExpression > MemberExpression.callee[property.name='indexOf'][computed=false]">, T.MemberExpressionNonComputedName>>,
Expect<Equal<Match<"BinaryExpression, LogicalExpression">, T.BinaryExpression | T.LogicalExpression>>,
Expect<Equal<Match<"BinaryExpression > MemberExpression.left[computed=true], BinaryExpression > CallExpression.left > MemberExpression.callee[property.name=\"charAt\"][computed=false], BinaryExpression > ChainExpression.left > MemberExpression[computed=true], BinaryExpression > ChainExpression.left > CallExpression > MemberExpression.callee[property.name=\"charAt\"][computed=false]">, T.MemberExpression>>,
Expect<Equal<Match<"BinaryExpression[operator='+']">, T.BinaryExpression>>,
Expect<Equal<Match<"BinaryExpression[operator='>']">, T.BinaryExpression>>,
Expect<Equal<Match<"BinaryExpression[operator=/^[<>!=]?={0,2}$/]">, T.BinaryExpression>>,
Expect<Equal<Match<"BlockStatement">, T.BlockStatement>>,
Expect<Equal<Match<"BlockStatement, ClassBody">, T.BlockStatement | T.ClassBody>>,
Expect<Equal<Match<"BlockStatement:exit">, T.BlockStatement>>,
Expect<Equal<Match<"BreakStatement">, T.BreakStatement>>,
Expect<Equal<Match<"CallExpression">, T.CallExpression>>,
Expect<Equal<Match<"CallExpression[arguments.length=0] > MemberExpression[property.name='sort'][computed=false]">, T.MemberExpressionNonComputedName>>,
Expect<Equal<Match<"CallExpression[arguments.length=0] > MemberExpression[property.name='toSorted'][computed=false]">, T.MemberExpressionNonComputedName>>,
Expect<Equal<Match<"CallExpression[arguments.length=1] > MemberExpression.callee[property.name='match'][computed=false]">, T.MemberExpressionNonComputedName>>,
Expect<Equal<Match<"CallExpression[arguments.length=1] > MemberExpression.callee[property.name=\"test\"][computed=false]">, T.MemberExpressionNonComputedName>>,
Expect<Equal<Match<"CallExpression > *.callee">, T.LeftHandSideExpression>>,
Expect<Equal<Match<"CallExpression[callee.name=\"require\"]">, T.CallExpression>>,
Expect<Equal<Match<"CallExpression > MemberExpression.callee">, T.MemberExpression>>,
Expect<Equal<Match<"CallExpression > MemberExpression.callee > Identifier[name = \"toString\"].property">, T.Identifier>>,
Expect<Equal<Match<"CallExpression > MemberExpression.callee[property.name=\"test\"][computed=false]">, T.MemberExpressionNonComputedName>>,
Expect<Equal<Match<"CallExpression, NewExpression">, T.CallExpression | T.NewExpression>>,
Expect<Equal<Match<"CallExpression[optional = true]">, T.CallExpression>>,
Expect<Equal<Match<"CallExpression[optional = true] > TSNonNullExpression.callee">, T.TSNonNullExpression>>,
Expect<Equal<Match<"ChainExpression > TSNonNullExpression">, T.TSNonNullExpression>>,
Expect<Equal<Match<"ClassBody">, T.ClassBody>>,
Expect<Equal<Match<"ClassBody:exit">, T.ClassBody>>,
Expect<Equal<Match<"ClassBody > MethodDefinition">, T.MethodDefinition>>,
Expect<Equal<Match<"ClassBody > MethodDefinition[key.name='new']">, T.MethodDefinition>>,
Expect<Equal<Match<"ClassBody > PropertyDefinition">, T.PropertyDefinition>>,
Expect<Equal<Match<"ClassDeclaration">, T.ClassDeclaration>>,
Expect<Equal<Match<"ClassDeclaration, ClassExpression">, T.ClassDeclaration | T.ClassExpression>>,
Expect<Equal<Match<"ClassDeclaration, ClassExpression:exit">, T.ClassDeclaration | T.ClassExpression>>,
Expect<Equal<Match<"ClassDeclaration:exit">, T.ClassDeclaration>>,
Expect<Equal<Match<"ClassDeclaration[superClass], ClassExpression[superClass]">, T.ClassDeclaration | T.ClassExpression>>,
Expect<Equal<Match<"ClassExpression">, T.ClassExpression>>,
Expect<Equal<Match<"ConditionalExpression">, T.ConditionalExpression>>,
Expect<Equal<Match<"ContinueStatement">, T.ContinueStatement>>,
Expect<Equal<Match<"DebuggerStatement">, T.DebuggerStatement>>,
Expect<Equal<Match<"DoWhileStatement">, T.DoWhileStatement>>,
Expect<Equal<Match<"DoWhileStatement, WhileStatement, ForInStatement, ForOfStatement, WithStatement">, T.DoWhileStatement | T.WhileStatement | T.ForInStatement | T.ForOfStatement | T.WithStatement>>,
Expect<Equal<Match<"EmptyStatement">, T.EmptyStatement>>,
Expect<Equal<Match<"*:exit">, T.Node>>,
Expect<Equal<Match<"ExperimentalSpreadProperty">, never /* deprecated */>>,
Expect<Equal<Match<"ExportAllDeclaration">, T.ExportAllDeclaration>>,
Expect<Equal<Match<"ExportDefaultDeclaration">, T.ExportDefaultDeclaration>>,
Expect<Equal<Match<"ExportNamedDeclaration">, T.ExportNamedDeclaration>>,
Expect<Equal<Match<"ExportNamedDeclaration[declaration.type=\"TSEnumDeclaration\"]">, T.ExportNamedDeclaration>>,
Expect<Equal<Match<"ExportNamedDeclaration[declaration.type=\"TSEnumDeclaration\"]:exit">, T.ExportNamedDeclaration>>,
Expect<Equal<Match<"ExportNamedDeclaration[declaration.type=\"TSModuleDeclaration\"]">, T.ExportNamedDeclaration>>,
Expect<Equal<Match<"ExportNamedDeclaration[declaration.type=\"TSModuleDeclaration\"]:exit">, T.ExportNamedDeclaration>>,
Expect<Equal<Match<"ExportNamedDeclaration:not([source])">, T.ExportNamedDeclarationWithoutSourceWithMultiple | T.ExportNamedDeclarationWithoutSourceWithSingle>>,
Expect<Equal<Match<"ExportNamedDeclaration[source]">, T.ExportNamedDeclarationWithSource>>,
Expect<Equal<Match<"ExportSpecifier">, T.ExportSpecifier>>,
Expect<Equal<Match<"ExpressionStatement">, T.ExpressionStatement>>,
Expect<Equal<Match<"ForInStatement">, T.ForInStatement>>,
Expect<Equal<Match<"ForOfStatement">, T.ForOfStatement>>,
Expect<Equal<Match<"ForOfStatement[await = true]">, T.ForOfStatement>>,
Expect<Equal<Match<"ForStatement">, T.ForStatement>>,
Expect<Equal<Match<"ForStatement:exit">, T.ForStatement>>,
Expect<Equal<Match<"ForStatement > *.init:exit">, T.Expression | T.ForInitialiser>>,
Expect<Equal<Match<"FunctionDeclaration">, T.FunctionDeclaration>>,
Expect<Equal<Match<"FunctionDeclaration[async = false]">, T.FunctionDeclaration>>,
Expect<Equal<Match<"FunctionDeclaration:exit">, T.FunctionDeclaration>>,
Expect<Equal<Match<"FunctionDeclaration, FunctionExpression">, T.FunctionDeclaration | T.FunctionExpression>>,
Expect<Equal<Match<"FunctionDeclaration, TSDeclareFunction, FunctionExpression">, T.FunctionDeclaration | T.TSDeclareFunction | T.FunctionExpression>>,
Expect<Equal<Match<"FunctionDeclaration, TSDeclareFunction, TSEmptyBodyFunctionExpression, FunctionExpression, ArrowFunctionExpression">, T.FunctionDeclaration | T.TSDeclareFunction | T.TSEmptyBodyFunctionExpression | T.FunctionExpression | T.ArrowFunctionExpression>>,
Expect<Equal<Match<"FunctionExpression">, T.FunctionExpression>>,
Expect<Equal<Match<"FunctionExpression[async = false]">, T.FunctionExpression>>,
Expect<Equal<Match<"FunctionExpression:exit">, T.FunctionExpression>>,
Expect<Equal<Match<"IfStatement">, T.IfStatement>>,
Expect<Equal<Match<"ImportDeclaration">, T.ImportDeclaration>>,
Expect<Equal<Match<"ImportDeclaration[importKind = \"type\"]">, T.ImportDeclaration>>,
Expect<Equal<Match<"ImportDeclaration[importKind!=\"type\"]">, T.ImportDeclaration>>,
Expect<Equal<Match<"ImportDeclaration[importKind=type]">, T.ImportDeclaration>>,
Expect<Equal<Match<"ImportDefaultSpecifier, ImportNamespaceSpecifier, ImportSpecifier">, T.ImportDefaultSpecifier | T.ImportNamespaceSpecifier | T.ImportSpecifier>>,
Expect<Equal<Match<"ImportExpression">, T.ImportExpression>>,
Expect<Equal<Match<"ImportNamespaceSpecifier">, T.ImportNamespaceSpecifier>>,
Expect<Equal<Match<"ImportSpecifier">, T.ImportSpecifier>>,
Expect<Equal<Match<"ImportSpecifier[importKind = \"type\"]">, T.ImportSpecifier>>,
Expect<Equal<Match<"JSXAttribute">, T.JSXAttribute>>,
Expect<Equal<Match<"JSXAttribute[value]">, T.JSXAttribute>>,
Expect<Equal<Match<"JSXAttribute[value != null]">, T.JSXAttribute>>,
Expect<Equal<Match<"JSXClosingElement">, T.JSXClosingElement>>,
Expect<Equal<Match<"JSXClosingFragment">, T.JSXClosingFragment>>,
Expect<Equal<Match<"JSXElement">, T.JSXElement>>,
Expect<Equal<Match<"JSXExpressionContainer">, T.JSXExpressionContainer>>,
Expect<Equal<Match<"JSXFragment">, T.JSXFragment>>,
Expect<Equal<Match<"JSXOpeningElement">, T.JSXOpeningElement>>,
Expect<Equal<Match<"JSXOpeningFragment">, T.JSXOpeningFragment>>,
Expect<Equal<Match<"JSXSpreadAttribute">, T.JSXSpreadAttribute>>,
Expect<Equal<Match<"Literal">, T.Literal>>,
Expect<Equal<Match<"LogicalExpression">, T.LogicalExpression>>,
Expect<Equal<Match<"LogicalExpression[operator = \"||\"]">, T.LogicalExpression>>,
Expect<Equal<Match<"LogicalExpression[operator!=\"??\"]">, T.LogicalExpression>>,
Expect<Equal<Match<"LogicalExpression[operator=\"||\"], LogicalExpression[operator=\"??\"]">, T.LogicalExpression>>,
Expect<Equal<Match<"LogicalExpression[operator = \"??\"] > TSNonNullExpression.left">, T.TSNonNullExpression>>,
Expect<Equal<Match<":matches(ClassDeclaration, ClassExpression):exit">, T.ClassDeclaration | T.ClassExpression>>,
Expect<Equal<Match<":matches(DoWhileStatement, ForStatement, ForInStatement, ForOfStatement, IfStatement, WhileStatement, WithStatement):exit">, T.DoWhileStatement | T.ForStatement | T.ForInStatement | T.ForOfStatement | T.IfStatement | T.WhileStatement | T.WithStatement>>,
Expect<Equal<Match<":matches(PropertyDefinition, TSAbstractPropertyDefinition)[computed = false][value.type = \"ArrowFunctionExpression\"], :matches(PropertyDefinition, TSAbstractPropertyDefinition)[computed = false][value.type = \"FunctionExpression\"], :matches(PropertyDefinition, TSAbstractPropertyDefinition)[computed = false][value.type = \"TSEmptyBodyFunctionExpression\"], :matches(MethodDefinition, TSAbstractMethodDefinition)[computed = false][kind = \"method\"]">, T.PropertyDefinitionNonComputedName | T.TSAbstractPropertyDefinitionNonComputedName | T.MethodDefinitionNonComputedName | T.TSAbstractMethodDefinitionNonComputedName>>,
Expect<Equal<Match<":matches(PropertyDefinition, TSAbstractPropertyDefinition)[computed = false][value.type != \"ArrowFunctionExpression\"][value.type != \"FunctionExpression\"][value.type != \"TSEmptyBodyFunctionExpression\"]">, T.PropertyDefinitionNonComputedName | T.TSAbstractPropertyDefinitionNonComputedName>>,
Expect<Equal<Match<"MemberExpression">, T.MemberExpression>>,
Expect<Equal<Match<"MemberExpression[computed=false]">, T.MemberExpressionNonComputedName>>,
Expect<Equal<Match<"MemberExpression[computed = true] > *.property">, T.Expression>>,
Expect<Equal<Match<"MemberExpression:exit">, T.MemberExpression>>,
Expect<Equal<Match<"MemberExpression, JSXMemberExpression, MetaProperty">, T.MemberExpression | T.JSXMemberExpression | T.MetaProperty>>,
Expect<Equal<Match<"MemberExpression[optional = true]">, T.MemberExpression>>,
Expect<Equal<Match<"MemberExpression[optional = true] > TSNonNullExpression.object">, T.TSNonNullExpression>>,
Expect<Equal<Match<"MethodDefinition">, T.MethodDefinition>>,
Expect<Equal<Match<"MethodDefinition[computed = false]:matches([kind = \"get\"], [kind = \"set\"])">, T.MethodDefinitionNonComputedName>>,
Expect<Equal<Match<"MethodDefinition[computed=true]">, T.MethodDefinitionComputedName>>,
Expect<Equal<Match<"MethodDefinition[kind=\"constructor\"]">, T.MethodDefinition>>,
Expect<Equal<Match<"MethodDefinition, PropertyDefinition">, T.MethodDefinition | T.PropertyDefinition>>,
Expect<Equal<Match<"MethodDefinition, PropertyDefinition, StaticBlock">, T.MethodDefinition | T.PropertyDefinition | T.StaticBlock>>,
Expect<Equal<Match<"MethodDefinition, TSAbstractMethodDefinition">, T.MethodDefinition | T.TSAbstractMethodDefinition>>,
Expect<Equal<Match<"NewExpression">, T.NewExpression>>,
Expect<Equal<Match<":not(ArrowFunctionExpression) > TSTypeParameterDeclaration > TSTypeParameter[constraint]">, T.TSTypeParameter>>,
Expect<Equal<Match<":not(ObjectPattern) > Property">, T.Property>>,
Expect<Equal<Match<":not(ObjectPattern) > Property[computed = false][kind = \"init\"][value.type != \"ArrowFunctionExpression\"][value.type != \"FunctionExpression\"][value.type != \"TSEmptyBodyFunctionExpression\"]">, T.PropertyNonComputedName>>,
Expect<Equal<Match<":not(TSClassImplements, TSInterfaceHeritage) > MemberExpression">, T.MemberExpression>>,
Expect<Equal<Match<"ObjectExpression">, T.ObjectExpression>>,
Expect<Equal<Match<"ObjectExpression, ObjectPattern">, T.ObjectExpression | T.ObjectPattern>>,
Expect<Equal<Match<"ObjectPattern">, T.ObjectPattern>>,
Expect<Equal<Match<"onCodePathEnd">, T.onCodePathEnd>>,
Expect<Equal<Match<"onCodePathStart">, T.onCodePathStart>>,
Expect<Equal<Match<"Program">, T.Program>>,
Expect<Equal<Match<"Program:exit">, T.Program>>,
Expect<Equal<Match<"Program > :matches(TSInterfaceDeclaration, TSTypeAliasDeclaration), Program > :matches(ClassDeclaration, TSDeclareFunction, TSEnumDeclaration, TSModuleDeclaration, VariableDeclaration)[declare = true]">, T.TSInterfaceDeclaration | T.TSTypeAliasDeclaration | T.ClassDeclaration | T.TSDeclareFunction | T.TSEnumDeclaration | T.TSModuleDeclaration | T.VariableDeclaration>>,
Expect<Equal<Match<"Property">, T.Property>>,
Expect<Equal<Match<"Property[computed = false][kind = \"init\"][value.type = \"ArrowFunctionExpression\"], Property[computed = false][kind = \"init\"][value.type = \"FunctionExpression\"], Property[computed = false][kind = \"init\"][value.type = \"TSEmptyBodyFunctionExpression\"]">, T.PropertyNonComputedName>>,
Expect<Equal<Match<"Property[computed = false]:matches([kind = \"get\"], [kind = \"set\"])">, T.PropertyNonComputedName>>,
Expect<Equal<Match<"PropertyDefinition">, T.PropertyDefinition>>,
Expect<Equal<Match<"PropertyDefinition > ArrowFunctionExpression.value">, T.ArrowFunctionExpression>>,
Expect<Equal<Match<"PropertyDefinition > ArrowFunctionExpression.value:exit">, T.ArrowFunctionExpression>>,
Expect<Equal<Match<"PropertyDefinition:exit">, T.PropertyDefinition>>,
Expect<Equal<Match<"PropertyDefinition > *.key:exit">, T.PropertyName>>,
Expect<Equal<Match<"PropertyDefinition, TSAbstractPropertyDefinition">, T.PropertyDefinition | T.TSAbstractPropertyDefinition>>,
Expect<Equal<Match<"PropertyDefinition[value != null]">, T.PropertyDefinition>>,
Expect<Equal<Match<"RestElement">, T.RestElement>>,
Expect<Equal<Match<"ReturnStatement">, T.ReturnStatement>>,
Expect<Equal<Match<"SequenceExpression">, T.SequenceExpression>>,
Expect<Equal<Match<"SpreadElement">, T.SpreadElement>>,
Expect<Equal<Match<"SpreadProperty">, T.SpreadProperty>>,
Expect<Equal<Match<":statement">, T.Node>>,
Expect<Equal<Match<"StaticBlock">, T.StaticBlock>>,
Expect<Equal<Match<"StaticBlock:exit">, T.StaticBlock>>,
Expect<Equal<Match<"Super">, T.Super>>,
Expect<Equal<Match<"SwitchCase">, T.SwitchCase>>,
Expect<Equal<Match<"SwitchCase:exit">, T.SwitchCase>>,
Expect<Equal<Match<"SwitchStatement">, T.SwitchStatement>>,
Expect<Equal<Match<"SwitchStatement:exit">, T.SwitchStatement>>,
Expect<Equal<Match<"TaggedTemplateExpression > *.tag">, T.LeftHandSideExpression>>,
Expect<Equal<Match<"TemplateLiteral">, T.TemplateLiteral>>,
Expect<Equal<Match<"ThisExpression">, T.ThisExpression>>,
Expect<Equal<Match<"ThisExpression, Super">, T.ThisExpression | T.Super>>,
Expect<Equal<Match<"ThrowStatement">, T.ThrowStatement>>,
Expect<Equal<Match<"TryStatement">, T.TryStatement>>,
Expect<Equal<Match<"TSAbstractMethodDefinition">, T.TSAbstractMethodDefinition>>,
Expect<Equal<Match<"TSAbstractMethodDefinition, TSAbstractPropertyDefinition">, T.TSAbstractMethodDefinition | T.TSAbstractPropertyDefinition>>,
Expect<Equal<Match<"TSAbstractPropertyDefinition">, T.TSAbstractPropertyDefinition>>,
Expect<Equal<Match<"TSAnyKeyword">, T.TSAnyKeyword>>,
Expect<Equal<Match<"TSArrayType">, T.TSArrayType>>,
Expect<Equal<Match<"TSAsExpression">, T.TSAsExpression>>,
Expect<Equal<Match<"TSAsExpression, TSTypeAssertion">, T.TSAsExpression | T.TSTypeAssertion>>,
Expect<Equal<Match<"TSBigIntKeyword">, T.TSBigIntKeyword>>,
Expect<Equal<Match<"TSBooleanKeyword">, T.TSBooleanKeyword>>,
Expect<Equal<Match<"TSCallSignatureDeclaration">, T.TSCallSignatureDeclaration>>,
Expect<Equal<Match<"TSClassImplements">, T.TSClassImplements>>,
Expect<Equal<Match<"TSConditionalType">, T.TSConditionalType>>,
Expect<Equal<Match<"TSConstructSignatureDeclaration">, T.TSConstructSignatureDeclaration>>,
Expect<Equal<Match<"TSDeclareFunction">, T.TSDeclareFunction>>,
Expect<Equal<Match<"TSDeclareFunction:exit">, T.TSDeclareFunction>>,
Expect<Equal<Match<"TSEmptyBodyFunctionExpression">, T.TSEmptyBodyFunctionExpression>>,
Expect<Equal<Match<"TSEnumDeclaration">, T.TSEnumDeclaration>>,
Expect<Equal<Match<"TSEnumDeclaration:exit">, T.TSEnumDeclaration>>,
Expect<Equal<Match<"TSEnumDeclaration, TSTypeLiteral">, T.TSEnumDeclaration | T.TSTypeLiteral>>,
Expect<Equal<Match<"TSEnumMember">, T.TSEnumMember>>,
Expect<Equal<Match<"TSEnumMember[computed != true]">, T.TSEnumMemberNonComputedName>>,
Expect<Equal<Match<"TSExportAssignment">, T.TSExportAssignment>>,
Expect<Equal<Match<"TSExternalModuleReference">, T.TSExternalModuleReference>>,
Expect<Equal<Match<"TSImportEqualsDeclaration">, T.TSImportEqualsDeclaration>>,
Expect<Equal<Match<"TSImportType">, T.TSImportType>>,
Expect<Equal<Match<"TSIndexedAccessType">, T.TSIndexedAccessType>>,
Expect<Equal<Match<"TSIndexSignature, TSPropertySignature">, T.TSIndexSignature | T.TSPropertySignature>>,
Expect<Equal<Match<"TSInterfaceBody">, T.TSInterfaceBody>>,
Expect<Equal<Match<"TSInterfaceBody > TSConstructSignatureDeclaration">, T.TSConstructSignatureDeclaration>>,
Expect<Equal<Match<"TSInterfaceBody, TSModuleBlock">, T.TSInterfaceBody | T.TSModuleBlock>>,
Expect<Equal<Match<"TSInterfaceDeclaration">, T.TSInterfaceDeclaration>>,
Expect<Equal<Match<"TSInterfaceDeclaration:exit">, T.TSInterfaceDeclaration>>,
Expect<Equal<Match<"TSInterfaceDeclaration[extends.length > 0]">, T.TSInterfaceDeclaration>>,
Expect<Equal<Match<"TSInterfaceDeclaration TSThisType">, T.TSThisType>>,
Expect<Equal<Match<"TSInterfaceDeclaration TSTypeLiteral">, T.TSTypeLiteral>>,
Expect<Equal<Match<"TSInterfaceDeclaration TSTypeLiteral:exit">, T.TSTypeLiteral>>,
Expect<Equal<Match<"TSInterfaceHeritage">, T.TSInterfaceHeritage>>,
Expect<Equal<Match<"TSIntersectionType">, T.TSIntersectionType>>,
Expect<Equal<Match<"TSIntersectionType:exit">, T.TSIntersectionType>>,
Expect<Equal<Match<"TSMappedType">, T.TSMappedType>>,
Expect<Equal<Match<"TSMethodSignature">, T.TSMethodSignature>>,
Expect<Equal<Match<"TSMethodSignature[computed = false], TSPropertySignature[computed = false][typeAnnotation.typeAnnotation.type = \"TSFunctionType\"]">, T.TSMethodSignatureNonComputedName | T.TSPropertySignatureNonComputedName>>,
Expect<Equal<Match<"TSMethodSignature[key.name='constructor']">, T.TSMethodSignature>>,
Expect<Equal<Match<"TSModuleBlock">, T.TSModuleBlock>>,
Expect<Equal<Match<"TSModuleBlock:exit">, T.TSModuleBlock>>,
Expect<Equal<Match<"TSModuleDeclaration">, T.TSModuleDeclaration>>,
Expect<Equal<Match<"TSModuleDeclaration[declare = true] > TSModuleBlock > :matches(TSInterfaceDeclaration, TSTypeAliasDeclaration), TSModuleDeclaration[declare = true] > TSModuleBlock > :matches(ClassDeclaration, TSDeclareFunction, TSEnumDeclaration, TSModuleDeclaration, VariableDeclaration)">, T.TSInterfaceDeclaration | T.TSTypeAliasDeclaration | T.ClassDeclarationWithName | T.TSDeclareFunction | T.TSEnumDeclaration | T.TSModuleDeclaration | T.VariableDeclaration>>,
Expect<Equal<Match<"TSModuleDeclaration[declare = true] > TSModuleBlock TSModuleDeclaration > TSModuleBlock > :matches(TSInterfaceDeclaration, TSTypeAliasDeclaration), TSModuleDeclaration[declare = true] > TSModuleBlock TSModuleDeclaration > TSModuleBlock > :matches(ClassDeclaration, TSDeclareFunction, TSEnumDeclaration, TSModuleDeclaration, VariableDeclaration)">, T.TSInterfaceDeclaration | T.TSTypeAliasDeclaration | T.ClassDeclarationWithName | T.TSDeclareFunction | T.TSEnumDeclaration | T.TSModuleDeclaration | T.VariableDeclaration>>,
Expect<Equal<Match<"TSModuleDeclaration:exit">, T.TSModuleDeclaration>>,
Expect<Equal<Match<"TSModuleDeclaration[global!=true][id.type!='Literal']">, T.TSModuleDeclaration>>,
Expect<Equal<Match<"TSModuleDeclaration > TSModuleBlock">, T.TSModuleBlock>>,
Expect<Equal<Match<"TSModuleDeclaration > TSModuleDeclaration">, never>>,
Expect<Equal<Match<"TSNeverKeyword">, T.TSNeverKeyword>>,
Expect<Equal<Match<"TSNonNullExpression">, T.TSNonNullExpression>>,
Expect<Equal<Match<"TSNonNullExpression > ChainExpression">, T.ChainExpression>>,
Expect<Equal<Match<"TSNonNullExpression > TSNonNullExpression">, T.TSNonNullExpression>>,
Expect<Equal<Match<"TSNullKeyword">, T.TSNullKeyword>>,
Expect<Equal<Match<"TSNumberKeyword">, T.TSNumberKeyword>>,
Expect<Equal<Match<"TSObjectKeyword">, T.TSObjectKeyword>>,
Expect<Equal<Match<"TSParameterProperty">, T.TSParameterProperty>>,
Expect<Equal<Match<"TSPropertySignature">, T.TSPropertySignature>>,
Expect<Equal<Match<"TSPropertySignature[computed = false][typeAnnotation.typeAnnotation.type != \"TSFunctionType\"]">, T.TSPropertySignatureNonComputedName>>,
Expect<Equal<Match<"TSQualifiedName">, T.TSQualifiedName>>,
Expect<Equal<Match<"TSQualifiedName:exit">, T.TSQualifiedName>>,
Expect<Equal<Match<"TSStringKeyword">, T.TSStringKeyword>>,
Expect<Equal<Match<"TSSymbolKeyword">, T.TSSymbolKeyword>>,
Expect<Equal<Match<"TSTupleType">, T.TSTupleType>>,
Expect<Equal<Match<"TSTypeAliasDeclaration">, T.TSTypeAliasDeclaration>>,
Expect<Equal<Match<"TSTypeAliasDeclaration[typeAnnotation.type='TSTypeLiteral']">, T.TSTypeAliasDeclaration>>,
Expect<Equal<Match<"TSTypeAnnotation">, T.TSTypeAnnotation>>,
Expect<Equal<Match<"TSTypeAssertion">, T.TSTypeAssertion>>,
Expect<Equal<Match<"TSTypeLiteral">, T.TSTypeLiteral>>,
Expect<Equal<Match<"TSTypeLiteral:exit">, T.TSTypeLiteral>>,
Expect<Equal<Match<"TSTypeLiteral[members.length = 1]">, T.TSTypeLiteral>>,
Expect<Equal<Match<"TSTypeParameterDeclaration">, T.TSTypeParameterDeclaration>>,
Expect<Equal<Match<"TSTypeParameterDeclaration > TSTypeParameter">, T.TSTypeParameter>>,
Expect<Equal<Match<"TSTypeParameterInstantiation">, T.TSTypeParameterInstantiation>>,
Expect<Equal<Match<"TSTypeReference">, T.TSTypeReference>>,
Expect<Equal<Match<"TSUndefinedKeyword">, T.TSUndefinedKeyword>>,
Expect<Equal<Match<"TSUnionType">, T.TSUnionType>>,
Expect<Equal<Match<"TSUnionType:exit">, T.TSUnionType>>,
Expect<Equal<Match<"TSUnknownKeyword">, T.TSUnknownKeyword>>,
Expect<Equal<Match<"TSVoidKeyword">, T.TSVoidKeyword>>,
Expect<Equal<Match<"UnaryExpression">, T.UnaryExpression>>,
Expect<Equal<Match<"UnaryExpression[operator=\"!\"]">, T.UnaryExpression>>,
Expect<Equal<Match<"UnaryExpression[operator=\"delete\"]">, T.UnaryExpression>>,
Expect<Equal<Match<"UnaryExpression[operator=delete]">, T.UnaryExpression>>,
Expect<Equal<Match<"UnaryExpression[operator=\"void\"]">, T.UnaryExpression>>,
Expect<Equal<Match<"UpdateExpression">, T.UpdateExpression>>,
Expect<Equal<Match<"VariableDeclaration">, T.VariableDeclaration>>,
Expect<Equal<Match<"VariableDeclaration:exit">, T.VariableDeclaration>>,
Expect<Equal<Match<"VariableDeclaration[kind = \"await using\"]">, T.VariableDeclaration>>,
Expect<Equal<Match<"VariableDeclarator">, T.VariableDeclarator>>,
Expect<Equal<Match<"VariableDeclarator, AssignmentExpression">, T.VariableDeclarator | T.AssignmentExpression>>,
Expect<Equal<Match<"VariableDeclarator[init != null]">, T.VariableDeclarator /* for some reason this doesn't work as intended Extract<TSESTree.LetOrConstOrVarDeclarator | TSESTree.UsingDeclarator, TSESTree.LetOrConstOrVarDeclarator | TSESTree.UsingInNomalConextDeclarator> */>>,
Expect<Equal<Match<"VariableDeclarator[init.type='ThisExpression'], AssignmentExpression[right.type='ThisExpression']">, T.VariableDeclarator | T.AssignmentExpression>>,
Expect<Equal<Match<"VariableDeclarator,PropertyDefinition,:matches(FunctionDeclaration,FunctionExpression) > AssignmentPattern">, T.VariableDeclarator | T.PropertyDefinition | T.AssignmentPattern>>,
Expect<Equal<Match<"WhileStatement">, T.WhileStatement>>,
Expect<Equal<Match<"WithStatement">, T.WithStatement>>,
Expect<Equal<Match<"YieldExpression">, T.YieldExpression>>,
]
