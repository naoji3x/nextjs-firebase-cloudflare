import typescriptEslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import _import from 'eslint-plugin-import'
import jest from 'eslint-plugin-jest'

export default [
  {
    ignores: ['lib/**/*', 'generated/**/*', 'coverage/**/*']
  },
  {
    plugins: {
      '@typescript-eslint': typescriptEslint,
      import: _import,
      jest
    },

    languageOptions: {
      globals: {
        ...jest.environments.globals.globals
      },

      parser: tsParser,
      ecmaVersion: 2021,
      sourceType: 'module'
    },

    files: ['*.ts', '*.js'],

    rules: {
      'import/no-unresolved': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      'jest/consistent-test-it': [
        'error',
        {
          fn: 'it'
        }
      ],
      'jest/require-top-level-describe': ['error']
    },

    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json'
        }
      }
    }
  }
]
