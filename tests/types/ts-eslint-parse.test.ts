import type { Expect, Equal } from '@type-challenges/utils'
import type { ParseIt } from '../../src/parser'

export type TestCases = [
Expect<Equal<ParseIt<"ImportDeclaration">, {"type":"identifier","value":"ImportDeclaration"}>>,
Expect<Equal<ParseIt<"TSImportEqualsDeclaration">, {"type":"identifier","value":"TSImportEqualsDeclaration"}>>,
Expect<Equal<ParseIt<"ProgramtchStatement">, {"type":"identifier","value":"ProgramtchStatement"}>>,
Expect<Equal<ParseIt<"TSInterfaceBody">, {"type":"identifier","value":"TSInterfaceBody"}>>,
Expect<Equal<ParseIt<"TSTypeLiteral">, {"type":"identifier","value":"TSTypeLiteral"}>>,
Expect<Equal<ParseIt<"TSEnumDeclaration">, {"type":"identifier","value":"TSEnumDeclaration"}>>,
Expect<Equal<ParseIt<"Program">, {"type":"identifier","value":"Program"}>>,
Expect<Equal<ParseIt<"Program:exit">, {"type":"compound","selectors":[{"type":"identifier","value":"Program"},{"type":"class","name":"exit"}]}>>,
Expect<Equal<ParseIt<"TSAsExpression, TSTypeAssertion">, {"type":"matches","selectors":[{"type":"identifier","value":"TSAsExpression"},{"type":"identifier","value":"TSTypeAssertion"}]}>>,
Expect<Equal<ParseIt<"ExportNamedDeclaration">, {"type":"identifier","value":"ExportNamedDeclaration"}>>,
Expect<Equal<ParseIt<"MemberExpression">, {"type":"identifier","value":"MemberExpression"}>>,
Expect<Equal<ParseIt<"BlockStatement">, {"type":"identifier","value":"BlockStatement"}>>,
Expect<Equal<ParseIt<"StaticBlock">, {"type":"identifier","value":"StaticBlock"}>>,
Expect<Equal<ParseIt<"SwitchStatement">, {"type":"identifier","value":"SwitchStatement"}>>,
Expect<Equal<ParseIt<"CallExpression[callee.name=\"require\"]">, {"type":"compound","selectors":[{"type":"identifier","value":"CallExpression"},{"type":"attribute","name":"callee.name","operator":"=","value":{"type":"literal","value":"require"}}]}>>,
Expect<Equal<ParseIt<"TSNonNullExpression > TSNonNullExpression">, {"type":"child","left":{"type":"identifier","value":"TSNonNullExpression"},"right":{"type":"identifier","value":"TSNonNullExpression"}}>>,
Expect<Equal<ParseIt<"MemberExpression[optional = true] > TSNonNullExpression.object">, {"type":"child","left":{"type":"compound","selectors":[{"type":"identifier","value":"MemberExpression"},{"type":"attribute","name":"optional","operator":"=","value":{"type":"literal","value":"true"}}]},"right":{"type":"compound","selectors":[{"type":"identifier","value":"TSNonNullExpression"},{"type":"field","name":"object"}]}}>>,
Expect<Equal<ParseIt<"CallExpression[optional = true] > TSNonNullExpression.callee">, {"type":"child","left":{"type":"compound","selectors":[{"type":"identifier","value":"CallExpression"},{"type":"attribute","name":"optional","operator":"=","value":{"type":"literal","value":"true"}}]},"right":{"type":"compound","selectors":[{"type":"identifier","value":"TSNonNullExpression"},{"type":"field","name":"callee"}]}}>>,
Expect<Equal<ParseIt<"TSExternalModuleReference">, {"type":"identifier","value":"TSExternalModuleReference"}>>,
Expect<Equal<ParseIt<"ReturnStatement">, {"type":"identifier","value":"ReturnStatement"}>>,
Expect<Equal<ParseIt<"ArrowFunctionExpression > :not(BlockStatement).body">, {"type":"child","left":{"type":"identifier","value":"ArrowFunctionExpression"},"right":{"type":"compound","selectors":[{"type":"not","selectors":[{"type":"identifier","value":"BlockStatement"}]},{"type":"field","name":"body"}]}}>>,
Expect<Equal<ParseIt<"CallExpression[arguments.length=0] > MemberExpression[property.name='sort'][computed=false]">, {"type":"child","left":{"type":"compound","selectors":[{"type":"identifier","value":"CallExpression"},{"type":"attribute","name":"arguments.length","operator":"=","value":{"type":"literal","value":0}}]},"right":{"type":"compound","selectors":[{"type":"identifier","value":"MemberExpression"},{"type":"attribute","name":"property.name","operator":"=","value":{"type":"literal","value":"sort"}},{"type":"attribute","name":"computed","operator":"=","value":{"type":"literal","value":"false"}}]}}>>,
Expect<Equal<ParseIt<"CallExpression[arguments.length=0] > MemberExpression[property.name='toSorted'][computed=false]">, {"type":"child","left":{"type":"compound","selectors":[{"type":"identifier","value":"CallExpression"},{"type":"attribute","name":"arguments.length","operator":"=","value":{"type":"literal","value":0}}]},"right":{"type":"compound","selectors":[{"type":"identifier","value":"MemberExpression"},{"type":"attribute","name":"property.name","operator":"=","value":{"type":"literal","value":"toSorted"}},{"type":"attribute","name":"computed","operator":"=","value":{"type":"literal","value":"false"}}]}}>>,
Expect<Equal<ParseIt<":not(TSClassImplements, TSInterfaceHeritage) > MemberExpression">, {"type":"child","left":{"type":"not","selectors":[{"type":"identifier","value":"TSClassImplements"},{"type":"identifier","value":"TSInterfaceHeritage"}]},"right":{"type":"identifier","value":"MemberExpression"}}>>,
Expect<Equal<ParseIt<"MemberExpression[computed = true] > *.property">, {"type":"child","left":{"type":"compound","selectors":[{"type":"identifier","value":"MemberExpression"},{"type":"attribute","name":"computed","operator":"=","value":{"type":"literal","value":"true"}}]},"right":{"type":"compound","selectors":[{"type":"wildcard","value":"*"},{"type":"field","name":"property"}]}}>>,
Expect<Equal<ParseIt<"BinaryExpression, AssignmentExpression">, {"type":"matches","selectors":[{"type":"identifier","value":"BinaryExpression"},{"type":"identifier","value":"AssignmentExpression"}]}>>,
Expect<Equal<ParseIt<"ClassBody">, {"type":"identifier","value":"ClassBody"}>>,
Expect<Equal<ParseIt<"AssignmentExpression[operator = \"+=\"], BinaryExpression[operator = \"+\"]">, {"type":"matches","selectors":[{"type":"compound","selectors":[{"type":"identifier","value":"AssignmentExpression"},{"type":"attribute","name":"operator","operator":"=","value":{"type":"literal","value":"+="}}]},{"type":"compound","selectors":[{"type":"identifier","value":"BinaryExpression"},{"type":"attribute","name":"operator","operator":"=","value":{"type":"literal","value":"+"}}]}]}>>,
Expect<Equal<ParseIt<"CallExpression > MemberExpression.callee > Identifier[name = \"toString\"].property">, {"type":"child","left":{"type":"child","left":{"type":"identifier","value":"CallExpression"},"right":{"type":"compound","selectors":[{"type":"identifier","value":"MemberExpression"},{"type":"field","name":"callee"}]}},"right":{"type":"compound","selectors":[{"type":"identifier","value":"Identifier"},{"type":"attribute","name":"name","operator":"=","value":{"type":"literal","value":"toString"}},{"type":"field","name":"property"}]}}>>,
Expect<Equal<ParseIt<"TemplateLiteral">, {"type":"identifier","value":"TemplateLiteral"}>>,
Expect<Equal<ParseIt<"MethodDefinition">, {"type":"identifier","value":"MethodDefinition"}>>,
Expect<Equal<ParseIt<"ClassBody:exit">, {"type":"compound","selectors":[{"type":"identifier","value":"ClassBody"},{"type":"class","name":"exit"}]}>>,
Expect<Equal<ParseIt<"MethodDefinition, PropertyDefinition">, {"type":"matches","selectors":[{"type":"identifier","value":"MethodDefinition"},{"type":"identifier","value":"PropertyDefinition"}]}>>,
Expect<Equal<ParseIt<"CallExpression[arguments.length=1] > MemberExpression.callee[property.name='match'][computed=false]">, {"type":"child","left":{"type":"compound","selectors":[{"type":"identifier","value":"CallExpression"},{"type":"attribute","name":"arguments.length","operator":"=","value":{"type":"literal","value":1}}]},"right":{"type":"compound","selectors":[{"type":"identifier","value":"MemberExpression"},{"type":"field","name":"callee"},{"type":"attribute","name":"property.name","operator":"=","value":{"type":"literal","value":"match"}},{"type":"attribute","name":"computed","operator":"=","value":{"type":"literal","value":"false"}}]}}>>,
Expect<Equal<ParseIt<"TSNonNullExpression > ChainExpression">, {"type":"child","left":{"type":"identifier","value":"TSNonNullExpression"},"right":{"type":"identifier","value":"ChainExpression"}}>>,
Expect<Equal<ParseIt<"ChainExpression > TSNonNullExpression">, {"type":"child","left":{"type":"identifier","value":"ChainExpression"},"right":{"type":"identifier","value":"TSNonNullExpression"}}>>,
Expect<Equal<ParseIt<"TSModuleDeclaration">, {"type":"identifier","value":"TSModuleDeclaration"}>>,
Expect<Equal<ParseIt<"TSModuleDeclaration > TSModuleBlock">, {"type":"child","left":{"type":"identifier","value":"TSModuleDeclaration"},"right":{"type":"identifier","value":"TSModuleBlock"}}>>,
Expect<Equal<ParseIt<"ExportNamedDeclaration[declaration.type=\"TSModuleDeclaration\"]">, {"type":"compound","selectors":[{"type":"identifier","value":"ExportNamedDeclaration"},{"type":"attribute","name":"declaration.type","operator":"=","value":{"type":"literal","value":"TSModuleDeclaration"}}]}>>,
Expect<Equal<ParseIt<"ExportNamedDeclaration[declaration.type=\"TSEnumDeclaration\"]">, {"type":"compound","selectors":[{"type":"identifier","value":"ExportNamedDeclaration"},{"type":"attribute","name":"declaration.type","operator":"=","value":{"type":"literal","value":"TSEnumDeclaration"}}]}>>,
Expect<Equal<ParseIt<"TSModuleDeclaration:exit">, {"type":"compound","selectors":[{"type":"identifier","value":"TSModuleDeclaration"},{"type":"class","name":"exit"}]}>>,
Expect<Equal<ParseIt<"TSEnumDeclaration:exit">, {"type":"compound","selectors":[{"type":"identifier","value":"TSEnumDeclaration"},{"type":"class","name":"exit"}]}>>,
Expect<Equal<ParseIt<"ExportNamedDeclaration[declaration.type=\"TSModuleDeclaration\"]:exit">, {"type":"compound","selectors":[{"type":"identifier","value":"ExportNamedDeclaration"},{"type":"attribute","name":"declaration.type","operator":"=","value":{"type":"literal","value":"TSModuleDeclaration"}},{"type":"class","name":"exit"}]}>>,
Expect<Equal<ParseIt<"ExportNamedDeclaration[declaration.type=\"TSEnumDeclaration\"]:exit">, {"type":"compound","selectors":[{"type":"identifier","value":"ExportNamedDeclaration"},{"type":"attribute","name":"declaration.type","operator":"=","value":{"type":"literal","value":"TSEnumDeclaration"}},{"type":"class","name":"exit"}]}>>,
Expect<Equal<ParseIt<"TSQualifiedName">, {"type":"identifier","value":"TSQualifiedName"}>>,
Expect<Equal<ParseIt<"MemberExpression[computed=false]">, {"type":"compound","selectors":[{"type":"identifier","value":"MemberExpression"},{"type":"attribute","name":"computed","operator":"=","value":{"type":"literal","value":"false"}}]}>>,
Expect<Equal<ParseIt<"TSQualifiedName:exit">, {"type":"compound","selectors":[{"type":"identifier","value":"TSQualifiedName"},{"type":"class","name":"exit"}]}>>,
Expect<Equal<ParseIt<"MemberExpression:exit">, {"type":"compound","selectors":[{"type":"identifier","value":"MemberExpression"},{"type":"class","name":"exit"}]}>>,
Expect<Equal<ParseIt<"ArrowFunctionExpression">, {"type":"identifier","value":"ArrowFunctionExpression"}>>,
Expect<Equal<ParseIt<"FunctionDeclaration">, {"type":"identifier","value":"FunctionDeclaration"}>>,
Expect<Equal<ParseIt<"FunctionExpression">, {"type":"identifier","value":"FunctionExpression"}>>,
Expect<Equal<ParseIt<"ClassDeclaration">, {"type":"identifier","value":"ClassDeclaration"}>>,
Expect<Equal<ParseIt<"ClassExpression">, {"type":"identifier","value":"ClassExpression"}>>,
Expect<Equal<ParseIt<"TSInterfaceDeclaration">, {"type":"identifier","value":"TSInterfaceDeclaration"}>>,
Expect<Equal<ParseIt<"TSInterfaceBody > TSConstructSignatureDeclaration">, {"type":"child","left":{"type":"identifier","value":"TSInterfaceBody"},"right":{"type":"identifier","value":"TSConstructSignatureDeclaration"}}>>,
Expect<Equal<ParseIt<"TSMethodSignature[key.name='constructor']">, {"type":"compound","selectors":[{"type":"identifier","value":"TSMethodSignature"},{"type":"attribute","name":"key.name","operator":"=","value":{"type":"literal","value":"constructor"}}]}>>,
Expect<Equal<ParseIt<"ClassBody > MethodDefinition[key.name='new']">, {"type":"child","left":{"type":"identifier","value":"ClassBody"},"right":{"type":"compound","selectors":[{"type":"identifier","value":"MethodDefinition"},{"type":"attribute","name":"key.name","operator":"=","value":{"type":"literal","value":"new"}}]}}>>,
Expect<Equal<ParseIt<"CallExpression">, {"type":"identifier","value":"CallExpression"}>>,
Expect<Equal<ParseIt<"NewExpression">, {"type":"identifier","value":"NewExpression"}>>,
Expect<Equal<ParseIt<"ClassBody > MethodDefinition">, {"type":"child","left":{"type":"identifier","value":"ClassBody"},"right":{"type":"identifier","value":"MethodDefinition"}}>>,
Expect<Equal<ParseIt<"ClassBody > PropertyDefinition">, {"type":"child","left":{"type":"identifier","value":"ClassBody"},"right":{"type":"identifier","value":"PropertyDefinition"}}>>,
Expect<Equal<ParseIt<"CallExpression > MemberExpression.callee">, {"type":"child","left":{"type":"identifier","value":"CallExpression"},"right":{"type":"compound","selectors":[{"type":"identifier","value":"MemberExpression"},{"type":"field","name":"callee"}]}}>>,
Expect<Equal<ParseIt<"VariableDeclarator[init.type='ThisExpression'], AssignmentExpression[right.type='ThisExpression']">, {"type":"matches","selectors":[{"type":"compound","selectors":[{"type":"identifier","value":"VariableDeclarator"},{"type":"attribute","name":"init.type","operator":"=","value":{"type":"literal","value":"ThisExpression"}}]},{"type":"compound","selectors":[{"type":"identifier","value":"AssignmentExpression"},{"type":"attribute","name":"right.type","operator":"=","value":{"type":"literal","value":"ThisExpression"}}]}]}>>,
Expect<Equal<ParseIt<"ImportDeclaration[importKind!=\"type\"]">, {"type":"compound","selectors":[{"type":"identifier","value":"ImportDeclaration"},{"type":"attribute","name":"importKind","operator":"!=","value":{"type":"literal","value":"type"}}]}>>,
Expect<Equal<ParseIt<"ImportDefaultSpecifier, ImportNamespaceSpecifier, ImportSpecifier">, {"type":"matches","selectors":[{"type":"identifier","value":"ImportDefaultSpecifier"},{"type":"identifier","value":"ImportNamespaceSpecifier"},{"type":"identifier","value":"ImportSpecifier"}]}>>,
Expect<Equal<ParseIt<"VariableDeclarator">, {"type":"identifier","value":"VariableDeclarator"}>>,
Expect<Equal<ParseIt<"FunctionDeclaration, TSDeclareFunction, FunctionExpression">, {"type":"matches","selectors":[{"type":"identifier","value":"FunctionDeclaration"},{"type":"identifier","value":"TSDeclareFunction"},{"type":"identifier","value":"FunctionExpression"}]}>>,
Expect<Equal<ParseIt<"FunctionDeclaration, TSDeclareFunction, TSEmptyBodyFunctionExpression, FunctionExpression, ArrowFunctionExpression">, {"type":"matches","selectors":[{"type":"identifier","value":"FunctionDeclaration"},{"type":"identifier","value":"TSDeclareFunction"},{"type":"identifier","value":"TSEmptyBodyFunctionExpression"},{"type":"identifier","value":"FunctionExpression"},{"type":"identifier","value":"ArrowFunctionExpression"}]}>>,
Expect<Equal<ParseIt<"TSParameterProperty">, {"type":"identifier","value":"TSParameterProperty"}>>,
Expect<Equal<ParseIt<":not(ObjectPattern) > Property[computed = false][kind = \"init\"][value.type != \"ArrowFunctionExpression\"][value.type != \"FunctionExpression\"][value.type != \"TSEmptyBodyFunctionExpression\"]">, {"type":"child","left":{"type":"not","selectors":[{"type":"identifier","value":"ObjectPattern"}]},"right":{"type":"compound","selectors":[{"type":"identifier","value":"Property"},{"type":"attribute","name":"computed","operator":"=","value":{"type":"literal","value":"false"}},{"type":"attribute","name":"kind","operator":"=","value":{"type":"literal","value":"init"}},{"type":"attribute","name":"value.type","operator":"!=","value":{"type":"literal","value":"ArrowFunctionExpression"}},{"type":"attribute","name":"value.type","operator":"!=","value":{"type":"literal","value":"FunctionExpression"}},{"type":"attribute","name":"value.type","operator":"!=","value":{"type":"literal","value":"TSEmptyBodyFunctionExpression"}}]}}>>,
Expect<Equal<ParseIt<":matches(PropertyDefinition, TSAbstractPropertyDefinition)[computed = false][value.type != \"ArrowFunctionExpression\"][value.type != \"FunctionExpression\"][value.type != \"TSEmptyBodyFunctionExpression\"]">, {"type":"compound","selectors":[{"type":"matches","selectors":[{"type":"identifier","value":"PropertyDefinition"},{"type":"identifier","value":"TSAbstractPropertyDefinition"}]},{"type":"attribute","name":"computed","operator":"=","value":{"type":"literal","value":"false"}},{"type":"attribute","name":"value.type","operator":"!=","value":{"type":"literal","value":"ArrowFunctionExpression"}},{"type":"attribute","name":"value.type","operator":"!=","value":{"type":"literal","value":"FunctionExpression"}},{"type":"attribute","name":"value.type","operator":"!=","value":{"type":"literal","value":"TSEmptyBodyFunctionExpression"}}]}>>,
Expect<Equal<ParseIt<"TSPropertySignature[computed = false][typeAnnotation.typeAnnotation.type != \"TSFunctionType\"]">, {"type":"compound","selectors":[{"type":"identifier","value":"TSPropertySignature"},{"type":"attribute","name":"computed","operator":"=","value":{"type":"literal","value":"false"}},{"type":"attribute","name":"typeAnnotation.typeAnnotation.type","operator":"!=","value":{"type":"literal","value":"TSFunctionType"}}]}>>,
Expect<Equal<ParseIt<"Property[computed = false][kind = \"init\"][value.type = \"ArrowFunctionExpression\"], Property[computed = false][kind = \"init\"][value.type = \"FunctionExpression\"], Property[computed = false][kind = \"init\"][value.type = \"TSEmptyBodyFunctionExpression\"]">, {"type":"matches","selectors":[{"type":"compound","selectors":[{"type":"identifier","value":"Property"},{"type":"attribute","name":"computed","operator":"=","value":{"type":"literal","value":"false"}},{"type":"attribute","name":"kind","operator":"=","value":{"type":"literal","value":"init"}},{"type":"attribute","name":"value.type","operator":"=","value":{"type":"literal","value":"ArrowFunctionExpression"}}]},{"type":"compound","selectors":[{"type":"identifier","value":"Property"},{"type":"attribute","name":"computed","operator":"=","value":{"type":"literal","value":"false"}},{"type":"attribute","name":"kind","operator":"=","value":{"type":"literal","value":"init"}},{"type":"attribute","name":"value.type","operator":"=","value":{"type":"literal","value":"FunctionExpression"}}]},{"type":"compound","selectors":[{"type":"identifier","value":"Property"},{"type":"attribute","name":"computed","operator":"=","value":{"type":"literal","value":"false"}},{"type":"attribute","name":"kind","operator":"=","value":{"type":"literal","value":"init"}},{"type":"attribute","name":"value.type","operator":"=","value":{"type":"literal","value":"TSEmptyBodyFunctionExpression"}}]}]}>>,
Expect<Equal<ParseIt<":matches(PropertyDefinition, TSAbstractPropertyDefinition)[computed = false][value.type = \"ArrowFunctionExpression\"], :matches(PropertyDefinition, TSAbstractPropertyDefinition)[computed = false][value.type = \"FunctionExpression\"], :matches(PropertyDefinition, TSAbstractPropertyDefinition)[computed = false][value.type = \"TSEmptyBodyFunctionExpression\"], :matches(MethodDefinition, TSAbstractMethodDefinition)[computed = false][kind = \"method\"]">, {"type":"matches","selectors":[{"type":"compound","selectors":[{"type":"matches","selectors":[{"type":"identifier","value":"PropertyDefinition"},{"type":"identifier","value":"TSAbstractPropertyDefinition"}]},{"type":"attribute","name":"computed","operator":"=","value":{"type":"literal","value":"false"}},{"type":"attribute","name":"value.type","operator":"=","value":{"type":"literal","value":"ArrowFunctionExpression"}}]},{"type":"compound","selectors":[{"type":"matches","selectors":[{"type":"identifier","value":"PropertyDefinition"},{"type":"identifier","value":"TSAbstractPropertyDefinition"}]},{"type":"attribute","name":"computed","operator":"=","value":{"type":"literal","value":"false"}},{"type":"attribute","name":"value.type","operator":"=","value":{"type":"literal","value":"FunctionExpression"}}]},{"type":"compound","selectors":[{"type":"matches","selectors":[{"type":"identifier","value":"PropertyDefinition"},{"type":"identifier","value":"TSAbstractPropertyDefinition"}]},{"type":"attribute","name":"computed","operator":"=","value":{"type":"literal","value":"false"}},{"type":"attribute","name":"value.type","operator":"=","value":{"type":"literal","value":"TSEmptyBodyFunctionExpression"}}]},{"type":"compound","selectors":[{"type":"matches","selectors":[{"type":"identifier","value":"MethodDefinition"},{"type":"identifier","value":"TSAbstractMethodDefinition"}]},{"type":"attribute","name":"computed","operator":"=","value":{"type":"literal","value":"false"}},{"type":"attribute","name":"kind","operator":"=","value":{"type":"literal","value":"method"}}]}]}>>,
Expect<Equal<ParseIt<"TSMethodSignature[computed = false], TSPropertySignature[computed = false][typeAnnotation.typeAnnotation.type = \"TSFunctionType\"]">, {"type":"matches","selectors":[{"type":"compound","selectors":[{"type":"identifier","value":"TSMethodSignature"},{"type":"attribute","name":"computed","operator":"=","value":{"type":"literal","value":"false"}}]},{"type":"compound","selectors":[{"type":"identifier","value":"TSPropertySignature"},{"type":"attribute","name":"computed","operator":"=","value":{"type":"literal","value":"false"}},{"type":"attribute","name":"typeAnnotation.typeAnnotation.type","operator":"=","value":{"type":"literal","value":"TSFunctionType"}}]}]}>>,
Expect<Equal<ParseIt<"Property[computed = false]:matches([kind = \"get\"], [kind = \"set\"])">, {"type":"compound","selectors":[{"type":"identifier","value":"Property"},{"type":"attribute","name":"computed","operator":"=","value":{"type":"literal","value":"false"}},{"type":"matches","selectors":[{"type":"attribute","name":"kind","operator":"=","value":{"type":"literal","value":"get"}},{"type":"attribute","name":"kind","operator":"=","value":{"type":"literal","value":"set"}}]}]}>>,
Expect<Equal<ParseIt<"MethodDefinition[computed = false]:matches([kind = \"get\"], [kind = \"set\"])">, {"type":"compound","selectors":[{"type":"identifier","value":"MethodDefinition"},{"type":"attribute","name":"computed","operator":"=","value":{"type":"literal","value":"false"}},{"type":"matches","selectors":[{"type":"attribute","name":"kind","operator":"=","value":{"type":"literal","value":"get"}},{"type":"attribute","name":"kind","operator":"=","value":{"type":"literal","value":"set"}}]}]}>>,
Expect<Equal<ParseIt<"TSEnumMember[computed != true]">, {"type":"compound","selectors":[{"type":"identifier","value":"TSEnumMember"},{"type":"attribute","name":"computed","operator":"!=","value":{"type":"literal","value":"true"}}]}>>,
Expect<Equal<ParseIt<"ClassDeclaration, ClassExpression">, {"type":"matches","selectors":[{"type":"identifier","value":"ClassDeclaration"},{"type":"identifier","value":"ClassExpression"}]}>>,
Expect<Equal<ParseIt<"TSTypeAliasDeclaration">, {"type":"identifier","value":"TSTypeAliasDeclaration"}>>,
Expect<Equal<ParseIt<"TSTypeParameterDeclaration > TSTypeParameter">, {"type":"child","left":{"type":"identifier","value":"TSTypeParameterDeclaration"},"right":{"type":"identifier","value":"TSTypeParameter"}}>>,
Expect<Equal<ParseIt<"CallExpression > *.callee">, {"type":"child","left":{"type":"identifier","value":"CallExpression"},"right":{"type":"compound","selectors":[{"type":"wildcard","value":"*"},{"type":"field","name":"callee"}]}}>>,
Expect<Equal<ParseIt<"TaggedTemplateExpression > *.tag">, {"type":"child","left":{"type":"identifier","value":"TaggedTemplateExpression"},"right":{"type":"compound","selectors":[{"type":"wildcard","value":"*"},{"type":"field","name":"tag"}]}}>>,
Expect<Equal<ParseIt<"ForInStatement">, {"type":"identifier","value":"ForInStatement"}>>,
Expect<Equal<ParseIt<"UnaryExpression[operator=delete]">, {"type":"compound","selectors":[{"type":"identifier","value":"UnaryExpression"},{"type":"attribute","name":"operator","operator":"=","value":{"type":"literal","value":"delete"}}]}>>,
Expect<Equal<ParseIt<"Literal">, {"type":"identifier","value":"Literal"}>>,
Expect<Equal<ParseIt<"UnaryExpression">, {"type":"identifier","value":"UnaryExpression"}>>,
Expect<Equal<ParseIt<"UnaryExpression[operator=\"void\"]">, {"type":"compound","selectors":[{"type":"identifier","value":"UnaryExpression"},{"type":"attribute","name":"operator","operator":"=","value":{"type":"literal","value":"void"}}]}>>,
]