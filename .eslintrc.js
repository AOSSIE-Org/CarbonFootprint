module.exports = {
  extends: "eslint:recommended",
  rules: {
    "no-console": 0,
    "no-undef": 0,
    "no-unused-vars": 0,
    "no-debugger": 0
  },
  parserOptions: {
    ecmaVersion: 6
  },
  env: {
    browser: true
  }
};
