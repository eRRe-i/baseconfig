import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'
import prettier from 'eslint-plugin-prettier'
import importPlugin from 'eslint-plugin-import'
import unusedImports from 'eslint-plugin-unused-imports'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const compat = new FlatCompat()

export default [
  js.configs.recommended,
  {
    ignores: ['dist/**', 'node_modules/**', 'templates/**'],
  },
  {
    // Configuração para arquivos TypeScript
    files: ['**/*.ts'],
    ignores: ['dist/**', 'templates/**', 'public/**'],
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
    // Configuração para arquivos JavaScript compilados
    files: ['dist/**/*.js'],
    ignores: ['dist/**', 'templates/**'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        __dirname: 'readonly',
        process: true,
        console: true,
        require: true,
        module: true,
        exports: true,
      },
    },
    rules: {
      'no-undef': 'off', // Desabilita no-undef para arquivos compilados
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
      'import/order': 'off',
      'unused-imports/no-unused-imports': 'error',
    },
  },
  ...compat.extends('plugin:@typescript-eslint/recommended'),
  ...compat.extends('plugin:prettier/recommended'),
]
