import type { Equal, Expect, Simplify } from './utils'

export type IdentifierNameRestrictedSymbols =
  | ' '
  | '['
  | ']'
  | ','
  | '('
  | ')'
  | ':'
  | '#'
  | '!'
  | '='
  | '>'
  | '<'
  | '~'
  | '+'
  | '.'

export type IdentifierNameRestrictedSymbolsWithDot = Exclude<
  IdentifierNameRestrictedSymbols,
  '.'
>

export type ParseIdentifierName<
  T extends string,
  RestrictedChars extends string,
  Acc extends string = '',
> = T extends ''
  ? Acc extends ''
    ? 'identifierNameEmpty'
    : {
        value: Acc
        rest: T
      }
  : T extends `${infer First}${infer Rest}`
    ? First extends RestrictedChars
      ? Acc extends ''
        ? 'identifierNameEmpty'
        : {
            value: Acc
            rest: T
          }
      : ParseIdentifierName<Rest, RestrictedChars, `${Acc}${First}`>
    : never

type ParseIdentifierInternal<
  T extends string,
  RestrictedChars extends string,
> = ParseIdentifierName<T, RestrictedChars> extends infer ParseRes
  ? ParseRes extends { value: infer V; rest: infer R }
    ? {
        type: 'identifier'
        value: V
        rest: R
      }
    : ParseRes extends 'identifierNameEmpty'
      ? 'identifierEmpty'
      : 'identifier-unhandled'
  : never

export type ParseIdentifier<
  T extends string,
  RestrictedChars extends string = IdentifierNameRestrictedSymbols,
> = T extends `#${infer Rest}`
  ? ParseIdentifierInternal<Rest, RestrictedChars>
  : ParseIdentifierInternal<T, RestrictedChars>

export type ParseWildcard<T extends string> = T extends `*${infer Rest}`
  ? { type: 'wildcard'; value: '*'; rest: Rest }
  : 'wildcardnope'

export type ParseAttrValueType<T extends string> =
  T extends `type(${infer Inner})${infer Rest}`
    ? Rest extends ''
      ? { type: 'type'; value: TrimSpaces<Inner> }
      : 'attrValueTypeErr-somethingAfterClosingParen'
    : 'attrValueTypeErr-doesntMatch'

export type Replace<
  T extends string,
  From extends string,
  To extends string,
> = T extends `${infer Before}${From}${infer After}`
  ? Replace<`${Before}${To}${After}`, From, To>
  : T

type ParseStringAttrValueRecurser<
  T extends string,
  Q extends '"' | "'",
> = T extends `${infer BeforeQuote}${Q}${infer Rest}`
  ? BeforeQuote extends `${string}\\`
    ? ParseStringAttrValueRecurser<Rest, Q> extends infer Res
      ? Res extends string
        ? // error - BeforeQuote ends with \\, so there is quote without pair
          'unterminatedString'
        : Res extends {
              res: infer ResRes
              rest: infer ResRest
            }
          ? ResRes extends string
            ? { res: `${BeforeQuote}${Q}${ResRes}`; rest: ResRest }
            : never
          : never
      : never
    : { res: BeforeQuote; rest: Rest }
  : 'no'

// prettier-ignore
export type testParseStringAttrValueRecurser = [
  Expect<Equal<
    ParseStringAttrValueRecurser<'aaa\\"bbb"ccc', '"'>,
    { res: 'aaa\\"bbb'; rest: 'ccc' }
  >>,
  Expect<Equal<
    ParseStringAttrValueRecurser<'aaa\\"bbb\\"ccc', '"'>,
    'unterminatedString'
  >>,
  Expect<Equal<
    ParseStringAttrValueRecurser<"aaa\\'bbb'ccc", "'">,
    { res: "aaa\\'bbb"; rest: 'ccc' }
  >>,
  Expect<Equal<
    ParseStringAttrValueRecurser<"aaa\\'bbb\\'ccc", "'">,
    'unterminatedString'
  >>,

  Expect<Equal<
    ParseStringAttrValueRecurser<'aaa', '"'>,
    'no'
  >>
]

type ParseStringAttrValueImpl<
  T extends string,
  Q extends '"' | "'",
