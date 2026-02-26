import globals from "globals";
import { defineConfig } from "eslint/config";
import stylisticJs from "@stylistic/eslint-plugin";

export default defineConfig([
    { 
      files: ["**/*.{js,cjs,mjs}"],
      languageOptions: {
        sourceType: "commonjs",
        globals: globals.node,
      },
      plugins: { 
        '@stylistic/js': stylisticJs,
      },
      rules: { 
        '@stylistic/js/indent': ['error', 2],
        '@stylistic/js/linebreak-style': ['error', 'unix'],
        eqeqeq: 'error',
        'no-trailing-spaces': 'error',
        'object-curly-spacing': ['error', 'always'],
        'arrow-spacing': ['error', { before: true, after: true }],
      }, 
    },
    { 
      ignores: ['dist/**','eslint.config.mjs'], 
    },
]);
