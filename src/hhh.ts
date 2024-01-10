export type Simplify<T> = { [KeyType in keyof T]: T[KeyType] } & {}

type IdentifierNameRestrictedSymbols =
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

type AttrValueRestrictedSymbols = Exclude<IdentifierNameRestrictedSymbols, '.'>

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

// https://github.com/estools/esquery/blob/909bea6745d33d33870b5d2c3382b4561d00d923/grammar.pegjs#L88
type _AttrValueRegexFlags = 'i' | 'm' | 's' | 'u'
export type _ParseAttrValueRegexFlags<T extends string> = T extends ''
  ? 'regexEmptyFlags'
  : T extends `${infer First}${infer Rest}`
    ? First extends _AttrValueRegexFlags
      ? Rest extends ''
        ? { res: First }
        : _ParseAttrValueRegexFlags<Rest> extends infer NestedRes
          ? NestedRes extends string
            ? NestedRes
            : NestedRes extends {
                  res: infer NestedResRes
                }
              ? First extends NestedResRes
                ? // duplicated flag
                  `regexDuplicatedFlag-${First}`
                : { res: First | NestedResRes }
              : never
          : never
      : `regexUnknownFlag-${First}`
    : never

export type _ParseAttrValueRegex<T extends string> =
  T extends `/${infer _}/${infer PossiblyFlags}`
    ? PossiblyFlags extends ''
      ? { ok: 'yes' }
      : _ParseAttrValueRegexFlags<PossiblyFlags> extends infer ParsedFlags
        ? ParsedFlags extends string
          ? `regexErrInFlags-${ParsedFlags}`
          : ParsedFlags extends {
                res: infer ParsedFlagsRes
              }
            ? ParsedFlagsRes extends string
              ? //`${Inner}${PossiblyFlags}`
                { ok: 'yes' }
              : never
            : never
        : never
    : 'attrValueTypeErr-doesntMatch'
export type __ParseAttrValueRegex<T extends string> =
  _ParseAttrValueRegex<T> extends infer Res
    ? Res extends string
      ? Res
      : [T]
    : never
export type ParseAttrValueRegex<T extends string> =
  __ParseAttrValueRegex<T> extends infer Res
    ? Res extends string
      ? Res
      : Res extends [infer R]
        ? { type: 'regexp'; value: R }
        : never
    : never

export type Replace<
  T extends string,
  From extends string,
  To extends string,
> = T extends `${infer Before}${From}${infer After}`
  ? Replace<`${Before}${To}${After}`, From, To>
  : T

export type ParseAttrValueString<T extends string> =
  T extends `"${infer Inner}"`
    ? { type: 'literal'; value: Replace<Inner, '\\"', '"'> }
    : T extends `'${infer Inner}'`
      ? { type: 'literal'; value: Replace<Inner, "\\'", "'"> }
      : 'arrValueStringErr'

// TODO: better numbers handling
export type ParseAttrValueNumber<T extends string> = TrimLeft<
  T,
  '0'
> extends `${infer N extends number}`
  ? { type: 'literal'; value: N }
  : `arrValueNumberErr`

export declare const aqe: ParseAttrValueNumber<'10.4'>
//                    ^?

type Aaa<
  Name,
  Rest,
  Operator,
  AttrValue extends string,
> = ParseAttrValueString<AttrValue> extends infer AttrValueStringParseRes
  ? AttrValueStringParseRes extends string
    ? ParseAttrValueNumber<AttrValue> extends infer AttrValueNumberParseRes
      ? AttrValueNumberParseRes extends string
        ? ParseIdentifierName<
            AttrValue,
            IdentifierNameRestrictedSymbols
          > extends infer AttrValueIdNameParseRes
          ? AttrValueIdNameParseRes extends string
            ? `nope-${AttrValueIdNameParseRes}`
            : AttrValueIdNameParseRes extends {
                  value: infer AttrValueIdNameValueParseRes
                  rest: infer AttrValueIdNameRestParseRes
                }
              ? AttrValueIdNameRestParseRes extends ''
                ? {
                    type: 'attribute'
                    name: Name
                    operator: Operator
                    value: {
                      type: 'literal'
                      value: AttrValueIdNameValueParseRes
                    }
                    rest: Rest
                  }
                : 'unsupportedShit'
              : never
          : never
        : {
            type: 'attribute'
            name: Name
            operator: Operator
            value: AttrValueNumberParseRes
            rest: Rest
          }
      : never
    : {
        type: 'attribute'
        name: Name
        operator: Operator
        value: AttrValueStringParseRes
        rest: Rest
      }
  : never

