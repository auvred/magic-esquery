import { auvred } from '@auvred/eslint-config'

export default (async () => {
  return [
    ...(await auvred()),
    {
      rules: {
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
  ]
})()
