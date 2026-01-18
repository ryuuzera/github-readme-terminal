import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Adicione a regra aqui para sobrescrever as anteriores
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unsafe-assignment": "off", // Opcional: permite atribuir any
      "@typescript-eslint/no-unsafe-member-access": "off" // Opcional: permite acessar membros de any
    }
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;