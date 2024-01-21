import type { TSESTree } from "@typescript-eslint/typescript-estree";
import type { MergeTwoMetaFields, MergeTwoMetaIdentifiers, MergeTwoMetas } from "../../src/match/merge-metas";
import type { AttrValueIsUnsafeToIntersect, CarefullyIntersectNodes, ExtractChildDeps, FilterNodes, NeverError, PickNode, TryToNarrowByExtracting, TryToParseAttrValue } from "../../src/match/utils";
import type { Equal, Expect } from "../../src/utils";

export type TestCarefullyIntersectNodes = [
  Expect<Equal<CarefullyIntersectNodes<TSESTree.Literal | TSESTree.ExportDeclaration, TSESTree.Literal | TSESTree.ImportDeclaration>, TSESTree.Literal>>,
  Expect<Equal<CarefullyIntersectNodes<TSESTree.Node, TSESTree.Literal | TSESTree.ImportDeclaration>, TSESTree.Literal | TSESTree.ImportDeclaration>>,
  Expect<Equal<CarefullyIntersectNodes<TSESTree.Literal | TSESTree.ImportDeclaration, TSESTree.Node>, TSESTree.Literal | TSESTree.ImportDeclaration>>,
]

export type TestTryToNarrowByExtracting = [
  Expect<Equal<TryToNarrowByExtracting<{type: 'a'} | {type: 'b'} | {withoutType: 'c'}, {type: 'd'}>, {type: 'a'} | {type: 'b'}>>,
  Expect<Equal<TryToNarrowByExtracting<{type: 'a'} | {type: 'b'} | {withoutType: 'c'}, {type: 'a'}>, {type: 'a'}>>,
]

export type TestFilterNodes = [
  Expect<Equal<FilterNodes<TSESTree.CallExpression | TSESTree.MemberExpression, TSESTree.Node>, TSESTree.CallExpression | TSESTree.MemberExpression>>,
  Expect<Equal<FilterNodes<TSESTree.CallExpression[] | TSESTree.MemberExpression[], TSESTree.Node>, TSESTree.CallExpression | TSESTree.MemberExpression>>,
  Expect<Equal<FilterNodes<(TSESTree.CallExpression | TSESTree.MemberExpression)[], TSESTree.Node>, TSESTree.CallExpression | TSESTree.MemberExpression>>,
]

export type TestExtractChildDeps = [
  Expect<Equal<ExtractChildDeps<TSESTree.CallExpression, TSESTree.Node>, TSESTree.LeftHandSideExpression | TSESTree.CallExpressionArgument | TSESTree.TSTypeParameterInstantiation | TSESTree.TSTypeParameterInstantiation>>,
  Expect<Equal<ExtractChildDeps<TSESTree.Program, TSESTree.Node>, TSESTree.ProgramStatement>>,
]

export type TestPickNode = [
  Expect<Equal<PickNode<'CallExpression', TSESTree.Node>, TSESTree.CallExpression>>,
  Expect<Equal<PickNode<'ExportNamedDeclaration', TSESTree.Node>, TSESTree.ExportNamedDeclaration>>,
  Expect<Equal<PickNode<'something', TSESTree.Node>, never>>,
]

export type TestTryToParseAttrValue = [
  Expect<Equal<TryToParseAttrValue<'true'>, true>>,
  Expect<Equal<TryToParseAttrValue<'false'>, false>>,
  Expect<Equal<TryToParseAttrValue<'null'>, null>>,
  Expect<Equal<TryToParseAttrValue<'undefined'>, undefined>>,
  Expect<Equal<TryToParseAttrValue<'something'>, AttrValueIsUnsafeToIntersect>>,
]

export type TestMergeTwoMetaIdentifiers = [
  Expect<Equal<MergeTwoMetaIdentifiers<null, 'B'>, 'B'>>,
  Expect<Equal<MergeTwoMetaIdentifiers<'A', null>, 'A'>>,
  Expect<Equal<MergeTwoMetaIdentifiers<null, null>, null>>,
  Expect<Equal<MergeTwoMetaIdentifiers<'A', 'A'>, 'A'>>,
  Expect<Equal<MergeTwoMetaIdentifiers<'A', 'B'>, NeverError<'different identifiers: A, B'>>>,
]

export type TestMergeTwoMetaFields = [
  Expect<Equal<MergeTwoMetaFields<null, 'B'>, 'B'>>,
  Expect<Equal<MergeTwoMetaFields<'A', null>, 'A'>>,
  Expect<Equal<MergeTwoMetaFields<null, null>, null>>,
  Expect<Equal<MergeTwoMetaFields<'A', 'A'>, 'A'>>,
  Expect<Equal<MergeTwoMetaFields<'A', 'B'>, NeverError<'different fields: A, B'>>>,
  
  Expect<Equal<MergeTwoMetaFields<null, 'B.B'>, null>>,
  Expect<Equal<MergeTwoMetaFields<'A.A', 'B'>, 'B'>>,
  Expect<Equal<MergeTwoMetaFields<'A', 'B.B'>, 'A'>>,
]

export type TestMergeTwoMetas = [
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
