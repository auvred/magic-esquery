// TODO: fix broken tests

import type {
  ParseAtom,
  ParseAttr,
  ParseAttrValueNumber,
  ParseAttrValueRegex,
  ParseAttrValueString,
  ParseAttrValueType,
  ParseIdentifier,
  ParseSelector,
  ParseSelectors,
  ParseWildcard,
  SplitFirst,
  TrimLeft,
  TrimS,
  _ParseAttrValueRegexFlags,
  _ParseSelectorsTrimCommaAtStart,
} from './src/hhh'

export type Expect<T extends true> = T
export type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <
  T,
>() => T extends Y ? 1 : 2
  ? true
  : false

export declare const test: ParseAttr<'[a=b]'>
//                    ^?

export type trims = [
  Expect<Equal<TrimLeft<'00 b 0', '0'>, ' b 0'>>,
  Expect<Equal<TrimS<'  a b c '>, 'a b c'>>,
  Expect<Equal<TrimS<'a b c'>, 'a b c'>>,
  Expect<Equal<TrimS<'       '>, ''>>,
  Expect<Equal<TrimS<'a '>, 'a'>>,
  Expect<Equal<TrimS<'aaa   '>, 'aaa'>>,
  Expect<Equal<TrimS<' a'>, 'a'>>,
  Expect<Equal<TrimS<'   aaa'>, 'aaa'>>,
]

export type split = [
  Expect<Equal<SplitFirst<'aa=bb', '='>, ['aa', 'bb']>>,
  Expect<Equal<SplitFirst<'aa=bb=cc', '='>, ['aa', 'bb=cc']>>,
  Expect<Equal<SplitFirst<'=bb=cc', '='>, ['', 'bb=cc']>>,
  Expect<Equal<SplitFirst<'aa=', '='>, ['aa', '']>>,
]

export type wildcardParsing = [
  Expect<Equal<ParseWildcard<'*'>, { type: 'wildcard'; value: '*'; rest: '' }>>,
  Expect<
    Equal<ParseWildcard<'*-'>, { type: 'wildcard'; value: '*'; rest: '-' }>
  >,
  Expect<
    Equal<ParseWildcard<'*>a'>, { type: 'wildcard'; value: '*'; rest: '>a' }>
  >,
  Expect<
    Equal<ParseWildcard<'*,a'>, { type: 'wildcard'; value: '*'; rest: ',a' }>
  >,
  Expect<Equal<ParseWildcard<'-'>, 'wildcardnope'>>,
  Expect<Equal<ParseWildcard<'-*'>, 'wildcardnope'>>,
  Expect<Equal<ParseWildcard<'a*b'>, 'wildcardnope'>>,
]

export type identifierParsing = [
  Expect<
    Equal<
      ParseIdentifier<'name'>,
      { type: 'identifier'; value: 'name'; rest: '' }
    >
  >,
  Expect<
    Equal<
      ParseIdentifier<'name['>,
      { type: 'identifier'; value: 'name'; rest: '[' }
    >
  >,
  Expect<
    Equal<
      ParseIdentifier<'name+value'>,
      { type: 'identifier'; value: 'name'; rest: '+value' }
    >
  >,
  Expect<
    Equal<
      ParseIdentifier<'name.value'>,
      { type: 'identifier'; value: 'name'; rest: '.value' }
    >
  >,
  Expect<
    Equal<
      ParseIdentifier<'name,value'>,
      { type: 'identifier'; value: 'name'; rest: ',value' }
    >
  >,
  Expect<
    Equal<
      ParseIdentifier<'#name'>,
      { type: 'identifier'; value: 'name'; rest: '' }
    >
  >,
  Expect<
    Equal<
      ParseIdentifier<'#name,value'>,
      { type: 'identifier'; value: 'name'; rest: ',value' }
    >
  >,
  Expect<Equal<ParseIdentifier<''>, 'identifierEmpty'>>,
  Expect<Equal<ParseIdentifier<'#'>, 'identifierEmpty'>>,
  Expect<Equal<ParseIdentifier<'+name'>, 'identifierEmpty'>>,
  Expect<Equal<ParseIdentifier<'[name]'>, 'identifierEmpty'>>,
  Expect<Equal<ParseIdentifier<'#[name]'>, 'identifierEmpty'>>,
]

