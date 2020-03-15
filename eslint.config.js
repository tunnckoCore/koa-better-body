const myConfig = {
  plugins: {
    unicorn: require('eslint-plugin-unicorn'),
  },
  rules: {
    ...require('eslint-config-airbnb').rules,
    'unicorn/no-process-exit': ['error'],
    'unicorn/consistent-function-scoping': 'off',
    'no-unused-vars': 'error',
    semi: 'error',
  },
};

module.exports = [
  // {
  //   files: 'packages/*/src/**/*.js',
  //   plugins: {
  //     unicorn: require('eslint-plugin-unicorn'),
  //     'custom-plugin': require('./custom-eslint-plugin'),
  //   },
  //   languageOptions: {
  //     // directly requiring the parser
  //     // parser: require('babel-eslint'),

  //     // or: through the loaded plugin
  //     parser: 'custom-plugin/eslint-esnext',
  //     ecmaVersion: 2020,
  //     sourceType: 'module',
  //   },
  //   rules: {
  //     ...require('eslint-config-airbnb').rules,
  //     'unicorn/no-process-exit': ['error'],
  //     'unicorn/consistent-function-scoping': 'off',
  //     semi: 'error',
  //   },
  // },
  // {
  //   files: '**/__tests__/**/*.{js,jsx}',
  //   plugins: {
  //     unicorn: require('eslint-plugin-unicorn'),
  //     'custom-plugin': require('./custom-eslint-plugin'),
  //     react: require('eslint-plugin-react'),
  //   },
  //   languageOptions: {
  //     // directly requiring the parser
  //     // parser: require('babel-eslint'),

  //     // or: through the loaded plugin
  //     parser: 'custom-plugin/eslint-esnext',
  //     ecmaVersion: 2020,
  //     sourceType: 'module',
  //   },
  //   rules: {
  //     ...require('eslint-config-airbnb').rules,
  //     'unicorn/no-process-exit': ['error'],
  //     'unicorn/consistent-function-scoping': 'off',
  //     semi: 'error',
  //     'react/jsx-uses-react': 'error',
  //     'global-require': 'error',
  //   },
  // },
  {
    name: 'loading-babel-eslint-parser-through-custom-plugin',
    plugins: {
      'custom-plugin': require('./custom-eslint-plugin'),
    },
  },

  // example using the custom loaded parser
  {
    name: 'use-parser-from-custom-plugin',
    plugins: {
      baw: require('eslint-plugin-import'),
    },
    languageOptions: {
      globals: {
        qwqwqw: true,
      },
      // directly requiring the parser
      // parser: require('babel-eslint'),

      // or: through the loaded plugin
      parser: 'custom-plugin/eslint-esnext',
    },
  },
  {
    name: 'lint-sources',
    files: 'packages/*/src/**/*.js',
    ...myConfig,
  },
  {
    name: 'lang-options',
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'commonjs',
    },
  },
  {
    name: 'lint-tests',
    files: '**/__tests__/**/*.{js,jsx}',
    ...myConfig,
    // {
    //   plugins: {
    //     react: require('eslint-plugin-react'),
    //   },
    //   rules: {
    //     'react/jsx-uses-react': 'error',
    //     'global-require': 'error',
    //   },
    // },
  },
];