> = ParseStringAttrValueRecurser<T, Q> extends infer Res
  ? Res extends string
    ? `stringParseErr-${Res}`
    : Res extends {
          res: infer ResRes
          rest: infer ResRest
        }
      ? ResRes extends string
        ? {
            type: 'literal'
            value: Replace<ResRes, `\\${Q}`, Q>
            rest: ResRest
          }
        : never
      : never
  : never

type ParseStringAttrValue<T extends string> = T extends `"${infer Rest}`
  ? ParseStringAttrValueImpl<Rest, '"'>
  : T extends `'${infer Rest}`
    ? ParseStringAttrValueImpl<Rest, "'">
    : 'stringParseErr-itDoesntStartWithQuotes'

// prettier-ignore
export type testParseStringAttrValue = [
  Expect<Equal<
    ParseStringAttrValue<'"aaa\\"bbb"ccc'>,
    { type: 'literal'; value: 'aaa"bbb'; rest: 'ccc' }
  >>,
  Expect<Equal<
    ParseStringAttrValue<"'aaa\\'bbb'ccc">,
    { type: 'literal'; value: "aaa'bbb"; rest: 'ccc' }
  >>,
 
  Expect<Equal<
    ParseStringAttrValue<'"aaa"bbb'>,
    { type: 'literal'; value: 'aaa'; rest: 'bbb' }
  >>,
  Expect<Equal<
    ParseStringAttrValue<'"aaa\\"bbb"'>,
    { type: 'literal'; value: 'aaa"bbb'; rest: '' }
  >>,
  Expect<Equal<
    ParseStringAttrValue<'"a]aa\\"b]bb"  ]'>,
    { type: 'literal'; value: 'a]aa"b]bb'; rest: '  ]' }
  >>,
  Expect<Equal<
    ParseStringAttrValue<'aaa\\"bbb'>,
    'stringParseErr-itDoesntStartWithQuotes'
  >>,
]

//  number
//    = a:([0-9]* ".")? b:[0-9]+ {
//      // Can use `a.flat().join('')` once supported
//      const leadingDecimals = a ? [].concat.apply([], a).join('') : '';
//      return { type: 'literal', value: parseFloat(leadingDecimals + b.join('')) };
//    }
// TODO: better numbers handling for cases like 010
export type ParseNumberAttrValue<T extends string> =
  T extends `${infer N extends number}`
    ? { type: 'literal'; value: N }
    : 'arrValueNumberErr'

//  path = i:identifierName { return { type: 'literal', value: i }; }
export type ParsePathAttrValue<T extends string> = ParseIdentifierName<
  T,
  IdentifierNameRestrictedSymbols
> extends infer Res
  ? Res extends string
    ? `pathParseErr-${Res}`
    : Res extends {
          value: infer ResValue
          rest: infer ResRest
        }
      ? ResRest extends ''
        ? { type: 'literal'; value: ResValue }
        : `pathParseErr-hasSomeRest`
      : never
  : never

//  type = "type(" _ t:[^ )]+ _ ")" { return { type: 'type', value: t.join('') }; }
//  matches one word inside parens
export type ParseTypeAttrValue<T extends string> =
  T extends `type(${infer Inner})${infer Rest}`
    ? Rest extends ''
      ? TrimSpaces<Inner> extends infer TrimmedInner
        ? TrimmedInner extends ''
          ? // type(  )
            'typeParseErr-emptyType'
          : { type: 'type'; value: TrimmedInner }
        : never
      : 'attrValueTypeErr-somethingAfterClosingParen'
    : 'attrValueTypeErr-doesntMatch'

// https://github.com/estools/esquery/blob/909bea6745d33d33870b5d2c3382b4561d00d923/grammar.pegjs#L88
type AllowedRegexAttrValueFlag = 'i' | 'm' | 's' | 'u'
export type ParseRegexAttrValueFlags<T extends string> = T extends ''
  ? 'regexEmptyFlags'
  : T extends `${infer First}${infer Rest}`
    ? First extends AllowedRegexAttrValueFlag
      ? Rest extends ''
        ? { acc: First; res: First; rest: '' }
        : ParseRegexAttrValueFlags<Rest> extends infer NestedRes
          ? NestedRes extends string
            ? NestedRes
            : NestedRes extends {
                  acc: infer NestedResAcc
                  res: infer NestedResRes
                  rest: infer NestedResRest
                }
              ? First extends NestedResAcc
                ? // duplicated flag
                  `regexDuplicatedFlag-${First}`
                : NestedResRes extends string
                  ? {
                      acc: First | NestedResAcc
                      res: `${First}${NestedResRes}`
                      rest: NestedResRest
                    }
                  : never
              : never
          : never
      : { acc: never; res: ''; rest: T }
    : never