export type attrValueType = [
  Expect<
    Equal<ParseAttrValueType<'type(number)'>, { type: 'type'; value: 'number' }>
  >,
  Expect<
    Equal<
      ParseAttrValueType<'type(  number)'>,
      { type: 'type'; value: 'number' }
    >
  >,
  Expect<
    Equal<
      ParseAttrValueType<'type(number  )'>,
      { type: 'type'; value: 'number' }
    >
  >,
  Expect<
    Equal<
      ParseAttrValueType<'type(   number  )'>,
      { type: 'type'; value: 'number' }
    >
  >,
  Expect<
    Equal<
      ParseAttrValueType<'type(   number  ) '>,
      'attrValueTypeErr-somethingAfterClosingParen'
    >
  >,
  Expect<
    Equal<
      ParseAttrValueType<'type(   number  )s'>,
      'attrValueTypeErr-somethingAfterClosingParen'
    >
  >,
  Expect<
    Equal<ParseAttrValueType<'type(number  '>, 'attrValueTypeErr-doesntMatch'>
  >,
  Expect<
    Equal<ParseAttrValueType<'tpe(number)'>, 'attrValueTypeErr-doesntMatch'>
  >,
  Expect<
    Equal<ParseAttrValueType<' type(number)'>, 'attrValueTypeErr-doesntMatch'>
  >,
  Expect<
    Equal<ParseAttrValueType<' type{number)'>, 'attrValueTypeErr-doesntMatch'>
  >,
]

export type attrValueRegexFlags = [
  Expect<
    Equal<_ParseAttrValueRegexFlags<'imsu'>, { res: 'i' | 'm' | 's' | 'u' }>
  >,
  Expect<Equal<_ParseAttrValueRegexFlags<'msu'>, { res: 'm' | 's' | 'u' }>>,
  Expect<Equal<_ParseAttrValueRegexFlags<'mmssu'>, 'regexDuplicatedFlag-s'>>,
  Expect<Equal<_ParseAttrValueRegexFlags<'gm'>, 'regexUnknownFlag-g'>>,
  Expect<Equal<_ParseAttrValueRegexFlags<' m'>, 'regexUnknownFlag- '>>,
  Expect<Equal<_ParseAttrValueRegexFlags<''>, 'regexEmptyFlags'>>,
]

export type arrValueString = [
  Expect<
    Equal<
      ParseAttrValueString<'" string "'>,
      { type: 'literal'; value: ' string ' }
    >
  >,
  Expect<
    Equal<
      ParseAttrValueString<'" str\\"ing "'>,
      { type: 'literal'; value: ' str"ing ' }
    >
  >,
  Expect<
    Equal<
      ParseAttrValueString<'" string "'>,
      { type: 'literal'; value: ' string ' }
    >
  >,
  Expect<Equal<ParseAttrValueString<'""'>, { type: 'literal'; value: '' }>>,
  Expect<Equal<ParseAttrValueString<"'\\''">, { type: 'literal'; value: "'" }>>,
]

export type arrValueNumber = [
  Expect<Equal<ParseAttrValueNumber<'1'>, { type: 'literal'; value: 1 }>>,
  Expect<Equal<ParseAttrValueNumber<'100'>, { type: 'literal'; value: 100 }>>,
  Expect<Equal<ParseAttrValueNumber<'010'>, { type: 'literal'; value: 10 }>>,
  Expect<Equal<ParseAttrValueNumber<'10.4'>, { type: 'literal'; value: 10.4 }>>,
]

export type attrValueRegex = [
  Expect<
    Equal<ParseAttrValueRegex<'/some/'>, { type: 'regex'; value: '/some/' }>
  >,
  Expect<
    Equal<
      ParseAttrValueRegex<'/^aaa bb$/'>,
      { type: 'regex'; value: '/^aaa bb$/' }
    >
  >,
  Expect<
    Equal<
      ParseAttrValueRegex<'/^aaa bb$/imsu'>,
      { type: 'regex'; value: '/^aaa bb$/imsu' }
    >
  >,
  Expect<
    Equal<
      ParseAttrValueRegex<'/some/msu'>,
      { type: 'regex'; value: '/some/msu' }
    >
  >,
  Expect<
    Equal<ParseAttrValueRegex<'/some/ '>, 'regexErrInFlags-regexUnknownFlag- '>
  >,
  Expect<
    Equal<
      ParseAttrValueRegex<'/^aaa bb$/imsug'>,
      'regexErrInFlags-regexUnknownFlag-g'
    >
  >,
  Expect<
    Equal<
      ParseAttrValueRegex<'/some/mm'>,
      'regexErrInFlags-regexDuplicatedFlag-m'
    >
  >,
  // intentionally inheriting the same issue for consistency
  // https://github.com/estools/esquery/issues/68
  Expect<
    Equal<
      ParseAttrValueRegex<'/so\\/me/mm'>,
      'regexErrInFlags-regexUnknownFlag-e'
    >
  >,
]

