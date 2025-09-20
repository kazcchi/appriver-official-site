import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        history: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',

        // Node.js globals (for potential server-side scripts)
        module: 'readonly',
        exports: 'writable',
        require: 'readonly',
        process: 'readonly',

        // Project specific globals
        songsData: 'readonly',
        searchSortConfig: 'readonly',
        getSongsArray: 'readonly',
        lyricsData: 'readonly',
      },
    },
    rules: {
      // Error prevention
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'no-console': 'off', // Allow console for debugging
      'no-debugger': 'error',

      // Code quality
      'prefer-const': 'error',
      'no-var': 'error',
      eqeqeq: ['error', 'always'],
      curly: ['error', 'multi-line'],

      // Style (minimal, let Prettier handle most)
      semi: ['error', 'always'],
      quotes: ['error', 'single', { avoidEscape: true }],
    },
    ignores: ['node_modules/**', '*.backup*', '*.min.js', '.vercel/**'],
  },
];
