import type { ParseRegexAttrValue, ParseRegexAttrValueFlags, ParseStringAttrValue, ParseStringAttrValueRecurser, SortPairsByShortestTemplateLiteral, SplitToClosingSquareBracketOrEqualSignOrAngleBracket } from "../../src/parser";
import type { Equal, Expect } from "../../src/utils";

export type TestParseStringAttrValueRecurser = [
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

export type TestParseStringAttrValue = [
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

export type TestParseRegexAttrValueFlags = [
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

export type TestParseRegexAttrValue = [
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

export type TestSortPairsByShortestTemplateLiteral = [
  Expect<Equal<
    SortPairsByShortestTemplateLiteral<[['123', '1'], ['1234', '2'], ['12', '3']]>,
    [['12','3'],['123','1'],['1234','2']]
  >>,
]

export type TestSplitToClosingSquareBracketOrEqualSignOrAngleBracket = [
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
