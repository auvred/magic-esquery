module.exports = (async () => {
  const { auvred } = await import('@auvred/eslint-config')
  return [
    ...(await auvred()),
    {
      rules: {
        'ts/no-explicit-any': 'off',
        'ts/consistent-type-definitions': 'off',
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
      ignores: ['tests/**/*.{test,generated-test}.ts'],
    },
  ]
})()
