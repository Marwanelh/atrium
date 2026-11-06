import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import { fileURLToPath } from "node:url";

const tsconfigRootDir = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        tsconfigRootDir,
        project: ["./tsconfig.app.json", "./tsconfig.node.json"],
      },
    },
    rules: {
      // React Compiler advisories. This app is not compiled with React
      // Compiler (the build does not include babel-plugin-react-compiler),
      // so these rules report forward-looking hints rather than correctness
      // failures. They stay visible as warnings so they can be triaged, but
      // they do not block the build. Type safety rules above remain errors.
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/purity": "warn",
      "react-hooks/preserve-manual-memoization": "warn",
      "react-hooks/refs": "warn",
      "react-hooks/immutability": "warn",
      // shadcn/ui-style modules intentionally export a component together with
      // its variant helper. This is an HMR-only concern in dev, not a bug.
      "react-refresh/only-export-components": "warn",
    },
  },
]);