export type attrParsing = [
  Expect<
    Equal<
      ParseAttr<'[name.path<=value]'>,
      {
        type: 'attribute'
        name: 'name.path'
        operator: '<='
        value: 'value'
        rest: ''
      }
    >
  >,
  Expect<
    Equal<ParseAttr<'[<=value]'>, 'attrNope-identifierNameNopeOnLessOrEqOp'>
  >,
  Expect<
    Equal<
      ParseAttr<'[name path<=value]'>,
      'attrNope-lessOrEqOpWrongIdentifierName'
    >
  >,
  Expect<
    Equal<
      ParseAttr<'[name[path<=value]'>,
      'attrNope-lessOrEqOpWrongIdentifierName'
    >
  >,
  Expect<
    Equal<
      ParseAttr<'[name.path>=value]_re st'>,
      {
        type: 'attribute'
        name: 'name.path'
        operator: '>='
        value: 'value'
        rest: '_re st'
      }
    >
  >,
  Expect<
    Equal<
      ParseAttr<'[name.path.pathPath>=valueValue]123rest'>,
      {
        type: 'attribute'
        name: 'name.path.pathPath'
        operator: '>='
        value: 'valueValue'
        rest: '123rest'
      }
    >
  >,
  Expect<
    Equal<ParseAttr<'[>=value]'>, 'attrNope-identifierNameNopeOnGreaterOrEqOp'>
  >,
  Expect<
    Equal<
      ParseAttr<'[name path>=value]'>,
      'attrNope-greaterOrEqOpWrongIdentifierName'
    >
  >,
  Expect<
    Equal<
      ParseAttr<'[name[path>=value]'>,
      'attrNope-greaterOrEqOpWrongIdentifierName'
    >
  >,
  Expect<
    Equal<
      ParseAttr<'[name=type(number)]r'>,
      {
        type: 'attribute'
        name: 'name'
        operator: '='
        value: {
          type: 'type'
          value: 'number'
        }
        rest: 'r'
      }
    >
  >,
  Expect<
    Equal<
      ParseAttr<'[name=type( "string" )]'>,
      {
        type: 'attribute'
        name: 'name'
        operator: '='
        value: {
          type: 'type'
          value: '"string"'
        }
        rest: ''
      }
    >
  >,
  Expect<
    Equal<
      ParseAttr<'[name=/^aaa bbb/]'>,
      {
        type: 'attribute'
        name: 'name'
        operator: '='
        value: {
          type: 'regex'
          value: '/^aaa bbb/'
        }
        rest: ''
      }
    >
  >,
  Expect<
    Equal<
      ParseAttr<'[name=/some/mis]'>,
      {
        type: 'attribute'
        name: 'name'
        operator: '='
        value: {
          type: 'regex'
          value: '/some/mis'
        }
        rest: ''
      }
    >
  >,
  Expect<
    Equal<
      ParseAttr<'[name="value"]r'>,
      {
        type: 'attribute'
        name: 'name'
        operator: '='
        value: {
          type: 'literal'
          value: 'value'
        }
        rest: 'r'
      }
    >
  >,
  Expect<
    Equal<
      ParseAttr<'[name=" va\\"lue "]'>,
      {
        type: 'attribute'
        name: 'name'
        operator: '='
        value: {
          type: 'literal'
          value: ' va"lue '
        }
        rest: ''
      }
    >
  >,
  Expect<
    Equal<
      ParseAttr<'[name=100]'>,
      {
        type: 'attribute'
        name: 'name'
        operator: '='
        value: {
          type: 'literal'
          value: 100
        }
        rest: ''
      }
    >
  >,
  Expect<
    Equal<
      ParseAttr<'[name=value]r'>,
      {
        type: 'attribute'
        name: 'name'
        operator: '='
        value: {
          type: 'literal'
          value: 'value'
        }
        rest: 'r'
      }
    >
  >,
  Expect<
    Equal<
      ParseAttr<'[name.path=value]'>,
      {
        type: 'attribute'
        name: 'name.path'
        operator: '='
        value: {
          type: 'literal'
          value: 'value'
        }
        rest: ''
      }
    >
  >,
  Expect<Equal<ParseAttr<'[name.path=val.ue]'>, 'unsupportedShit'>>,
  Expect<Equal<ParseAttr<'[=value]'>, 'attrNope-identifierNameNopeOnEqOp'>>,
  Expect<
    Equal<ParseAttr<'[name+path=value]'>, 'attrNope-eqOpWrongIdentifierName'>
  >,

  Expect<Equal<ParseAttr<'[]'>, 'attrNope-identifierNameNopeWithoutOp'>>,
  Expect<
    Equal<ParseAttr<'[name+path]'>, 'attrNope-withoutOpWrongIdentifierName'>
  >,
  Expect<
    Equal<ParseAttr<'[name[path]'>, 'attrNope-withoutOpWrongIdentifierName'>
  >,
  Expect<
    Equal<ParseAttr<'[name path]'>, 'attrNope-withoutOpWrongIdentifierName'>
  >,
  Expect<
    Equal<
      ParseAttr<'[name.path]'>,
      { type: 'attribute'; name: 'name.path'; rest: '' }
    >
  >,
  Expect<Equal<ParseAttr<'a[name.path>=value]'>, 'attrNope-squareBrackets'>>,
  Expect<Equal<ParseAttr<'[name.path>=value'>, 'attrNope-squareBrackets'>>,
  Expect<Equal<ParseAttr<'name.path>=value]'>, 'attrNope-squareBrackets'>>,
]