export type bbb = ParseRegexAttrValueFlags<'msiu'>
//           ^?

// prettier-ignore
export type testParseRegexAttrValueFlags = [
  Expect<Equal<
    ParseRegexAttrValueFlags<'msiu'>,
    { acc: 'm' | 's' | 'i' | 'u'; res: 'msiu'; rest: '' }
  >>,
  Expect<Equal<
    ParseRegexAttrValueFlags<'ms ]'>,
    { acc: 'm' | 's'; res: 'ms'; rest: ' ]' }
  >>,
  Expect<Equal<
    ParseRegexAttrValueFlags<' ms ]'>,
    { acc: never; res: ''; rest: ' ms ]' }
  >>,
  Expect<Equal<
    ParseRegexAttrValueFlags<'mm ]'>,
    'regexDuplicatedFlag-m'
  >>,
  Expect<Equal<
    ParseRegexAttrValueFlags<''>,
    'regexEmptyFlags'
  >>,
]

export type ParseRegexAttrValueImpl<T extends string> =
  // inheritting this bug for better consistency
  // https://github.com/estools/esquery/issues/68
  T extends `/${infer Inner}/${infer Rest}`
    ? ParseRegexAttrValueFlags<Rest> extends infer ParsedFlags
      ? ParsedFlags extends string
        ? ParsedFlags extends 'regexEmptyFlags'
          ? {
              res: `/${Inner}/`
              rest: Rest
            }
          : `regexErrInFlags-${ParsedFlags}`
        : ParsedFlags extends {
              res: infer ParsedFlagsRes
              rest: infer ParsedFlagsRest
            }
          ? ParsedFlagsRes extends string
            ? {
                res: `/${Inner}/${ParsedFlagsRes}`
                rest: ParsedFlagsRest
              }
            : never
          : never
      : never
    : 'regexParseErr-doesntMatch'

//  regex = "/" d:[^/]+ "/" flgs:flags? { return {
//    type: 'regexp', value: new RegExp(d.join(''), flgs ? flgs.join('') : '') };
//  }
export type ParseRegexAttrValue<T extends string> =
  ParseRegexAttrValueImpl<T> extends infer Res
    ? Res extends string
      ? Res
      : Res extends {
            res: infer ResRes
            rest: infer Rest
          }
        ? {
            type: 'regexp'
            value: ResRes
            rest: Rest
          }
        : never
    : never

// prettier-ignore
export type testParseRegexAttrValue = [
  Expect<Equal<
    ParseRegexAttrValue<'/aa/'>,
    { type: 'regexp'; value: '/aa/'; rest: '' }
  >>,
  Expect<Equal<
    ParseRegexAttrValue<'/aa/aa'>,
    { type: 'regexp'; value: '/aa/'; rest: 'aa' }
  >>,
  Expect<Equal<
    ParseRegexAttrValue<'/aa/ms]'>,
    { type: 'regexp'; value: '/aa/ms'; rest: ']' }
  >>,
  Expect<Equal<
    ParseRegexAttrValue<'/a]a/ ] '>,
    { type: 'regexp'; value: '/a]a/'; rest: ' ] ' }
  >>,
  Expect<Equal<
    ParseRegexAttrValue<'/a]a/m ] '>,
    { type: 'regexp'; value: '/a]a/m'; rest: ' ] ' }
  >>,
  Expect<Equal<
    ParseRegexAttrValue<'/a]a/mm ] '>,
    'regexErrInFlags-regexDuplicatedFlag-m'
  >>,
]

type PostProcessAttrValueWithRest<V, Next> = V extends infer ParseRes
  ? ParseRes extends string
    ? Next
    : ParseRes extends {
          rest: infer Rest
        }
      ? Rest extends string
        ? TrimSpacesLeft<Rest> extends `]${infer RestRest}`
          ? {
              res: Simplify<Omit<ParseRes, 'rest'>>
              rest: RestRest
            }
          : 'attrParseErr-unterminatedAttrSquareBracket'
        : never
      : never
  : never