type ParseAttrWithEq<
  RawAttrName extends string,
  AttrValue extends string,
  Rest extends string,
> = RawAttrName extends `${infer AttrName}<`
  ? // branch for '<=' op
    ParseIdentifierName<
      TrimSpaces<AttrName>,
      Exclude<IdentifierNameRestrictedSymbols, '.'>
    > extends infer IdentifierNameParseRes
    ? IdentifierNameParseRes extends 'identifierNameEmpty'
      ? 'attrNope-identifierNameNopeOnLessOrEqOp'
      : IdentifierNameParseRes extends {
            value: infer IdentifierNameParseResValue
            rest: infer IdentifierNameParseResRest
          }
        ? IdentifierNameParseResRest extends ''
          ? Aaa<IdentifierNameParseResValue, Rest, '<=', AttrValue>
          : 'attrNope-lessOrEqOpWrongIdentifierName'
        : never
    : 'attr Stub1'
  : RawAttrName extends `${infer AttrName}>`
    ? // branch for '>=' op
      ParseIdentifierName<
        TrimSpaces<AttrName>,
        Exclude<IdentifierNameRestrictedSymbols, '.'>
      > extends infer IdentifierNameParseRes
      ? IdentifierNameParseRes extends 'identifierNameEmpty'
        ? 'attrNope-identifierNameNopeOnGreaterOrEqOp'
        : IdentifierNameParseRes extends {
              value: infer IdentifierNameParseResValue
              rest: infer IdentifierNameParseResRest
            }
          ? IdentifierNameParseResRest extends ''
            ? Aaa<IdentifierNameParseResValue, Rest, '>=', AttrValue>
            : 'attrNope-greaterOrEqOpWrongIdentifierName'
          : never
      : 'attr Stub2'
    : // branch for '=' op
      ParseIdentifierName<
          TrimSpaces<RawAttrName>,
          AttrValueRestrictedSymbols
        > extends infer IdentifierNameParseRes
      ? IdentifierNameParseRes extends 'identifierNameEmpty'
        ? 'attrNope-identifierNameNopeOnEqOp'
        : IdentifierNameParseRes extends {
              value: infer IdentifierNameParseResValue
              rest: infer IdentifierNameParseResRest
            }
          ? IdentifierNameParseResRest extends ''
            ? ParseAttrValueType<AttrValue> extends infer AttrValueTypeParseRes
              ? AttrValueTypeParseRes extends string
                ? ParseAttrValueRegex<AttrValue> extends infer AttrValueRegexParseRes
                  ? AttrValueRegexParseRes extends string
                    ? Aaa<IdentifierNameParseResValue, Rest, '=', AttrValue>
                    : {
                        type: 'attribute'
                        name: IdentifierNameParseResValue
                        operator: '='
                        value: AttrValueRegexParseRes
                        rest: Rest
                      }
                  : never
                : {
                    type: 'attribute'
                    name: IdentifierNameParseResValue
                    operator: '='
                    value: AttrValueTypeParseRes
                    rest: Rest
                  }
              : never
            : 'attrNope-eqOpWrongIdentifierName'
          : never
      : 'attr Stub3'

type ParseAttrWithStrictNotEq<
  RawAttrName extends string,
  AttrValue extends string,
  Op extends string,
  Rest extends string,
