import js from "@eslint/js";
import tseslint from "typescript-eslint";
import nextConfig from "eslint-config-next";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      // Relaxed for prototype — warn but don't block
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-console": "warn",
      // Allow inline styles (kiosk pattern)
      "react/no-unknown-property": "off",
    },
  },
  {
    ignores: [".next/", "node_modules/", "public/"],
  },
];