//   attrEqOps = a:"!"? "="  { return (a || '') + '='; }
//   !=, =
//   value(type / regex)
type ParseAttrValueForEqOps<AttrValue extends string> =
  PostProcessAttrValueWithRest<
    ParseRegexAttrValue<AttrValue>,
    // not a regex -> it may be type
    // but only regex can contain ']', so we can safely split AttrValue
    AttrValue extends `${infer FullAttrValue}]${infer Rest}`
      ? TrimSpaces<FullAttrValue> extends infer TrimmedFullAttrValue
        ? TrimmedFullAttrValue extends string
          ? ParseTypeAttrValue<TrimmedFullAttrValue> extends infer TypeParseRes
            ? TypeParseRes extends string
              ? 'parseAttrValueForEqOpsErr-doesntMatch'
              : {
                  res: TypeParseRes
                  rest: Rest
                }
            : never
          : never
        : never
      : 'parseAttrValueForOpsErr-unterminatedAttrSquareBracket'
  >

//   attrOps = a:[><!]? "=" { return (a || '') + '='; } / [><]
//   >=, <=, !=, =, >, <
//   value(string / number / path)
type ParseAttrValueForOps<AttrValue extends string> =
  PostProcessAttrValueWithRest<
    ParseStringAttrValue<AttrValue>,
    // not a string -> it may be number / path
    // but only strings can contain ']', so we can safely split AttrValue
    AttrValue extends `${infer FullAttrValue}]${infer Rest}`
      ? TrimSpaces<FullAttrValue> extends infer TrimmedFullAttrValue
        ? TrimmedFullAttrValue extends string
          ? ParseNumberAttrValue<TrimmedFullAttrValue> extends infer NumberParseRes
            ? NumberParseRes extends string
              ? // not a number
                ParsePathAttrValue<TrimmedFullAttrValue> extends infer PathParseRes
                ? PathParseRes extends string
                  ? 'parseAttrValueForOpsErr-doesntMatch'
                  : {
                      res: PathParseRes
                      rest: Rest
                    }
                : never
              : {
                  res: NumberParseRes
                  rest: Rest
                }
            : never
          : never
        : never
      : 'parseAttrValueForOpsErr-unterminatedAttrSquareBracket'
  >

// TODO: check if name starts with dot
type ParseAttrName<RawAttrName> = RawAttrName extends string
  ? ParseIdentifierName<
      TrimSpaces<RawAttrName>,
      IdentifierNameRestrictedSymbolsWithDot
    > extends infer AttrNameParseRes
    ? AttrNameParseRes extends string
      ? `genParseAttrResErr-${AttrNameParseRes}`
      : AttrNameParseRes extends {
            value: infer AttrNameParseResValue
            rest: infer AttrNameParseResRest
          }
        ? AttrNameParseResRest extends ''
          ? {
              type: 'attribute'
              name: AttrNameParseResValue
            }
          : 'genParseAttrResErr-wrongAttrName'
        : never
    : never
  : never

type GenParseAttrRes<
  RawAttrName,
  Op extends string,
  ParseRes,
> = ParseRes extends string
  ? `parseAttrErr-${ParseRes}`
  : ParseRes extends {
        res: infer ParseResRes
        rest: infer ParseResRest
      }
    ? ParseAttrName<RawAttrName> extends infer AttrNameParseRes
      ? AttrNameParseRes extends string
        ? `genParseAttrResErr-${AttrNameParseRes}`
        : Simplify<
            AttrNameParseRes & {
              operator: Op
              value: ParseResRes
              rest: ParseResRest
            }
          >
      : never
    : never

export type IfString<T, U> = T extends string ? U : T

type PartitionBy<
  Tuple extends [string, string][],
  CompareTo extends string,
  LeftAcc extends [string, string][] = [],
  RightAcc extends [string, string][] = [],
> = Tuple extends [infer First, ...infer Rest]
  ? Rest extends [string, string][]
    ? First extends [infer PairFirst, infer PairLast]
      ? PairFirst extends string
        ? PairLast extends string
          ? PairFirst extends `${CompareTo}${string}`
            ? PartitionBy<
                Rest,
                CompareTo,
                LeftAcc,
                [...RightAcc, [PairFirst, PairLast]]
              >
            : PartitionBy<
                Rest,
                CompareTo,
                [...LeftAcc, [PairFirst, PairLast]],
                RightAcc
              >
          : never
        : never
      : never
    : never
  : [LeftAcc, RightAcc]

