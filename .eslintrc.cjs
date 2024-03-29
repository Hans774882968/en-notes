module.exports = {
  env: {
    browser: true,
    es2021: true,
    // 不知道为什么在 overrides 里设置 jest: true 无效，在此设置就有效
    jest: true,
    node: true
  },
  extends: [
    'next/core-web-vitals',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime'
  ],
  overrides: [
    {
      env: {
        jest: true
      },
      files: [
        'test/**/*.spec.{j,t}s?(x)'
      ]
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: [
    'react',
    'sort-imports-es6-autofix',
    'sort-keys-fix'
  ],
  // http://eslint.cn/docs/rules/
  rules: {
    // 禁用行尾空格,
    'arrow-spacing': ['error', { 'after': true, 'before': true }],
    'comma-dangle': ['error', 'never'],
    'comma-spacing': 'error',
    'eol-last': 'error',
    // 使用2个空格
    indent: ['error', 2, { SwitchCase: 1 }],
    'key-spacing': 'error',
    // } else if() {
    'keyword-spacing': ['error', { before: true }],
    'no-console': 'off',
    'no-constant-condition': ['error', { checkLoops: false }],
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-empty': 'off',
    'no-trailing-spaces': 'error',
    'no-unused-vars': 'off',
    'object-curly-spacing': [
      2,
      'always',
      { arraysInObjects: true, objectsInObjects: true }
    ],

    'prefer-const': 'error',
    // 使用单引号
    quotes: ['error', 'single'],
    semi: 'error',
    'sort-imports-es6-autofix/sort-imports-es6': ['warn', {
      'ignoreCase': false,
      'ignoreMemberSort': false,
      'memberSyntaxSortOrder': ['none', 'all', 'multiple', 'single']
    }],
    'sort-keys-fix/sort-keys-fix': 'warn',
    'space-before-blocks': 'error',
    'space-infix-ops': ['error', { 'int32Hint': false }]
  }
};
