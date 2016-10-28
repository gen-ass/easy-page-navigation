const chai = require('chai');
const eslint = require('mocha-eslint');

describe('ESLint', function () {
    eslint([
        './src',
        './test'
    ]);
})