type SortPairsByShortestTemplateLiteral<Pairs extends [string, string][]> =
  Pairs extends [infer Head, ...infer Tail]
    ? Tail extends [string, string][]
      ? Head extends [infer HeadFirst, infer _]
        ? HeadFirst extends string
          ? PartitionBy<Tail, HeadFirst> extends [infer Left, infer Right]
            ? Left extends [string, string][]
              ? Right extends [string, string][]
                ? [
                    ...SortPairsByShortestTemplateLiteral<Left>,
                    Head,
                    ...SortPairsByShortestTemplateLiteral<Right>,
                  ]
                : never
              : never
            : never
          : never
        : never
      : never
    : []

// prettier-ignore
export type testSortPairsByShortestTemplateLiteral = [
  Expect<Equal<
    SortPairsByShortestTemplateLiteral<[['123', '1'], ['1234', '2'], ['12', '3']]>,
    [['12','3'],['123','1'],['1234','2']]
  >>,
]

type TryToSplitBy<
  T,
  S extends string,
> = T extends `${infer Before}${S}${infer After}`
  ? [Before, `${S}${After}`]
  : false

type TryToSplitByAngleBracket<
  T,
  S extends '>' | '<',
> = T extends `${infer Before}${S}${infer After}`
  ? After extends `=${string}`
    ? [`${Before}${S}`, After]
    : [Before, `${S}${After}`]
  : false

type FilterTuple<T extends any[], Acc extends any[] = []> = T extends [
  infer First,
  ...infer Rest,
]
  ? First extends false
    ? FilterTuple<Rest, Acc>
    : FilterTuple<Rest, [...Acc, First]>
  : Acc
type SplitToClosingSquareBracketOrEqualSignOrAngleBracket<T extends string> =
  SortPairsByShortestTemplateLiteral<
    FilterTuple<
      [
        TryToSplitByAngleBracket<T, '>'>,
        TryToSplitByAngleBracket<T, '<'>,
        TryToSplitBy<T, '='>,
        TryToSplitBy<T, ']'>,
      ]
    >
  > extends [infer First, ...infer _]
    ? First
    : 'cant find splitter'

// prettier-ignore
export type testSplitToClosingSquareBracketOrEqualSignOrAngleBracket = [
  Expect<Equal<
    SplitToClosingSquareBracketOrEqualSignOrAngleBracket<'aa]bb'>,
    ['aa', ']bb']
  >>,
  Expect<Equal<
    SplitToClosingSquareBracketOrEqualSignOrAngleBracket<'aa][bb=1]'>,
    ['aa', '][bb=1]']
  >>,
  Expect<Equal<
    SplitToClosingSquareBracketOrEqualSignOrAngleBracket<'aa=1]bb'>,
    ['aa', '=1]bb']
  >>,
  Expect<Equal<
    SplitToClosingSquareBracketOrEqualSignOrAngleBracket<'aa=1][bb=1]'>,
    ['aa', '=1][bb=1]']
  >>,
  Expect<Equal<
    SplitToClosingSquareBracketOrEqualSignOrAngleBracket<'aa<1][bb=1]'>,
    ['aa', '<1][bb=1]']
  >>,
]

// example: AttrName='aa' _AfterAttrName='=4][bbb = 1]'
// example: AttrName='aa' _AfterAttrName='bbb'
type ParseAttrImpl<
  AttrName extends string,
  _AfterAttrName extends string,
