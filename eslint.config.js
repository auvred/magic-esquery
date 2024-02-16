module.exports = (async () => {
  const { auvred, GLOB_JSTS_IN_MD } = await import('@auvred/eslint-config')
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
      files: [GLOB_JSTS_IN_MD],
      rules: {
        'unused-imports/no-unused-vars': 'off',
      },
    },
    {
      ignores: ['tests/**/*.{test,generated-test}.ts'],
    },
  ]
})()