export type atomParsing = [
  Expect<Equal<ParseAtom<'*'>, { type: 'wildcard'; value: '*'; rest: '' }>>,
  Expect<Equal<ParseAtom<'*,a'>, { type: 'wildcard'; value: '*'; rest: ',a' }>>,
  Expect<
    Equal<ParseAtom<'name'>, { type: 'identifier'; value: 'name'; rest: '' }>
  >,
  Expect<
    Equal<
      ParseAtom<'name,anotherName'>,
      { type: 'identifier'; value: 'name'; rest: ',anotherName' }
    >
  >,
  Expect<
    Equal<
      ParseAtom<'[name.path] , some rest'>,
      {
        type: 'attribute'
        name: 'name.path'
        rest: ' , some rest'
      }
    >
  >,
]

export type sequenceParsing = [
  Expect<Equal<ParseSelector<'*'>, { type: 'wildcard'; value: '*'; rest: '' }>>,
  Expect<
    Equal<
      ParseSelector<'* a'>,
      {
        type: 'descendant'
        left: {
          type: 'wildcard'
          value: '*'
        }
        right: {
          type: 'identifier'
          value: 'a'
        }
      }
    >
  >,
  Expect<
    Equal<
      ParseSelector<'* a b c'>,
      {
        type: 'descendant'
        left: {
          type: 'descendant'
          left: {
            type: 'descendant'
            left: {
              type: 'wildcard'
              value: '*'
            }
            right: {
              type: 'identifier'
              value: 'a'
            }
          }
          right: {
            type: 'identifier'
            value: 'b'
          }
        }
        right: {
          type: 'identifier'
          value: 'c'
        }
      }
    >
  >,
  Expect<
    Equal<
      ParseSelector<'*>a~b+c d'>,
      {
        type: 'descendant'
        left: {
          type: 'adjacent'
          left: {
            type: 'sibling'
            left: {
              type: 'child'
              left: {
                type: 'wildcard'
                value: '*'
              }
              right: {
                type: 'identifier'
                value: 'a'
              }
            }
            right: {
              type: 'identifier'
              value: 'b'
            }
          }
          right: {
            type: 'identifier'
            value: 'c'
          }
        }
        right: {
          type: 'identifier'
          value: 'd'
        }
      }
    >
  >,
  Expect<
    Equal<
      ParseSelector<'*>a~b+c d'>,
      ParseSelector<'*  >  a  ~  b  +  c     d'>
    >
  >,
  Expect<
    Equal<
      ParseSelector<'a > [attr.name=value] [b]'>,
      {
        type: 'descendant'
        left: {
          type: 'child'
          left: {
            type: 'identifier'
            value: 'a'
          }
          right: {
            type: 'attribute'
            name: 'attr.name'
            operator: '='
            value: {
              type: 'literal'
              value: 'value'
            }
          }
        }
        right: {
          type: 'attribute'
          name: 'b'
        }
      }
    >
  >,
  Expect<
    Equal<ParseSelector<'[aa'>, 'sequenceErr-atomParseFailed-super next Stub'>
  >,
  Expect<
    Equal<
      ParseSelector<'aa > [b'>,
      {
        error: 'recursersequenceErr-atomParseFailed-super next Stub'
        memo: {
          type: 'identifier'
          value: 'aa'
        }
        rest: ' > [b'
      }
    >
  >,
  Expect<
    Equal<
      ParseSelector<'aa bb,cc'>,
      {
        error: 'recursersequenceErr-atomParseFailed-unknownBinaryOp'
        memo: {
          type: 'descendant'
          left: {
            type: 'identifier'
            value: 'aa'
          }
          right: {
            type: 'identifier'
            value: 'bb'
          }
        }
        rest: ',cc'
      }
    >
  >,
  Expect<
    Equal<
      ParseSelector<'aa bb ,cc'>,
      {
        error: 'recursersequenceErr-atomParseFailed-super next Stub'
        memo: {
          type: 'descendant'
          left: {
            type: 'identifier'
            value: 'aa'
          }
          right: {
            type: 'identifier'
            value: 'bb'
          }
        }
        rest: ' ,cc'
      }
    >
  >,
]