> = _AfterAttrName extends `=${infer AfterAttrName}`
  ? // <=, >=, !=, =
    TrimSpacesLeft<AfterAttrName> extends infer TrimmedAfterAttrName
    ? TrimmedAfterAttrName extends string
      ? AttrName extends `${infer RawAttrName}<`
        ? // <=
          GenParseAttrRes<
            RawAttrName,
            '<=',
            ParseAttrValueForOps<TrimmedAfterAttrName>
          >
        : // >=
          AttrName extends `${infer RawAttrName}>`
          ? GenParseAttrRes<
              RawAttrName,
              '>=',
              ParseAttrValueForOps<TrimmedAfterAttrName>
            >
          : // TODO: try eqOps
            // !=
            AttrName extends `${infer RawAttrName}!`
            ? IfString<
                GenParseAttrRes<
                  RawAttrName,
                  '!=',
                  ParseAttrValueForOps<TrimmedAfterAttrName>
                >,
                GenParseAttrRes<
                  RawAttrName,
                  '!=',
                  ParseAttrValueForEqOps<TrimmedAfterAttrName>
                >
              >
            : // =
              IfString<
                GenParseAttrRes<
                  AttrName,
                  '=',
                  ParseAttrValueForOps<TrimmedAfterAttrName>
                >,
                GenParseAttrRes<
                  AttrName,
                  '=',
                  ParseAttrValueForEqOps<TrimmedAfterAttrName>
                >
              >
      : never
    : never
  : // <, >, without value, wrong
    _AfterAttrName extends `<${infer AfterAttrName}`
    ? // <
      TrimSpacesLeft<AfterAttrName> extends infer TrimmedAfterAttrName
      ? TrimmedAfterAttrName extends string
        ? GenParseAttrRes<
            AttrName,
            '<',
            ParseAttrValueForOps<TrimmedAfterAttrName>
          >
        : never
      : never
    : _AfterAttrName extends `>${infer AfterAttrName}`
      ? // <
        TrimSpacesLeft<AfterAttrName> extends infer TrimmedAfterAttrName
        ? TrimmedAfterAttrName extends string
          ? GenParseAttrRes<
              AttrName,
              '>',
              ParseAttrValueForOps<TrimmedAfterAttrName>
            >
          : never
        : never
      : _AfterAttrName extends `]${infer Rest}`
        ? ParseAttrName<AttrName> extends infer AttrNameParseRes
          ? AttrNameParseRes extends string
            ? `attrParseErr-${AttrNameParseRes}`
            : Simplify<AttrNameParseRes & { rest: Rest }>
          : never
        : 'attrParseErr-wrongAttr'

type ParseAttr<T extends string> = T extends `[${infer Rest}`
  ? SplitToClosingSquareBracketOrEqualSignOrAngleBracket<Rest> extends infer SplitRes
    ? SplitRes extends string
      ? `attrParseErr-split-${SplitRes}`
      : SplitRes extends [infer AttrName, infer AfterAttrName]
        ? AttrName extends string
          ? AfterAttrName extends string
            ? ParseAttrImpl<AttrName, AfterAttrName>
            : never
          : never
        : never
    : never
  : 'attrParseErr-cantFindOpeningSquareBracket'

export type ParseField<T extends string> = T extends `.${infer Rest}`
  ? ParseIdentifierName<
      Rest,
      IdentifierNameRestrictedSymbolsWithDot
    > extends infer IdentifierNameParseRes
    ? IdentifierNameParseRes extends 'identifierNameEmpty'
      ? 'fieldErr-identifierNameNope'
      : IdentifierNameParseRes extends {
            value: infer IdentifierNameParseResValue
            rest: infer IdentifierNameParseResRest
          }
        ? {
            type: 'field'
            name: IdentifierNameParseResValue
            rest: IdentifierNameParseResRest
          }
        : never
    : 'field stub'
  : 'field not starts with dot'

export type ParsePseudoClass<
  T extends string,
  PseudoClassName extends string,
> = T extends `:${PseudoClassName}(${infer Rest}`
  ? { type: PseudoClassName } & ParseSelectors<
      TrimSpaces<Rest>,
      [],
      EndOfSelectorsList.ClosingParen
    > extends infer SelectorsParseRes
    ? SelectorsParseRes
    : never
  : `is not ${PseudoClassName} pseudo class`

export type ParseNegation<T extends string> = ParsePseudoClass<T, 'not'>
export type ParseMatches<T extends string> = ParsePseudoClass<T, 'matches'>
export type ParseHas<T extends string> = ParsePseudoClass<T, 'has'>

