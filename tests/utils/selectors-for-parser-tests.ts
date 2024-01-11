type GenVariantArgs = (string | GenVariantArgs)[]
function genVariants(...args: GenVariantArgs): string[] {
  let result: string[] = []
  for (const arg of args) {
    if (typeof arg === 'string') {
      if (result.length === 0) {
        result.push(arg)
        continue
      }

      for (const rIndex in result) {
        result[rIndex] += arg
      }

      continue
    }

    const afterResult: string[] = []
    for (const subArg of arg) {
      if (typeof subArg === 'string') {
        afterResult.push(
          ...(result.length > 0 ? result : ['']).map(r => r + subArg),
        )
        continue
      }

      const resp = genVariants(...subArg)
      afterResult.push(...genVariants(result, resp))
    }
    result = afterResult
  }
  return result
}

const spaces = ['', '   ']

export const selectors = (
  [
    ' *Mega.field:Class.anotherField:Aaa[attr=yes]Bbb:ccc:not(A):has(something):matches(one , of).ffiieelldd , and > even ~ sequence + of   selectors ',

    'Program',
    '#Program',
    '*',
    genVariants(
      spaces,
      'Program',
      spaces,
      ['', ','],
      spaces,
      'CallExpression',
      spaces,
    ),
    genVariants(
      '[ aaa = ',
      [
        ['type(', spaces, 'number', spaces, ')'],
        ['/', [' c]c ', '^aa bb$'], '/', ['', 'ms']],
        '10',
        '"str"',
        '"s\\"r"',
        "'str'",
        "'s\\'r'",
        '"s]r"',
        "'s]r'",
        'false',
      ],
      ' ] bbb',
    ),
    genVariants(
      spaces,
      '[',
      spaces,
      ['aaa', 'aaa.bbb.ccc'],
      spaces,
      [
        '',
        [['=', '!='], spaces, ['type(number)', '/^aaa bbb$/ims']],
        [['=', '!=', '>', '>='], spaces, ['a', '10.4', '" string "']],
      ],
      spaces,
      ']',
      spaces,
    ),
    genVariants(
      ['*', 'Program'],
      '>',
      'Aaa',
      '~',
      ['Bbb', '[aaa.bbb]'],
      '+',
      'Ccc',
      ' ',
      'Ddd',
    ),
    genVariants(
      spaces,
      '*',
      spaces,
      '>',
      spaces,
      'Aaa',
      spaces,
      '~',
      spaces,
      'Bbb',
      spaces,
      '+',
      spaces,
      'Ccc',
      spaces,
      ' ',
      spaces,
      'Ddd',
      spaces,
    ),

    genVariants(spaces, 'aa[bb]', spaces),
    genVariants(
      spaces,
      'aa[bb=cc]',
      spaces,
      '>',
      spaces,
      'Expression',
      spaces,
      ',',
      spaces,
      ['Expression', 'Expression[some.val=45]'],
      spaces,
      '~',
      spaces,
      'Identifier[computed=false][name="Name"]',
      spaces,
    ),

    genVariants(spaces, ['.aaa', '.aaa.bbb'], spaces),
    genVariants(
      spaces,
      ['.aaa', '.aaa.bbb'],
      spaces,
      ['Program', '.aaa', '.aaa.bbb'],
      spaces,
    ),
    genVariants(
      spaces,
      ['Program', '.aaa', '.aaa.bbb'],
      spaces,
      ['>', '~'],
      spaces,
      ['.aaa', '.aaa.bbb'],
      spaces,
    ),
    genVariants(
      spaces,
      ['Program', 'Program.ccc.ddd', '.aaa', '.aaa.bbb'],
      spaces,
      ['>', '~'],
      spaces,
      ['.aaa', '.aaa.bbb'],
      spaces,
    ),

    genVariants(
      'Program',
      spaces,
      ':not(',
      spaces,
      ['A > B', 'A , B', 'A[b] ~ B[a]'],
      spaces,
      ')',
      spaces,
      ['', '>'],
      spaces,
      ':matches(A > B)',
      spaces,
    ),

    genVariants(
      spaces,
      ':',
      ['not', 'matches', 'has'],
      '(',
      spaces,
      ['A > B', 'A , B', 'A[b] ~ B[a]'],
      spaces,
      ')',
      spaces,
    ),

    'Program:exit',
    genVariants(
      spaces,
      'Some:Clas',
      spaces,
      ':not(Aa > Bb:class)',
      ',',
      spaces,
      'Mega:Class:Class:Aaa',
      spaces,
    ),
  ] satisfies GenVariantArgs
).flat(Number.POSITIVE_INFINITY) as string[]
