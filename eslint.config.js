import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

/** @type {import('eslint').Linter.RulesRecord} */
const googleTsRules = {
  // var 禁止・const 優先
  'no-var': 'error',
  'prefer-const': 'error',

  // 厳格等値演算子（null 比較のみ == 許可）
  eqeqeq: ['error', 'always', { null: 'ignore' }],

  // 必ずブロック {}
  curly: ['error', 'all'],

  // for...in 禁止
  'no-restricted-syntax': [
    'error',
    { selector: 'ForInStatement', message: 'for...in は禁止。for...of か Object.entries() を使用' },
  ],

  // eval 禁止
  'no-eval': 'error',

  // any 禁止（recommended は warn のため error に昇格）
  '@typescript-eslint/no-explicit-any': 'error',

  // 自明な型アノテーション禁止
  '@typescript-eslint/no-inferrable-types': 'error',

  // 命名規則
  '@typescript-eslint/naming-convention': [
    'error',
    // デフォルト: lowerCamelCase
    { selector: 'default', format: ['camelCase'] },
    // 変数: lowerCamelCase / UPPER_CASE（定数）/ PascalCase（Reactコンポーネント）
    { selector: 'variable', format: ['camelCase', 'UPPER_CASE', 'PascalCase'] },
    // 関数: lowerCamelCase または PascalCase（Reactコンポーネント）
    { selector: 'function', format: ['camelCase', 'PascalCase'] },
    // import: lowerCamelCase または PascalCase（Reactコンポーネントのデフォルトimport）
    { selector: 'import', format: ['camelCase', 'PascalCase'] },
    // 関数パラメータ: lowerCamelCase（先頭アンダースコア禁止）
    { selector: 'parameter', format: ['camelCase'], leadingUnderscore: 'forbid' },
    // 型・クラス・インターフェース・enum: PascalCase
    { selector: 'typeLike', format: ['PascalCase'] },
    // enum メンバー: UPPER_CASE
    { selector: 'enumMember', format: ['UPPER_CASE'] },
    // オブジェクトプロパティはチェック対象外（URLパスなど動的キーを含む場合があるため）
    { selector: 'objectLiteralProperty', format: null },
  ],
}

export default defineConfig([
  globalIgnores(['**/dist', '**/drizzle']),
  {
    files: ['backend/**/*.ts'],
    extends: [js.configs.recommended, tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.node,
    },
    rules: googleTsRules,
  },
  {
    files: ['frontend/**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: googleTsRules,
  },
])
