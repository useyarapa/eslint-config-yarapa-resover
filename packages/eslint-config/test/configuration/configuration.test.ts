import vitestPlugin from "@vitest/eslint-plugin";
import packageJsonPlugin from "eslint-plugin-package-json";
import { rules as perfectionistRules } from "eslint-plugin-perfectionist";
import * as jsoncParser from "jsonc-eslint-parser";
import { describe, expect, it } from "vitest";

import { TYPESCRIPT_TEST_FILES } from "../../src/configs/constants/index.js";
import { packageJson, vitest } from "../../src/configs/index.js";
import yarapa from "../../src/index.js";
import { required } from "../helpers/index.js";
import { findRule } from "./configuration.helper.js";

describe("canonical public configuration", () => {
  it("exports a non-empty Flat Config array", () => {
    expect(Array.isArray(yarapa)).toBe(true);
    expect(yarapa.length).toBeGreaterThan(0);
  });

  it("uses canonical capability names without preset tiers", () => {
    const presetName = ["recom", "mended"].join("");
    const tierNames = yarapa
      .map(config => config.name)
      .filter(name => name?.includes(presetName));

    expect(tierNames).toEqual([]);
  });

  it("owns base, comments, promise, regexp, and unused-imports policies", () => {
    const configNames = yarapa.map(config => config.name).filter(Boolean);

    expect(configNames).toContain("yarapa/base/core");
    expect(configNames).toContain("yarapa/base/linter-options");
    expect(configNames).toContain("yarapa/base/modern-js");
    expect(configNames).toContain("yarapa/eslint-comments");
    expect(configNames).toContain("yarapa/promise");
    expect(configNames).toContain("yarapa/regexp");
    expect(configNames).toContain("yarapa/unused-imports");
    expect(configNames).toContain("yarapa/typescript");
    expect(configNames).toContain("yarapa/type-checked");
    expect(configNames).toContain("yarapa/stylistic");
    expect(configNames).toContain("yarapa/unicorn");
    expect(configNames).toContain("yarapa/import-x");
    expect(configNames).toContain("yarapa/sonarjs");
    expect(configNames).toContain("yarapa/perfectionist");
    expect(configNames).toContain("yarapa/vitest");
  });

  it("enforces zero inline suppression policy via linterOptions", () => {
    const linterOptionsConfig = yarapa.find(
      config => config.name === "yarapa/base/linter-options",
    );

    expect(linterOptionsConfig?.linterOptions).toEqual({
      noInlineConfig: true,
      reportUnusedDisableDirectives: "error",
    });
  });

  it("registers @typescript-eslint plugin only in the typescript owner entry", () => {
    const configsWithTsPlugin = yarapa.filter(config =>
      Boolean(
        config.plugins && Reflect.has(config.plugins, "@typescript-eslint"),
      ),
    );

    expect(configsWithTsPlugin).toHaveLength(1);
    expect(configsWithTsPlugin[0]?.name).toBe("yarapa/typescript");
  });

  it("places typescript before type-checked in canonical composition", () => {
    const names = yarapa.map(config => config.name).filter(Boolean);
    const tsIndex = names.indexOf("yarapa/typescript");
    const typeCheckedIndex = names.indexOf("yarapa/type-checked");

    expect(tsIndex).toBeGreaterThanOrEqual(0);
    expect(typeCheckedIndex).toBeGreaterThan(tsIndex);
  });

  it("scopes type declaration restrictions to TypeScript test files", () => {
    const testFilesConfig = yarapa.find(
      config => config.name === "yarapa/typescript/test-files",
    );

    expect(testFilesConfig).toMatchObject({
      files: [
        "**/*.test.ts",
        "**/*.test.tsx",
        "**/*.test.mts",
        "**/*.test.cts",
      ],
      rules: {
        "no-restricted-syntax": [
          "error",
          {
            message: "Move type declarations to a sibling .type.ts file.",
            selector: "TSTypeAliasDeclaration, TSInterfaceDeclaration",
          },
          {
            message: "Move helper functions to a sibling .helper.ts file.",
            selector:
              "Program > FunctionDeclaration, Program > VariableDeclaration > VariableDeclarator[init.type='ArrowFunctionExpression'], Program > VariableDeclaration > VariableDeclarator[init.type='FunctionExpression']",
          },
        ],
      },
    });
  });

  it("owns the package manifest rule policy", () => {
    const config = required(packageJson[0], "package manifest config");

    expect(packageJson).toHaveLength(1);
    expect(config.files).toEqual(["**/package.json"]);
    expect(config.languageOptions?.parser).toBe(jsoncParser);
    expect(config.plugins?.["package-json"]).toBe(packageJsonPlugin);
    expect(Object.keys(config.rules ?? {})).toHaveLength(62);
    expect(new Set(Object.values(config.rules ?? {}))).toEqual(
      new Set(["error"]),
    );
  });

  it("enables every installed perfectionist rule", () => {
    const config = required(
      yarapa.find(entry => entry.name === "yarapa/perfectionist"),
      "perfectionist config",
    );
    const configuredRules = new Set(Object.keys(config.rules ?? {}));
    const availableRules = new Set(
      Object.keys(perfectionistRules ?? {}).map(
        ruleName => `perfectionist/${ruleName}`,
      ),
    );

    expect(configuredRules).toEqual(availableRules);
  });

  it("enables every installed vitest rule scoped to test files", () => {
    const config = required(
      yarapa.find(entry => entry.name === "yarapa/vitest"),
      "vitest config",
    );
    const configuredRules = new Set(Object.keys(config.rules ?? {}));
    const availableRules = new Set(
      Object.keys(vitestPlugin.rules ?? {}).map(
        ruleName => `vitest/${ruleName}`,
      ),
    );

    expect(configuredRules).toEqual(availableRules);
    expect(configuredRules.size).toBe(82);
    expect(config.files).toEqual(TYPESCRIPT_TEST_FILES);
  });

  it("owns the vitest rule policy", () => {
    const config = required(vitest[0], "vitest config");

    expect(vitest).toHaveLength(1);
    expect(config.files).toEqual(TYPESCRIPT_TEST_FILES);
    expect(config.plugins?.vitest).toBe(vitestPlugin);
    expect(Object.keys(config.rules ?? {})).toHaveLength(82);
  });

  it("owns import-x rule and settings policy", () => {
    const config = yarapa.find(c => c.name === "yarapa/import-x");
    expect(config).toBeDefined();
    expect(config?.rules?.["import-x/no-duplicates"]).toBe("error");
    expect(config?.settings?.["import-x/resolver"]).toEqual({
      typescript: true,
    });
  });

  it("includes Node runtime and browser globals in unified config", () => {
    const hasNodePlugin = yarapa.some(config =>
      Boolean(config.plugins && Reflect.has(config.plugins, "n")),
    );
    expect(hasNodePlugin).toBe(true);

    const hasBrowserGlobals = yarapa.some(config => {
      const configuredGlobals = config.languageOptions?.globals;

      return configuredGlobals
        ? Reflect.has(configuredGlobals, "window")
        : false;
    });
    expect(hasBrowserGlobals).toBe(true);
  });

  it("shares canonical handwriting across configuration", () => {
    for (const ruleName of [
      "@stylistic/semi",
      "@typescript-eslint/consistent-type-imports",
      "@typescript-eslint/default-param-last",
      "@typescript-eslint/dot-notation",
      "@typescript-eslint/no-array-constructor",
      "@typescript-eslint/no-floating-promises",
      "arrow-body-style",
      "curly",
      "eqeqeq",
      "import-x/no-duplicates",
      "no-object-constructor",
      "no-restricted-imports",
      "no-var",
      "object-shorthand",
      "prefer-const",
      "prefer-object-has-own",
      "prefer-object-spread",
      "prefer-rest-params",
      "prefer-spread",
      "prefer-template",
      "radix",
    ]) {
      const resolved = findRule(yarapa, ruleName);
      expect(resolved).toBeDefined();
    }
  });

  it("keeps modern JavaScript concerns on canonical owners", () => {
    expect(findRule(yarapa, "sonarjs/arguments-usage")).toBe("off");
    expect(findRule(yarapa, "sonarjs/array-constructor")).toBe("off");
    expect(findRule(yarapa, "sonarjs/arrow-function-convention")).toBe("off");
    expect(findRule(yarapa, "sonarjs/prefer-default-last")).toBe("off");
  });
});
