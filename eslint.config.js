// ESLint flat config
const js = require('@eslint/js');
const tseslint = require('typescript-eslint');

module.exports = [
  { ignores: ['**/dist/**', '**/node_modules/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      'no-console': 'warn',
    },
  },
];
