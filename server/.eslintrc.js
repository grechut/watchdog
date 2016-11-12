module.exports = {
  "env": {
    "browser": false,
  },

  "rules": {
    // Comma dangle for functions doesn't work yet in Node.js
    'comma-dangle': ['error', {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'always-multiline',
      exports: 'always-multiline',
      functions: 'never',
    }],
  },
};
