import js from "@eslint/js"
import ts from "@typescript-eslint/parser"
import { defineConfig, globalIgnores } from "eslint/config"
import tseslint from "typescript-eslint"

export default defineConfig([
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: ts,
      parserOptions: {
        project: "./tsconfig.json",
        ecmaVersion: 2022,
        sourceType: "module",
      },
    },
    rules: {
      // ----- Basic TypeScript rules -----
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-explicit-any": "warn",

      // ----- Elysia‑specific niceties -----
      // Prefer using `set`/`cookie` helpers instead of raw `Response`
      "no-restricted-syntax": [
        "error",
        {
          selector: "MemberExpression[object.name='Response']",
          message: "Use Elysia `set` or `cookie` instead of raw Response.",
        },
      ],

      // Enforce async route handlers to return a Promise/AsyncGenerator
      "@typescript-eslint/require-await": "error",
    },
  },
  globalIgnores(["src/generated/**/*"]),
])
