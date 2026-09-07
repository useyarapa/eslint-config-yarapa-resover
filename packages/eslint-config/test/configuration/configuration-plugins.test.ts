import packageJsonPlugin from "eslint-plugin-package-json";
import { rules as perfectionistRules } from "eslint-plugin-perfectionist";
import * as jsoncParser from "jsonc-eslint-parser";
import { describe, expect, it } from "vitest";

import { packageJson } from "../../src/configs/index.js";
import yarapa from "../../src/index.js";
import { required } from "../helpers/index.js";
import { CONFIG_NAMES, findRule } from "./configuration.helper.js";

describe("package and plugin configuration composition", () => {
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

  it("enforces es-toolkit deep import and namespace import restrictions", () => {
    const baseModernConfig = required(
      yarapa.find(config => config.name === CONFIG_NAMES.baseModernJs),
      "base modern js config",
    );

    expect(baseModernConfig.rules?.["no-restricted-imports"]).toBeDefined();
    expect(baseModernConfig.rules?.["no-restricted-syntax"]).toBeDefined();
  });

  it("enforces duplicate string prevention in sonarjs config", () => {
    const sonarConfig = required(
      yarapa.find(config => config.name === CONFIG_NAMES.sonarjs),
      "sonarjs config",
    );

    expect(sonarConfig.rules?.["sonarjs/no-duplicate-string"]).toEqual([
      "error",
      { ignoreStrings: "application/json", threshold: 3 },
    ]);
  });

  it("enforces statement padding policy in stylistic config", () => {
    const stylisticConfig = required(
      yarapa.find(config => config.name === CONFIG_NAMES.stylistic),
      "stylistic config",
    );

    expect(
      stylisticConfig.rules?.["@stylistic/padding-line-between-statements"],
    ).toBeDefined();
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
      "@stylistic/padding-line-between-statements",
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

  it("keeps unused code concerns on unused-imports canonical owner", () => {
    expect(findRule(yarapa, "@typescript-eslint/no-unused-vars")).toBe("off");
    expect(findRule(yarapa, "no-unused-vars")).toBe("off");
    expect(findRule(yarapa, "unused-imports/no-unused-imports")).toBe("error");

    expect(findRule(yarapa, "unused-imports/no-unused-vars")).toEqual([
      "error",
      {
        args: "after-used",
        argsIgnorePattern: "^_",
        vars: "all",
        varsIgnorePattern: "^_",
      },
    ]);
  });
});
