import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    ignores: ["tests/**", "**/*.test.js", "**/*.spec.js"], // Ignorar archivos de test
    languageOptions: {
      globals: globals.node, // ✅ entorno Node.js
      ecmaVersion: "latest",
      sourceType: "module",
    },
    extends: [js.configs.recommended], // ✅ usa la config de @eslint/js correctamente
    rules: {
      // 🚨 Seguridad
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",

      // 🧱 Buenas prácticas
      "eqeqeq": ["error", "always"],
      "no-unused-vars": "warn",
      "no-console": "warn",
      "curly": "error",
      "semi": ["error", "always"],
      "quotes": ["error", "double"],
      "indent": ["error", 2],
      "prefer-const": "warn",
      "no-var": "error",
    },
  },
]);
