export type Simplify<T> = { [KeyType in keyof T]: T[KeyType] } & {}

type IfEqual<X, Y, Then, Else> = (<T>() => T extends X ? 1 : 2) extends <
  T,
>() => T extends Y ? 1 : 2
  ? Then
  : Else

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

export type ParseIdentifierName<
  T extends string,
  Restricted extends string,
  N extends string = '',
> = T extends ''
  ? N extends ''
    ? 'identifierNameEmpty'
    : {
        value: N
        rest: T
      }
  : T extends `${infer First}${infer Rest}`
    ? First extends Restricted
      ? N extends ''
        ? 'identifierNameEmpty'
        : {
            value: N
            rest: T
          }
      : ParseIdentifierName<Rest, Restricted, `${N}${First}`>
    : never

type _ParseIdentifierNameToIdentifierAdapter<
  T extends string,
  Restricted extends string,
> = ParseIdentifierName<T, Restricted> extends infer ParseRes
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
  Restricted extends string = IdentifierNameRestrictedSymbols,
> = T extends `#${infer Rest}`
  ? _ParseIdentifierNameToIdentifierAdapter<Rest, Restricted>
  : _ParseIdentifierNameToIdentifierAdapter<T, Restricted>

export type ParseWildcard<T extends string> = T extends `*${infer Rest}`
  ? { type: 'wildcard'; value: '*'; rest: Rest }
  : 'wildcardnope'

export type ParseAttrValueType<T extends string> =
  T extends `type(${infer Inner})${infer Rest}`
    ? Rest extends ''
      ? { type: 'type'; value: TrimS<Inner> }
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
        ? { type: 'regex'; value: R }
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

export type SplitFirst<
  T extends string,
  Splitter extends string,
> = T extends `${infer First}${Splitter}${infer Last}`
  ? [TrimS<First>, TrimS<Last>]
  : never

type ParseAttrWithEq<
  RawAttrName extends string,
  AttrValue extends string,
  Rest extends string,
> = RawAttrName extends `${infer AttrName}<`
  ? // branch for '<=' op
    ParseIdentifierName<
      TrimS<AttrName>,
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
        TrimS<AttrName>,
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
          TrimS<RawAttrName>,
          Exclude<IdentifierNameRestrictedSymbols, '.'>
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
  Exclude<IdentifierNameRestrictedSymbols, '.'>
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

// TODO: handle just '<' and '>'
export type ParseAttr<T extends string> = T extends `[${infer _V}]${infer Rest}`
  ? TrimS<_V> extends infer V
    ? V extends string
      ? V extends `${infer RawAttrName}=${infer AttrValue}`
        ? RawAttrName extends string
          ? AttrValue extends string
            ? ParseAttrWithEq<TrimS<RawAttrName>, TrimS<AttrValue>, Rest>
            : 'parseAttrErr-1-AttrValueIsNotString'
          : 'parseAttrErr-2-RawAttrNameIsNotString'
        : // V doesn't contain '=' sign
          V extends `${infer RawAttrName}<${infer AttrValue}`
          ? RawAttrName extends string
            ? AttrValue extends string
              ? ParseAttrWithStrictNotEq<
                  TrimS<RawAttrName>,
                  TrimS<AttrValue>,
                  '<',
                  Rest
                >
              : 'parseAttrErr-3-AttrValueIsNotString'
            : 'parseAttrErr-4-RawAttrNameIsNotString'
          : V extends `${infer RawAttrName}>${infer AttrValue}`
            ? RawAttrName extends string
              ? AttrValue extends string
                ? ParseAttrWithStrictNotEq<
                    TrimS<RawAttrName>,
                    TrimS<AttrValue>,
                    '>',
                    Rest
                  >
                : 'parseAttrErr-5-AttrValueIsNotString'
              : 'parseAttrErr-6-RawAttrNameIsNotString'
            : //  [name.path]
              ParseIdentifierName<
                  V,
                  Exclude<IdentifierNameRestrictedSymbols, '.'>
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
export declare const sellRes: ParseAttr<'[aaa.bbb.ccc]'>
//                    ^?
//                     {"type":"attribute","name":"aaa.bbb.ccc","operator":"<=","value":{"type":"literal","value":" string "}}

export declare const resn: ParseAttr<'[aaa]'>
//                    ^?

export type ParseAtom<T extends string> =
  ParseWildcard<T> extends infer WildcardParseRes
    ? WildcardParseRes extends string
      ? ParseIdentifier<T> extends infer IdentifierParseRes
        ? IdentifierParseRes extends string
          ? ParseAttr<T> extends infer AttrParseRes
            ? AttrParseRes extends string
              ? 'super next Stub'
              : AttrParseRes
            : never
          : IdentifierParseRes
        : never
      : WildcardParseRes
    : never

