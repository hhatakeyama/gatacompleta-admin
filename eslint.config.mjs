import nextConfig from "eslint-config-next"
import prettierConfig from "eslint-config-prettier/flat"
import reactPlugin from "eslint-plugin-react"
import simpleImportSort from "eslint-plugin-simple-import-sort"

const eslintConfig = [
  // Plugins react, react-hooks e @next/next já vêm registrados pelo eslint-config-next
  ...nextConfig,
  prettierConfig,
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      // Equivalente ao antigo "plugin:react/recommended"
      ...reactPlugin.configs.flat.recommended.rules,

      // Regras básicas de JavaScript
      "no-console": "warn",
      "no-unused-vars": "warn",
      "no-undef": "error",
      "no-duplicate-imports": "error",
      "no-var": "error",
      "prefer-const": "error",
      eqeqeq: ["warn"],

      // Regras de formatação
      semi: ["error", "never"],
      quotes: ["error", "double"],
      indent: ["error", 2],
      "comma-dangle": ["error", "always-multiline"],
      "object-curly-spacing": ["error", "always"],
      "array-bracket-spacing": ["error", "never"],
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",

      // Regras específicas do React
      "react/no-unknown-property": "warn",
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-vars": "error",
      "react/jsx-no-undef": "error",
      "react/jsx-curly-spacing": ["error", "never"],
      "react/jsx-equals-spacing": ["error", "never"],
      "react/jsx-tag-spacing": ["error", { beforeSelfClosing: "always" }],

      // Regras de hooks
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      // Regras do React Compiler (eslint-plugin-react-hooks 7): como aviso até o código ser ajustado
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/purity": "warn",

      // Regras específicas do Next.js
      "@next/next/no-img-element": "warn",
      "@next/next/no-html-link-for-pages": "error",
    },
  },
]

export default eslintConfig
