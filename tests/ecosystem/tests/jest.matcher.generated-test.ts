import type { MatchIt } from "../../../src/matcher"
import type { ParseIt } from "../../../src/parser"
import type { Equal, Expect } from "../../../src/utils"
import type { TSESTree as T } from '@typescript-eslint/typescript-estree'

type Match<_T extends string> = MatchIt<ParseIt<_T>, T.Node>

export type TestCases = [
Expect<Equal<Match<"ArrowFunctionExpression">, T.ArrowFunctionExpression>>,
Expect<Equal<Match<"ArrowFunctionExpression:exit">, T.ArrowFunctionExpression>>,
Expect<Equal<Match<"AssignmentExpression">, T.AssignmentExpression>>,
Expect<Equal<Match<"AssignmentExpression > MemberExpression">, T.MemberExpression>>,
Expect<Equal<Match<"BlockStatement">, T.BlockStatement>>,
Expect<Equal<Match<"BlockStatement:exit">, T.BlockStatement>>,
Expect<Equal<Match<"CallExpression">, T.CallExpression>>,
Expect<Equal<Match<"CallExpression[callee.name=\"pending\"]">, T.CallExpression>>,
Expect<Equal<Match<"CallExpression[callee.name=\"require\"]">, T.CallExpression>>,
Expect<Equal<Match<"CallExpression:exit">, T.CallExpression>>,
Expect<Equal<Match<"CatchClause">, T.CatchClause>>,
Expect<Equal<Match<"CatchClause:exit">, T.CatchClause>>,
Expect<Equal<Match<"ConditionalExpression">, T.ConditionalExpression>>,
Expect<Equal<Match<"ConditionalExpression:exit">, T.ConditionalExpression>>,
Expect<Equal<Match<"ExportNamedDeclaration, ExportDefaultDeclaration">, T.ExportNamedDeclaration | T.ExportDefaultDeclaration>>,
Expect<Equal<Match<"ExpressionStatement">, T.ExpressionStatement>>,
Expect<Equal<Match<"ForInStatement">, T.ForInStatement>>,
Expect<Equal<Match<"ForInStatement:exit">, T.ForInStatement>>,
Expect<Equal<Match<"ForOfStatement">, T.ForOfStatement>>,
Expect<Equal<Match<"ForOfStatement:exit">, T.ForOfStatement>>,
Expect<Equal<Match<"ForStatement">, T.ForStatement>>,
Expect<Equal<Match<"ForStatement:exit">, T.ForStatement>>,
Expect<Equal<Match<"FunctionDeclaration">, T.FunctionDeclaration>>,
Expect<Equal<Match<"FunctionDeclaration:exit">, T.FunctionDeclaration>>,
Expect<Equal<Match<"FunctionExpression">, T.FunctionExpression>>,
Expect<Equal<Match<"FunctionExpression:exit">, T.FunctionExpression>>,
Expect<Equal<Match<"IfStatement">, T.IfStatement>>,
Expect<Equal<Match<"IfStatement:exit">, T.IfStatement>>,
Expect<Equal<Match<"ImportDeclaration">, T.ImportDeclaration>>,
Expect<Equal<Match<"LogicalExpression">, T.LogicalExpression>>,
Expect<Equal<Match<"LogicalExpression:exit">, T.LogicalExpression>>,
Expect<Equal<Match<"MemberExpression">, T.MemberExpression>>,
Expect<Equal<Match<"Program">, T.Program>>,
Expect<Equal<Match<"Program:exit">, T.Program>>,
Expect<Equal<Match<"SwitchStatement">, T.SwitchStatement>>,
Expect<Equal<Match<"SwitchStatement:exit">, T.SwitchStatement>>,
Expect<Equal<Match<"VariableDeclarator, AssignmentExpression">, T.VariableDeclarator | T.AssignmentExpression>>,
]