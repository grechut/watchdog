module.exports = {
  "extends": "airbnb",

  "env": {
    "browser": true,
  },

  "rules": {
    "no-use-before-define": [2, "nofunc"],  // http://eslint.org/docs/rules/no-use-before-define

    "no-unused-expressions": [2, {
      "allowTernary": true,
    }],
    "no-unused-vars": [2, {
      "args": "after-used",
      "argsIgnorePattern": "^_",
    }],

    "no-underscore-dangle": 0,

    "no-console": "off",
    "func-names": "off",

    // React
    "react/jsx-no-bind": 0,                 // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-bind.md
    "react/forbid-prop-types": 0,
    "react/require-default-props": "off",
  },
};
