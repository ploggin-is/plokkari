module.exports = require('@hugsmidjan/hxmstyle')({
  // Place your project-specific additions or overrides here
  // using standard ESLint config syntax...

  // extendsFirst: [], // extended BEFORE the hxmstyle rules
  // extends: [], // added after the hxmstyle rules
  env: {
    node: true,
    browser: true,
    es2020: true,
  },

  rules: {
    'react/react-in-jsx-scope': 'off', // Next.js takes care of this

    /* Project Goals: */

    /* Add these: */
    // 'react-hooks/exhaustive-deps': 'error', // to force devs to deal with those

    /* Remove these: */
    '@typescript-eslint/no-explicit-any': [
      'warn',
      { fixToUnknown: false, ignoreRestArgs: true },
    ],
    'no-throw-literal': 'warn',
    'destructure-depth/max-depth': ['warn', { object: { max: 1 } }],
  },
});