> = ParseIdentifierName<
  RawAttrName,
  AttrValueRestrictedSymbols
> extends infer IdentifierNameParseRes
  ? IdentifierNameParseRes extends 'identifierNameEmpty'
    ? 'attrNope-identifierNameNopeOnLessOrEqOp'
    : IdentifierNameParseRes extends {
          value: infer IdentifierNameParseResValue
          rest: infer IdentifierNameParseResRest
        }
      ? IdentifierNameParseResRest extends ''
        ? Aaa<IdentifierNameParseResValue, Rest, Op, AttrValue>
        : `attrNope-${Op}-OpWrongIdentifierName`
      : never
  : 'attr Stub 999'

export type ParseAttr<T extends string> =
  T extends `[${infer InnerRaw}]${infer Rest}`
    ? TrimSpaces<InnerRaw> extends infer Inner
      ? Inner extends string
        ? Inner extends `${infer AttrName}=${infer AttrValue}`
          ? AttrName extends string
            ? AttrValue extends string
              ? ParseAttrWithEq<
                  TrimSpaces<AttrName>,
                  TrimSpaces<AttrValue>,
                  Rest
                >
              : 'parseAttrErr-1-AttrValueIsNotString'
            : 'parseAttrErr-2-RawAttrNameIsNotString'
          : // Inner doesn't contain '=' sign
            Inner extends `${infer AttrName}<${infer AttrValue}`
            ? AttrName extends string
              ? AttrValue extends string
                ? ParseAttrWithStrictNotEq<
                    TrimSpaces<AttrName>,
                    TrimSpaces<AttrValue>,
                    '<',
                    Rest
                  >
                : 'parseAttrErr-3-AttrValueIsNotString'
              : 'parseAttrErr-4-RawAttrNameIsNotString'
            : Inner extends `${infer AttrName}>${infer AttrValue}`
              ? AttrName extends string
                ? AttrValue extends string
                  ? ParseAttrWithStrictNotEq<
                      TrimSpaces<AttrName>,
                      TrimSpaces<AttrValue>,
                      '>',
                      Rest
                    >
                  : 'parseAttrErr-5-AttrValueIsNotString'
                : 'parseAttrErr-6-RawAttrNameIsNotString'
              : //  [name.path]
                ParseIdentifierName<
                    Inner,
                    AttrValueRestrictedSymbols
                  > extends infer IdentifierNameParseRes
                ? IdentifierNameParseRes extends 'identifierNameEmpty'
                  ? // []
                    'attrNope-identifierNameNopeWithoutOp'
                  : // [something]
                    IdentifierNameParseRes extends {
                        value: infer IdentifierNameParseResValue
                        rest: infer IdentifierNameParseResRest
                      }
                    ? IdentifierNameParseResRest extends ''
                      ? // [nice.attr.without.op]
                        {
                          type: 'attribute'
                          name: IdentifierNameParseResValue
                          rest: Rest
                        }
                      : // [something+wrong]
                        'attrNope-withoutOpWrongIdentifierName'
                    : never
                : 'attr Stub4'
        : 'attrNope-squareBrackets'
      : never
    : 'attrNope-doesnthaveSquareBrackets'

export type ParseAtom<T extends string> =
  ParseWildcard<T> extends infer WildcardParseRes
    ? WildcardParseRes extends string
      ? ParseIdentifier<T> extends infer IdentifierParseRes
        ? IdentifierParseRes extends string
          ? ParseAttr<T> extends infer AttrParseRes
            ? AttrParseRes extends string
              ? 'super next Stub (unimplemented)'
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
      : `commaErr`
    : never

export type ParseSelectors<
  T extends string,
  Acc extends unknown[] = [],
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
            'nanoStub'
          : RestWithoutComma extends {
                res: infer RestWithoutCommaRes
              }
            ? RestWithoutCommaRes extends string
              ? ParseSelectors<RestWithoutCommaRes, [...Acc, SelectorAcc]>
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
