import yarapa from "@yarapa/eslint-config";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig(
  globalIgnores(
    [
      ".claude/**",
      ".turbo/**",
      "packages/eslint-config/dist/**",
      "packages/eslint-config/fixtures/**",
    ],
    "yarapa/repository/artifacts-and-fixtures",
  ),
  yarapa,
  {
    files: ["packages/eslint-config/**/*.ts"],
    name: "yarapa/repository/typescript-emit-resolution",
    rules: {
      "n/no-missing-import": [
        "error",
        {
          typescriptExtensionMap: [[".ts", ".js"]],
        },
      ],
    },
  },
  {
    files: [
      "packages/eslint-config/scripts/verify-tarball/**/*.{ts,mts}",
      "packages/eslint-config/test/behavior.test.ts",
      "packages/eslint-config/test/public-api.test.ts",
    ],
    name: "yarapa/repository/verified-file-io",
    rules: {
      "security/detect-non-literal-fs-filename": "off",
    },
  },
);