export type ParseClass<T extends string> = T extends `:${infer Class}`
  ? ParseIdentifierName<
      Class,
      IdentifierNameRestrictedSymbols
    > extends infer IdentifierNameParseRes
    ? IdentifierNameParseRes extends 'identifierNameEmpty'
      ? 'classErr-identifierNameNope'
      : IdentifierNameParseRes extends {
            value: infer IdentifierNameParseResValue
            rest: infer IdentifierNameParseResRest
          }
        ? {
            type: 'class'
            name: IdentifierNameParseResValue
            rest: IdentifierNameParseResRest
          }
        : never
    : 'field stub'
  : 'not class'

export type ParseAtom<T extends string> =
  ParseWildcard<T> extends infer WildcardParseRes
    ? WildcardParseRes extends string
      ? ParseIdentifier<T> extends infer IdentifierParseRes
        ? IdentifierParseRes extends string
          ? ParseAttr<T> extends infer AttrParseRes
            ? AttrParseRes extends string
              ? ParseField<T> extends infer FieldParseRes
                ? FieldParseRes extends string
                  ? ParseNegation<T> extends infer NegationParseRes
                    ? NegationParseRes extends string
                      ? ParseMatches<T> extends infer MatchesParseRes
                        ? MatchesParseRes extends string
                          ? ParseHas<T> extends infer HasParseRes
                            ? HasParseRes extends string
                              ? ParseClass<T> extends infer ClassParseRes
                                ? ClassParseRes extends string
                                  ? 'super next Stub (unimplemented)'
                                  : ClassParseRes
                                : never
                              : HasParseRes
                            : never
                          : MatchesParseRes
                        : never
                      : NegationParseRes
                    : never
                  : FieldParseRes
                : never
              : AttrParseRes
            : never
          : IdentifierParseRes
        : never
      : WildcardParseRes
    : never

export type ParseSequence<
  T extends string,
  Acc extends unknown[] = [],
> = ParseAtom<T> extends infer AtomParseRes
  ? AtomParseRes extends string
    ? {
        selectors: Acc
        rest: T
      }
    : AtomParseRes extends {
          rest: infer Rest
        }
      ? Rest extends string
        ? ParseSequence<Rest, [...Acc, Simplify<Omit<AtomParseRes, 'rest'>>]>
        : never
      : never
  : never

export type TrimLeft<
  T extends string,
  R extends string,
> = T extends `${R}${infer Rest}` ? TrimLeft<Rest, R> : T
export type TrimRight<
  T extends string,
  R extends string,
> = T extends `${infer Rest}${R}` ? TrimRight<Rest, R> : T
export type Trim<
  T extends string,
  R extends string,
> = T extends `${R}${infer Rest}${R}`
  ? Trim<Rest, R>
  : T extends `${R}${infer Rest}`
    ? TrimLeft<Rest, R>
    : T extends `${infer Rest}${R}`
      ? TrimRight<Rest, R>
      : T

export type TrimSpacesLeft<T extends string> = TrimLeft<T, ' '>
export type TrimSpacesRight<T extends string> = TrimRight<T, ' '>
export type TrimSpaces<T extends string> = Trim<T, ' '>

export type ParseBinaryOp<T extends string> = TrimSpacesLeft<T> extends infer Op
  ? Op extends `>${infer Rest}`
    ? { op: 'child'; rest: Rest }
    : Op extends `~${infer Rest}`
      ? { op: 'sibling'; rest: Rest }
      : Op extends `+${infer Rest}`
        ? { op: 'adjacent'; rest: Rest }
        : T extends ` ${infer Rest}`
          ? { op: 'descendant'; rest: Rest }
          : 'unknownBinaryOp'
  : never

type SimplifySeq<S> = S extends {
  selectors: infer Selectors
}
  ? Selectors extends [infer First, ...infer Rest]
    ? Rest[0] extends undefined
      ? First
      : { type: 'compound'; selectors: [First, ...Rest] }
    : never
  : never

export type ParseSelectorRequrser<
  T extends string,
  Acc,
