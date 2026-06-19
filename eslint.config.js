// ESLint flat config
const js = require('@eslint/js');
const tseslint = require('typescript-eslint');
const jsdoc = require('eslint-plugin-jsdoc');
const tsdoc = require('eslint-plugin-tsdoc');

module.exports = [
  { ignores: ['**/dist/**', '**/node_modules/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  // This flat config (and any *.cjs files) are CommonJS. Allow
  // require()/module.exports here without the TypeScript and no-undef rules,
  // which the shared recommended configs otherwise apply to every file.
  {
    files: ['**/*.cjs', 'eslint.config.js'],
    languageOptions: {
      globals: {
        require: 'readonly',
        module: 'writable',
        exports: 'writable',
        __dirname: 'readonly',
        __filename: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      'no-console': 'warn',
      // Honor the `_` prefix as "intentionally unused" for arguments, variables,
      // and caught errors. typescript-eslint's recommended config flags these by
      // default; opting the convention in keeps forward-looking parameters (e.g.
      // a not-yet-consumed `lang` hint) from tripping the rule, repo-wide,
      // including the docs sources the pre-commit hook lints.
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
  // Documentation enforcement for every package's public TypeScript API. These
  // doc comments are the source the docs site renders (TypeDoc; see
  // packages/docs/typedoc.json -> reference.md).
  // This mirrors PythonNative's ruff "D" (pydocstyle) rules: every public symbol
  // must carry a doc comment, and the comment must follow the spec the doc
  // generator consumes (TSDoc, the TypeScript analog of the Google convention).
  // Like ruff, presence and well-formedness are required, but per-parameter
  // tags aren't; prose summaries are fine. Test files are exempt, matching
  // pyproject's `"tests/**/*.py" = ["D"]` per-file ignore. Note: Svelte `.svelte`
  // single-file components aren't ESLint-parsed here, so their exports rely on
  // the doc comments authored in the component files themselves.
  {
    files: ['packages/*/src/**/*.{ts,tsx}'],
    ignores: ['packages/*/src/**/*.test.{ts,tsx}'],
    plugins: { jsdoc, tsdoc },
    settings: { jsdoc: { mode: 'typescript' } },
    rules: {
      // Require a doc comment on every exported declaration (the D101/D102/D103
      // analog). Only exported nodes are checked, so internal helpers and
      // re-export barrels stay boilerplate-free.
      'jsdoc/require-jsdoc': [
        'error',
        {
          enableFixer: false,
          require: {
            FunctionDeclaration: false,
            ClassDeclaration: false,
            MethodDefinition: false,
            ArrowFunctionExpression: false,
            FunctionExpression: false,
          },
          // One selector per exported declaration kind. Variable exports match
          // the `export` wrapper (so the rule finds a comment above the `export`
          // keyword rather than the `const`); the rest match the declaration
          // directly. Re-export barrels (`export { x } from './y'`) have no
          // inline declaration and so stay exempt.
          contexts: [
            'ExportNamedDeclaration > FunctionDeclaration',
            'ExportNamedDeclaration > ClassDeclaration',
            'ExportNamedDeclaration > TSInterfaceDeclaration',
            'ExportNamedDeclaration > TSTypeAliasDeclaration',
            'ExportNamedDeclaration > TSEnumDeclaration',
            'ExportNamedDeclaration[declaration.type="VariableDeclaration"]',
          ],
        },
      ],
      // The doc comment can't be empty (the D419/D403 analog).
      'jsdoc/require-description': ['error', { contexts: ['any'] }],
      'jsdoc/no-blank-blocks': 'warn',
      // Keep comments valid TSDoc so they render correctly in TypeDoc.
      'tsdoc/syntax': 'warn',
    },
  },
];
