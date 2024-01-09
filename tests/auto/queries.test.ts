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

export const queries = [
  'Program',
  '*',
  ...genVariants(
    spaces,
    'Program',
    spaces,
    ['', ','],
    spaces,
    'CallExpression',
    spaces,
  ),
  ...genVariants(
    spaces,
    '[',
    spaces,
    ['aaa', 'aaa.bbb.ccc'],
    spaces,
    [
      '',
      [['=', '>', '<', '>=', '<='], spaces, ['a', '10.4', '" string "']],
      ['=', spaces, 'type(number)'],
    ],
    spaces,
    ']',
    spaces,
  ),
  // '[aaa]',
  // '[aaa.bbb]',
  // '[aaa.bbb.ccc]',
  // '[aaa=1]',
  // '[aaa.bbb=1]',
  // '[aaa.bbb.ccc=1]',
  // 'CallExpression[aaa]',
  // 'CallExpression[aaa.bbb]',
  // 'CallExpression[aaa.bbb.ccc]',
]