> = ParseBinaryOp<T> extends infer BinaryOpParseRes
  ? BinaryOpParseRes extends string
    ? // invalid binary op
      {
        error: `recursersequenceErr-atomParseFailed-${BinaryOpParseRes}`
        acc: Acc
        rest: T
      }
    : // valid binary op
      // op: >
      // rest: '   Identifier > Identifier'
      BinaryOpParseRes extends {
          op: infer Op
          rest: infer BinaryOpParseResRest
        }
      ? // just assertion
        BinaryOpParseResRest extends string
        ? ParseSequence<
            TrimSpaces<BinaryOpParseResRest>
          > extends infer SeqParseRes
          ? SeqParseRes extends string | never
            ? // wrong Seq
              {
                error: `recursersequenceErr-SeqParseFailed-${SeqParseRes}`
                acc: Acc
                rest: T
              }
            : // nice Seq/or seq before comma
              SeqParseRes extends {
                  selectors: infer Selectors
                  rest: infer Rest
                }
              ? Selectors extends [infer _, ...infer __]
                ? // selectors is not empty , let's continue
                  Rest extends ''
                  ? // Seq is last in selector
                    {
                      type: Op
                      left: Acc
                      right: SimplifySeq<SeqParseRes>
                    }
                  : // Seq is not last
                    Rest extends string
                    ? ParseSelectorRequrser<
                        Rest,
                        {
                          type: Op
                          left: Acc
                          right: SimplifySeq<SeqParseRes>
                        }
                      >
                    : never
                : // seq is closing the selectors chain
                  {
                    error: `recursersequenceErr-SeqParseFailed-${'todo'}`
                    acc: Acc
                    rest: BinaryOpParseResRest
                  }
              : 'here Stub'
          : never
        : never
      : never
  : never

export type ParseSelector<T extends string> =
  ParseSequence<T> extends infer SeqParseRes
    ? SeqParseRes extends string
      ? `sequenceErr-SeqParseFailed-${SeqParseRes}`
      : SeqParseRes extends {
            rest: infer Rest
          }
        ? // just assertion
          Rest extends string
          ? Rest extends ''
            ? // sequence of 1 elem
              // Program
              SimplifySeq<SeqParseRes>
            : // sequence of multiple elems
              // Program > Identifier
              ParseSelectorRequrser<Rest, SimplifySeq<SeqParseRes>>
          : never
        : never
    : never

export type _ParseSelectorsTrimCommaAtStart<T extends string> =
  TrimSpacesLeft<T> extends infer R
    ? R extends `,${infer Rest}`
      ? { res: TrimSpacesLeft<Rest> }
      : `commaErr-${T}`
    : never

enum EndOfSelectorsList {
  None,
  ClosingParen,
}

export type ParseSelectors<
  T extends string,
  Acc extends unknown[] = [],
  Eosl extends EndOfSelectorsList = EndOfSelectorsList.None,
> = ParseSelector<T> extends infer SelectorParseRes
  ? SelectorParseRes extends {
      error: unknown
      acc: infer SelectorAcc
      rest: infer Rest
    }
    ? Rest extends string
      ? _ParseSelectorsTrimCommaAtStart<Rest> extends infer RestWithoutComma
        ? RestWithoutComma extends string
          ? //todo here
            Eosl extends EndOfSelectorsList.None
            ? `${Rest}-nanoStub-${RestWithoutComma}`
            : Eosl extends EndOfSelectorsList.ClosingParen
              ? TrimSpacesLeft<Rest> extends infer R
                ? R extends `)${infer RestRest}`
                  ? { selectors: [...Acc, SelectorAcc]; rest: RestRest }
                  : `commaErr-${T}`
                : never
              : never
          : RestWithoutComma extends {
                res: infer RestWithoutCommaRes
              }
            ? RestWithoutCommaRes extends string
              ? ParseSelectors<RestWithoutCommaRes, [...Acc, SelectorAcc], Eosl>
              : never
            : never
        : never
      : never
    : SelectorParseRes extends {
          rest: infer Rest
        }
      ? {
          selectors: [...Acc, Simplify<Omit<SelectorParseRes, 'rest'>>]
          rest: Rest
        }
      : // all symbols consumed
        {
          selectors: [...Acc, Simplify<Omit<SelectorParseRes, 'rest'>>]
          rest: ''
        }
  : never

export type ParseIt<T extends string> = ParseSelectors<
  TrimSpaces<T>
> extends infer SelectorsParseRes
  ? SelectorsParseRes extends string
    ? SelectorsParseRes
    : SelectorsParseRes extends {
          selectors: infer Selectors
        }
      ? Selectors extends [infer First, ...infer Rest]
        ? Rest[0] extends undefined
          ? First
          : { type: 'matches'; selectors: [First, ...Rest] }
        : never
      : never
  : never
