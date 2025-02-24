import { fileURLToPath } from 'url'
import { dirname } from 'path'

import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'
import prettier from 'eslint-plugin-prettier'
import importPlugin from 'eslint-plugin-import'
import unusedImports from 'eslint-plugin-unused-imports'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat()

export default [
  js.configs.recommended,
  {
    // Configuração para arquivos TypeScript
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        __dirname: 'readonly',
        process: 'readonly',
        console: 'readonly',
        fs: 'readonly',
        path: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      prettier,
      import: importPlugin,
      'unused-imports': unusedImports,
    },
    rules: {
      'prettier/prettier': 'error',
      'no-console': 'warn',
      'no-undef': 'off',
      'import/order': 'off',
      'unused-imports/no-unused-imports': 'error',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
  {
    // Configuração para arquivos JavaScript
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        __dirname: 'readonly',
        process: 'readonly',
        console: 'readonly',
        fs: 'readonly',
        path: 'readonly',
      },
    },
    plugins: {
      prettier,
      import: importPlugin,
      'unused-imports': unusedImports,
    },
    rules: {
      'prettier/prettier': 'error',
      'no-console': 'warn',
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
        },
      ],
      'unused-imports/no-unused-imports': 'error',
    },
    ignores: ['eslint.config.js', 'commitlint.config.js'],
  },
  ...compat.extends('plugin:@typescript-eslint/recommended'),
  ...compat.extends('plugin:prettier/recommended'),
]
