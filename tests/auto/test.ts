import type { Equal, Expect } from './utils'
import type { ParseIt } from '../../src/hhh'

type _TestCases = [
  Expect<Equal<ParseIt<'Program'>, { type: 'identifier'; value: 'Program' }>>,
  Expect<Equal<ParseIt<'*'>, { type: 'wildcard'; value: '*' }>>,
  Expect<
    Equal<
      ParseIt<'ProgramCallExpression'>,
      { type: 'identifier'; value: 'ProgramCallExpression' }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   ProgramCallExpression'>,
      { type: 'identifier'; value: 'ProgramCallExpression' }
    >
  >,
  Expect<
    Equal<
      ParseIt<'Program   CallExpression'>,
      {
        type: 'descendant'
        left: { type: 'identifier'; value: 'Program' }
        right: { type: 'identifier'; value: 'CallExpression' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   Program   CallExpression'>,
      {
        type: 'descendant'
        left: { type: 'identifier'; value: 'Program' }
        right: { type: 'identifier'; value: 'CallExpression' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'Program,CallExpression'>,
      {
        type: 'matches'
        selectors: [
          { type: 'identifier'; value: 'Program' },
          { type: 'identifier'; value: 'CallExpression' },
        ]
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   Program,CallExpression'>,
      {
        type: 'matches'
        selectors: [
          { type: 'identifier'; value: 'Program' },
          { type: 'identifier'; value: 'CallExpression' },
        ]
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'Program   ,CallExpression'>,
      {
        type: 'matches'
        selectors: [
          { type: 'identifier'; value: 'Program' },
          { type: 'identifier'; value: 'CallExpression' },
        ]
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   Program   ,CallExpression'>,
      {
        type: 'matches'
        selectors: [
          { type: 'identifier'; value: 'Program' },
          { type: 'identifier'; value: 'CallExpression' },
        ]
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'Program   CallExpression'>,
      {
        type: 'descendant'
        left: { type: 'identifier'; value: 'Program' }
        right: { type: 'identifier'; value: 'CallExpression' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   Program   CallExpression'>,
      {
        type: 'descendant'
        left: { type: 'identifier'; value: 'Program' }
        right: { type: 'identifier'; value: 'CallExpression' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'Program      CallExpression'>,
      {
        type: 'descendant'
        left: { type: 'identifier'; value: 'Program' }
        right: { type: 'identifier'; value: 'CallExpression' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   Program      CallExpression'>,
      {
        type: 'descendant'
        left: { type: 'identifier'; value: 'Program' }
        right: { type: 'identifier'; value: 'CallExpression' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'Program,   CallExpression'>,
      {
        type: 'matches'
        selectors: [
          { type: 'identifier'; value: 'Program' },
          { type: 'identifier'; value: 'CallExpression' },
        ]
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   Program,   CallExpression'>,
      {
        type: 'matches'
        selectors: [
          { type: 'identifier'; value: 'Program' },
          { type: 'identifier'; value: 'CallExpression' },
        ]
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'Program   ,   CallExpression'>,
      {
        type: 'matches'
        selectors: [
          { type: 'identifier'; value: 'Program' },
          { type: 'identifier'; value: 'CallExpression' },
        ]
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   Program   ,   CallExpression'>,
      {
        type: 'matches'
        selectors: [
          { type: 'identifier'; value: 'Program' },
          { type: 'identifier'; value: 'CallExpression' },
        ]
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'ProgramCallExpression   '>,
      { type: 'identifier'; value: 'ProgramCallExpression' }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   ProgramCallExpression   '>,
      { type: 'identifier'; value: 'ProgramCallExpression' }
    >
  >,
  Expect<
    Equal<
      ParseIt<'Program   CallExpression   '>,
      {
        type: 'descendant'
        left: { type: 'identifier'; value: 'Program' }
        right: { type: 'identifier'; value: 'CallExpression' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   Program   CallExpression   '>,
      {
        type: 'descendant'
        left: { type: 'identifier'; value: 'Program' }
        right: { type: 'identifier'; value: 'CallExpression' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'Program,CallExpression   '>,
      {
        type: 'matches'
        selectors: [
          { type: 'identifier'; value: 'Program' },
          { type: 'identifier'; value: 'CallExpression' },
        ]
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   Program,CallExpression   '>,
      {
        type: 'matches'
        selectors: [
          { type: 'identifier'; value: 'Program' },
          { type: 'identifier'; value: 'CallExpression' },
        ]
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'Program   ,CallExpression   '>,
      {
        type: 'matches'
        selectors: [
          { type: 'identifier'; value: 'Program' },
          { type: 'identifier'; value: 'CallExpression' },
        ]
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   Program   ,CallExpression   '>,
      {
        type: 'matches'
        selectors: [
          { type: 'identifier'; value: 'Program' },
          { type: 'identifier'; value: 'CallExpression' },
        ]
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'Program   CallExpression   '>,
      {
        type: 'descendant'
        left: { type: 'identifier'; value: 'Program' }
        right: { type: 'identifier'; value: 'CallExpression' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   Program   CallExpression   '>,
      {
        type: 'descendant'
        left: { type: 'identifier'; value: 'Program' }
        right: { type: 'identifier'; value: 'CallExpression' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'Program      CallExpression   '>,
      {
        type: 'descendant'
        left: { type: 'identifier'; value: 'Program' }
        right: { type: 'identifier'; value: 'CallExpression' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   Program      CallExpression   '>,
      {
        type: 'descendant'
        left: { type: 'identifier'; value: 'Program' }
        right: { type: 'identifier'; value: 'CallExpression' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'Program,   CallExpression   '>,
      {
        type: 'matches'
        selectors: [
          { type: 'identifier'; value: 'Program' },
          { type: 'identifier'; value: 'CallExpression' },
        ]
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   Program,   CallExpression   '>,
      {
        type: 'matches'
        selectors: [
          { type: 'identifier'; value: 'Program' },
          { type: 'identifier'; value: 'CallExpression' },
        ]
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'Program   ,   CallExpression   '>,
      {
        type: 'matches'
        selectors: [
          { type: 'identifier'; value: 'Program' },
          { type: 'identifier'; value: 'CallExpression' },
        ]
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   Program   ,   CallExpression   '>,
      {
        type: 'matches'
        selectors: [
          { type: 'identifier'; value: 'Program' },
          { type: 'identifier'; value: 'CallExpression' },
        ]
      }
    >
  >,
  Expect<Equal<ParseIt<'[aaa]'>, { type: 'attribute'; name: 'aaa' }>>,
  Expect<Equal<ParseIt<'   [aaa]'>, { type: 'attribute'; name: 'aaa' }>>,
  Expect<Equal<ParseIt<'[   aaa]'>, { type: 'attribute'; name: 'aaa' }>>,
  Expect<Equal<ParseIt<'   [   aaa]'>, { type: 'attribute'; name: 'aaa' }>>,
  Expect<
    Equal<ParseIt<'[aaa.bbb.ccc]'>, { type: 'attribute'; name: 'aaa.bbb.ccc' }>
  >,
  Expect<
    Equal<
      ParseIt<'   [aaa.bbb.ccc]'>,
      { type: 'attribute'; name: 'aaa.bbb.ccc' }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[   aaa.bbb.ccc]'>,
      { type: 'attribute'; name: 'aaa.bbb.ccc' }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [   aaa.bbb.ccc]'>,
      { type: 'attribute'; name: 'aaa.bbb.ccc' }
    >
  >,
  Expect<Equal<ParseIt<'[aaa   ]'>, { type: 'attribute'; name: 'aaa' }>>,
  Expect<Equal<ParseIt<'   [aaa   ]'>, { type: 'attribute'; name: 'aaa' }>>,
  Expect<Equal<ParseIt<'[   aaa   ]'>, { type: 'attribute'; name: 'aaa' }>>,
  Expect<Equal<ParseIt<'   [   aaa   ]'>, { type: 'attribute'; name: 'aaa' }>>,
  Expect<
    Equal<
      ParseIt<'[aaa.bbb.ccc   ]'>,
      { type: 'attribute'; name: 'aaa.bbb.ccc' }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [aaa.bbb.ccc   ]'>,
      { type: 'attribute'; name: 'aaa.bbb.ccc' }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[   aaa.bbb.ccc   ]'>,
      { type: 'attribute'; name: 'aaa.bbb.ccc' }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [   aaa.bbb.ccc   ]'>,
      { type: 'attribute'; name: 'aaa.bbb.ccc' }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[aaa=a]'>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [aaa=a]'>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[   aaa=a]'>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [   aaa=a]'>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[aaa.bbb.ccc=a]'>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [aaa.bbb.ccc=a]'>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[   aaa.bbb.ccc=a]'>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [   aaa.bbb.ccc=a]'>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[aaa   =a]'>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [aaa   =a]'>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[   aaa   =a]'>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [   aaa   =a]'>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[aaa.bbb.ccc   =a]'>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [aaa.bbb.ccc   =a]'>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[   aaa.bbb.ccc   =a]'>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [   aaa.bbb.ccc   =a]'>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[aaa>=a]'>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '>='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [aaa>=a]'>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '>='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[   aaa>=a]'>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '>='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [   aaa>=a]'>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '>='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[aaa.bbb.ccc>=a]'>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '>='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [aaa.bbb.ccc>=a]'>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '>='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[   aaa.bbb.ccc>=a]'>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '>='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [   aaa.bbb.ccc>=a]'>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '>='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[aaa   >=a]'>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '>='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [aaa   >=a]'>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '>='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[   aaa   >=a]'>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '>='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [   aaa   >=a]'>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '>='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[aaa.bbb.ccc   >=a]'>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '>='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [aaa.bbb.ccc   >=a]'>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '>='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[   aaa.bbb.ccc   >=a]'>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '>='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [   aaa.bbb.ccc   >=a]'>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '>='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[aaa<=a]'>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '<='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [aaa<=a]'>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '<='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[   aaa<=a]'>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '<='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [   aaa<=a]'>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '<='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[aaa.bbb.ccc<=a]'>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '<='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [aaa.bbb.ccc<=a]'>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '<='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[   aaa.bbb.ccc<=a]'>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '<='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [   aaa.bbb.ccc<=a]'>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '<='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[aaa   <=a]'>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '<='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [aaa   <=a]'>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '<='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[   aaa   <=a]'>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '<='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [   aaa   <=a]'>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '<='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[aaa.bbb.ccc   <=a]'>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '<='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [aaa.bbb.ccc   <=a]'>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '<='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[   aaa.bbb.ccc   <=a]'>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '<='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [   aaa.bbb.ccc   <=a]'>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '<='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[aaa=   a]'>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [aaa=   a]'>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[   aaa=   a]'>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [   aaa=   a]'>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[aaa.bbb.ccc=   a]'>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [aaa.bbb.ccc=   a]'>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[   aaa.bbb.ccc=   a]'>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [   aaa.bbb.ccc=   a]'>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[aaa   =   a]'>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [aaa   =   a]'>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[   aaa   =   a]'>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [   aaa   =   a]'>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[aaa.bbb.ccc   =   a]'>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [aaa.bbb.ccc   =   a]'>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[   aaa.bbb.ccc   =   a]'>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [   aaa.bbb.ccc   =   a]'>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[aaa>=   a]'>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '>='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [aaa>=   a]'>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '>='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[   aaa>=   a]'>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '>='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [   aaa>=   a]'>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '>='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[aaa.bbb.ccc>=   a]'>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '>='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [aaa.bbb.ccc>=   a]'>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '>='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[   aaa.bbb.ccc>=   a]'>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '>='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [   aaa.bbb.ccc>=   a]'>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '>='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[aaa   >=   a]'>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '>='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [aaa   >=   a]'>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '>='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[   aaa   >=   a]'>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '>='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [   aaa   >=   a]'>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '>='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[aaa.bbb.ccc   >=   a]'>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '>='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [aaa.bbb.ccc   >=   a]'>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '>='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[   aaa.bbb.ccc   >=   a]'>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '>='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [   aaa.bbb.ccc   >=   a]'>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '>='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[aaa<=   a]'>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '<='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [aaa<=   a]'>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '<='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[   aaa<=   a]'>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '<='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [   aaa<=   a]'>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '<='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[aaa.bbb.ccc<=   a]'>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '<='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [aaa.bbb.ccc<=   a]'>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '<='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[   aaa.bbb.ccc<=   a]'>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '<='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [   aaa.bbb.ccc<=   a]'>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '<='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[aaa   <=   a]'>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '<='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [aaa   <=   a]'>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '<='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[   aaa   <=   a]'>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '<='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [   aaa   <=   a]'>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '<='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[aaa.bbb.ccc   <=   a]'>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '<='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [aaa.bbb.ccc   <=   a]'>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '<='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[   aaa.bbb.ccc   <=   a]'>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '<='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [   aaa.bbb.ccc   <=   a]'>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '<='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<Equal<ParseIt<'[aaa]   '>, { type: 'attribute'; name: 'aaa' }>>,
  Expect<Equal<ParseIt<'   [aaa]   '>, { type: 'attribute'; name: 'aaa' }>>,
  Expect<Equal<ParseIt<'[   aaa]   '>, { type: 'attribute'; name: 'aaa' }>>,
  Expect<Equal<ParseIt<'   [   aaa]   '>, { type: 'attribute'; name: 'aaa' }>>,
  Expect<
    Equal<
      ParseIt<'[aaa.bbb.ccc]   '>,
      { type: 'attribute'; name: 'aaa.bbb.ccc' }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [aaa.bbb.ccc]   '>,
      { type: 'attribute'; name: 'aaa.bbb.ccc' }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[   aaa.bbb.ccc]   '>,
      { type: 'attribute'; name: 'aaa.bbb.ccc' }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [   aaa.bbb.ccc]   '>,
      { type: 'attribute'; name: 'aaa.bbb.ccc' }
    >
  >,
  Expect<Equal<ParseIt<'[aaa   ]   '>, { type: 'attribute'; name: 'aaa' }>>,
  Expect<Equal<ParseIt<'   [aaa   ]   '>, { type: 'attribute'; name: 'aaa' }>>,
  Expect<Equal<ParseIt<'[   aaa   ]   '>, { type: 'attribute'; name: 'aaa' }>>,
  Expect<
    Equal<ParseIt<'   [   aaa   ]   '>, { type: 'attribute'; name: 'aaa' }>
  >,
  Expect<
    Equal<
      ParseIt<'[aaa.bbb.ccc   ]   '>,
      { type: 'attribute'; name: 'aaa.bbb.ccc' }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [aaa.bbb.ccc   ]   '>,
      { type: 'attribute'; name: 'aaa.bbb.ccc' }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[   aaa.bbb.ccc   ]   '>,
      { type: 'attribute'; name: 'aaa.bbb.ccc' }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [   aaa.bbb.ccc   ]   '>,
      { type: 'attribute'; name: 'aaa.bbb.ccc' }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[aaa=a]   '>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [aaa=a]   '>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[   aaa=a]   '>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [   aaa=a]   '>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[aaa.bbb.ccc=a]   '>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [aaa.bbb.ccc=a]   '>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[   aaa.bbb.ccc=a]   '>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [   aaa.bbb.ccc=a]   '>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[aaa   =a]   '>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [aaa   =a]   '>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[   aaa   =a]   '>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [   aaa   =a]   '>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[aaa.bbb.ccc   =a]   '>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [aaa.bbb.ccc   =a]   '>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[   aaa.bbb.ccc   =a]   '>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [   aaa.bbb.ccc   =a]   '>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[aaa>=a]   '>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '>='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [aaa>=a]   '>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '>='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[   aaa>=a]   '>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '>='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [   aaa>=a]   '>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '>='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[aaa.bbb.ccc>=a]   '>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '>='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [aaa.bbb.ccc>=a]   '>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '>='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[   aaa.bbb.ccc>=a]   '>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '>='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [   aaa.bbb.ccc>=a]   '>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '>='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[aaa   >=a]   '>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '>='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [aaa   >=a]   '>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '>='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[   aaa   >=a]   '>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '>='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [   aaa   >=a]   '>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '>='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[aaa.bbb.ccc   >=a]   '>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '>='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [aaa.bbb.ccc   >=a]   '>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '>='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[   aaa.bbb.ccc   >=a]   '>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '>='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [   aaa.bbb.ccc   >=a]   '>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '>='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[aaa<=a]   '>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '<='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [aaa<=a]   '>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '<='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[   aaa<=a]   '>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '<='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [   aaa<=a]   '>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '<='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[aaa.bbb.ccc<=a]   '>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '<='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [aaa.bbb.ccc<=a]   '>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '<='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[   aaa.bbb.ccc<=a]   '>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '<='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [   aaa.bbb.ccc<=a]   '>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '<='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[aaa   <=a]   '>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '<='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [aaa   <=a]   '>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '<='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[   aaa   <=a]   '>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '<='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [   aaa   <=a]   '>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '<='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[aaa.bbb.ccc   <=a]   '>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '<='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [aaa.bbb.ccc   <=a]   '>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '<='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[   aaa.bbb.ccc   <=a]   '>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '<='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [   aaa.bbb.ccc   <=a]   '>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '<='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[aaa=   a]   '>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [aaa=   a]   '>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[   aaa=   a]   '>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [   aaa=   a]   '>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[aaa.bbb.ccc=   a]   '>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [aaa.bbb.ccc=   a]   '>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[   aaa.bbb.ccc=   a]   '>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [   aaa.bbb.ccc=   a]   '>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[aaa   =   a]   '>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [aaa   =   a]   '>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[   aaa   =   a]   '>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [   aaa   =   a]   '>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[aaa.bbb.ccc   =   a]   '>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [aaa.bbb.ccc   =   a]   '>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[   aaa.bbb.ccc   =   a]   '>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [   aaa.bbb.ccc   =   a]   '>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[aaa>=   a]   '>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '>='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [aaa>=   a]   '>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '>='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[   aaa>=   a]   '>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '>='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [   aaa>=   a]   '>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '>='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[aaa.bbb.ccc>=   a]   '>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '>='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [aaa.bbb.ccc>=   a]   '>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '>='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[   aaa.bbb.ccc>=   a]   '>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '>='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [   aaa.bbb.ccc>=   a]   '>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '>='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[aaa   >=   a]   '>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '>='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [aaa   >=   a]   '>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '>='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[   aaa   >=   a]   '>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '>='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [   aaa   >=   a]   '>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '>='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[aaa.bbb.ccc   >=   a]   '>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '>='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [aaa.bbb.ccc   >=   a]   '>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '>='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[   aaa.bbb.ccc   >=   a]   '>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '>='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [   aaa.bbb.ccc   >=   a]   '>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '>='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[aaa<=   a]   '>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '<='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [aaa<=   a]   '>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '<='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[   aaa<=   a]   '>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '<='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [   aaa<=   a]   '>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '<='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[aaa.bbb.ccc<=   a]   '>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '<='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [aaa.bbb.ccc<=   a]   '>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '<='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[   aaa.bbb.ccc<=   a]   '>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '<='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [   aaa.bbb.ccc<=   a]   '>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '<='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[aaa   <=   a]   '>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '<='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [aaa   <=   a]   '>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '<='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[   aaa   <=   a]   '>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '<='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [   aaa   <=   a]   '>,
      {
        type: 'attribute'
        name: 'aaa'
        operator: '<='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[aaa.bbb.ccc   <=   a]   '>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '<='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [aaa.bbb.ccc   <=   a]   '>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '<='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'[   aaa.bbb.ccc   <=   a]   '>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '<='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
  Expect<
    Equal<
      ParseIt<'   [   aaa.bbb.ccc   <=   a]   '>,
      {
        type: 'attribute'
        name: 'aaa.bbb.ccc'
        operator: '<='
        value: { type: 'literal'; value: 'a' }
      }
    >
  >,
]
