module.exports = {
  'env': {
    'browser': true,
    'es6': true
  },
  'extends': 'eslint:recommended',
  'parserOptions': {
    'sourceType': 'module'
  },
  'rules': {
    'indent': [
      'error',
      2
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'always'
    ],
    'eol-last': [
      'error',
      'always'
    ],
    'no-multiple-empty-lines': [
      'error',
      {
        'max': 2,
        'maxEOF': 1
      }
    ],
    'no-trailing-spaces': [
      'error'
    ],
    'no-console': [
      'warn'
    ],
    'quote-props': [
      'error',
      'as-needed',
      {
        keywords: false,
        unnecessary: true,
        numbers: false
      }
    ],
  },
  'globals': {
    angular: true,
    d3: true,
    Class: true,
    moment: true,
    describe: true,
    expect: true,
    it: true,
    beforeEach: true,
    inject: true
  }
};