export type trimCommaAtStart = [
  Expect<Equal<_ParseSelectorsTrimCommaAtStart<',a'>, { res: 'a' }>>,
  Expect<Equal<_ParseSelectorsTrimCommaAtStart<'  ,a'>, { res: 'a' }>>,
  Expect<Equal<_ParseSelectorsTrimCommaAtStart<'  ,  a'>, { res: 'a' }>>,
  Expect<Equal<_ParseSelectorsTrimCommaAtStart<',  a'>, { res: 'a' }>>,
  Expect<Equal<_ParseSelectorsTrimCommaAtStart<',a  '>, { res: 'a  ' }>>,
  Expect<Equal<_ParseSelectorsTrimCommaAtStart<'[a  '>, 'commaErr'>>,
]

export type selectorsParsing = [
  Expect<
    Equal<
      ParseSelectors<'*'>,
      { selectors: [{ type: 'wildcard'; value: '*' }]; rest: '' }
    >
  >,
  Expect<
    Equal<
      ParseSelectors<'*,Program,[attr.yes=no]'>,
      {
        selectors: [
          {
            type: 'wildcard'
            value: '*'
          },
          {
            type: 'identifier'
            value: 'Program'
          },
          {
            type: 'attribute'
            name: 'attr.yes'
            operator: '='
            value: 'no'
          },
        ]
        rest: ''
      }
    >
  >,
  Expect<
    Equal<
      ParseSelectors<'* > aa,bb cc,dd~[attr.yes=no]'>,
      ParseSelectors<'*  >  aa  ,  bb  cc  ,  dd  ~  [attr.yes=no]'>
    >
  >,
  Expect<
    Equal<
      ParseSelectors<'* > aa,bb cc,dd~[attr.yes=no]'>,
      {
        selectors: [
          {
            type: 'child'
            left: {
              type: 'wildcard'
              value: '*'
            }
            right: {
              type: 'identifier'
              value: 'aa'
            }
          },
          {
            type: 'descendant'
            left: {
              type: 'identifier'
              value: 'bb'
            }
            right: {
              type: 'identifier'
              value: 'cc'
            }
          },
          {
            type: 'sibling'
            left: {
              type: 'identifier'
              value: 'dd'
            }
            right: {
              type: 'attribute'
              name: 'attr.yes'
              operator: '='
              value: 'no'
            }
          },
        ]
        rest: ''
      }
    >
  >,
]