export declare const pAttr: ParseAttr<'[aa]'>
//                      ^?
export declare const pAtom: ParseAtom<'[name.path] , some rest'>
//                     ^?

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

export type TrimSLeft<T extends string> = TrimLeft<T, ' '>
export type TrimSRight<T extends string> = T extends `${infer Rest} `
  ? TrimSRight<Rest>
  : T
export type TrimS<T extends string> = T extends ` ${infer Rest} `
  ? TrimS<Rest>
  : T extends ` ${infer Rest}`
    ? TrimSLeft<Rest>
    : T extends `${infer Rest} `
      ? TrimSRight<Rest>
      : T

export type ParseBinaryOp<T extends string> = TrimSLeft<T> extends infer Op
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

// TODO: add support for compound sequences
// TODO: add support for subject indicator ('!')
export type ParseSelectorRequrser<
  T extends string,
  Memo,
> = ParseBinaryOp<T> extends infer BinaryOpParseRes
  ? BinaryOpParseRes extends string
    ? // invalid binary op
      {
        error: `recursersequenceErr-atomParseFailed-${BinaryOpParseRes}`
        memo: Memo
        rest: T
      }
    : // valid binary op
      // op: > ; rest: '   Identifier > Identifier'
      BinaryOpParseRes extends {
          op: infer Op
          rest: infer BinaryOpParseResRest
        }
      ? // just assertion
        BinaryOpParseResRest extends string
        ? ParseAtom<TrimS<BinaryOpParseResRest>> extends infer AtomParseRes
          ? AtomParseRes extends string | never
            ? // wrong atom
              {
                error: `recursersequenceErr-atomParseFailed-${AtomParseRes}`
                memo: Memo
                rest: T
              }
            : // nice atom
              AtomParseRes extends {
                  rest: infer Rest
                }
              ? Rest extends ''
                ? // atom is last in sequence
                  {
                    type: Op
                    left: Memo
                    right: Simplify<Omit<AtomParseRes, 'rest'>>
                  }
                : // atom is not last
                  Rest extends string
                  ? ParseSelectorRequrser<
                      Rest,
                      {
                        type: Op
                        left: Memo
                        right: Simplify<Omit<AtomParseRes, 'rest'>>
                      }
                    >
                  : 5
              : 'here Stub'
          : 1
        : 2
      : 3
  : 4

export type ParseSelector<T extends string> =
  ParseAtom<T> extends infer AtomParseRes
    ? AtomParseRes extends string
      ? `sequenceErr-atomParseFailed-${AtomParseRes}`
      : AtomParseRes extends {
            rest: infer Rest
          }
        ? // just assertion
          Rest extends string
          ? Rest extends ''
            ? // sequence of 1 elem
              // Program
              AtomParseRes
            : // sequence of multiple elems
              // Program > Identifier
              ParseSelectorRequrser<Rest, Simplify<Omit<AtomParseRes, 'rest'>>>
          : never
        : never
    : never

export declare const res: ParseAtom<', aa'>
//                    ^?

export type _ParseSelectorsTrimCommaAtStart<T extends string> =
  TrimSLeft<T> extends infer R
    ? R extends `,${infer Rest}`
      ? { res: TrimSLeft<Rest> }
      : 'commaErr'
    : never

// export type _ParseSelectorsRecurser<T extends string, SelMemo> =

export type ParseSelectors<
  T extends string,
  SelMemo extends unknown[] = [],
> = ParseSelector<T> extends infer SelectorParseRes
  ? SelectorParseRes extends {
      error: unknown
      memo: infer Memo
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
              ? ParseSelectors<RestWithoutCommaRes, [...SelMemo, Memo]>
              : never
            : never
        : never
      : never
    : SelectorParseRes extends {
          rest: infer Rest
        }
      ? {
          selectors: [...SelMemo, Simplify<Omit<SelectorParseRes, 'rest'>>]
          rest: Rest
        }
      : // all symbols consumed
        {
          selectors: [...SelMemo, Simplify<Omit<SelectorParseRes, 'rest'>>]
          rest: ''
        }
  : never

export declare const selsRes: ParseIt<'[aa]'>
//                    ^?

export type ParseIt<T extends string> = ParseSelectors<
  TrimS<T>
> extends infer Res
  ? Res extends string
    ? Res
    : Res extends {
          selectors: infer Selectors
        }
      ? Selectors extends [infer First, ...infer Rest]
        ? Rest[0] extends undefined
          ? First
          : { type: 'matches'; selectors: [First, ...Rest] }
        : never
      : never
  : never
