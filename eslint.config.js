module.exports = (async () => {
  const { auvred } = await import('@auvred/eslint-config')
  return [
    ...(await auvred({
      imports: {
        overrides: {
          'import/consistent-type-specifier-style': [
            'error',
            'prefer-top-level',
          ],
        },
      },
    })),
    {
      rules: {
        'ts/no-explicit-any': 'off',
        'unused-imports/no-unused-vars': [
          'error',
          {
            vars: 'all',
            varsIgnorePattern: '^_',
            args: 'after-used',
            argsIgnorePattern: '^_',
          },
        ],
      },
    },
    {
      ignores: ['tests/types/*.ts'],
    },
  ]
})()
