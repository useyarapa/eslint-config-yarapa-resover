import vitestPlugin from "@vitest/eslint-plugin";
import globals from "globals";
import { describe, expect, it } from "vitest";

import {
  INDEX_FILES,
  PLAIN_JAVASCRIPT_FILES,
  REACT_FILES,
  TYPESCRIPT_COLOCATION_IGNORES,
  TYPESCRIPT_FILES,
  TYPESCRIPT_TEST_FILES,
} from "../../src/configs/constants/index.js";
import yarapa from "../../src/index.js";
import { required } from "../helpers/index.js";
import { CONFIG_NAMES } from "./configuration.helper.js";

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
    expect(configNames).toContain(CONFIG_NAMES.baseLinterOptions);
    expect(configNames).toContain(CONFIG_NAMES.baseModernJs);
    expect(configNames).toContain("yarapa/eslint-comments");
    expect(configNames).toContain("yarapa/promise");
    expect(configNames).toContain("yarapa/regexp");
    expect(configNames).toContain("yarapa/unused-imports");
    expect(configNames).toContain(CONFIG_NAMES.typescript);
    expect(configNames).toContain(CONFIG_NAMES.typeChecked);
    expect(configNames).toContain(CONFIG_NAMES.stylistic);
    expect(configNames).toContain(CONFIG_NAMES.unicorn);
    expect(configNames).toContain("yarapa/import-x");
    expect(configNames).toContain(CONFIG_NAMES.sonarjs);
    expect(configNames).toContain("yarapa/perfectionist");
    expect(configNames).toContain(CONFIG_NAMES.vitest);
  });

  it("enforces zero inline suppression policy via linterOptions", () => {
    const linterOptionsConfig = yarapa.find(
      config => config.name === CONFIG_NAMES.baseLinterOptions,
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
    expect(configsWithTsPlugin[0]?.name).toBe(CONFIG_NAMES.typescript);
  });

  it("places typescript before type-checked in canonical composition", () => {
    const names = yarapa.map(config => config.name).filter(Boolean);
    const tsIndex = names.indexOf(CONFIG_NAMES.typescript);
    const typeCheckedIndex = names.indexOf(CONFIG_NAMES.typeChecked);

    expect(tsIndex).toBeGreaterThanOrEqual(0);
    expect(typeCheckedIndex).toBeGreaterThan(tsIndex);
  });

  it("scopes type declaration restrictions to TypeScript test files", () => {
    const testFilesConfig = yarapa.find(
      config => config.name === "yarapa/typescript/test-files",
    );

    expect(testFilesConfig).toMatchObject({
      files: TYPESCRIPT_TEST_FILES,
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

  it("enables every installed vitest rule scoped to test files", () => {
    const config = required(
      yarapa.find(entry => entry.name === CONFIG_NAMES.vitest),
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
    const config = required(
      yarapa.find(entry => entry.name === CONFIG_NAMES.vitest),
      "vitest config",
    );

    expect(config.plugins?.vitest).toBe(vitestPlugin);
    expect(Object.keys(config.rules ?? {})).toHaveLength(82);
  });

  it("provides ECMAScript builtin globals through unicorn config", () => {
    const unicornConfig = yarapa.find(
      config => config.name === CONFIG_NAMES.unicorn,
    );

    expect(unicornConfig?.languageOptions?.globals).toEqual(globals.builtin);
  });

  it("preserves framework names without disabling abbreviation policy", () => {
    const unicornConfig = required(
      yarapa.find(config => config.name === CONFIG_NAMES.unicorn),
      "unicorn config",
    );

    const reactConfig = required(
      yarapa.find(config => config.name === "yarapa/unicorn/react"),
      "unicorn React config",
    );

    expect(unicornConfig.rules?.["unicorn/prevent-abbreviations"]).toEqual([
      "error",
      {
        allowList: {
          generateStaticParams: true,
          Props: true,
          req: true,
          res: true,
        },
      },
    ]);

    expect(reactConfig).toMatchObject({
      files: REACT_FILES,
      rules: {
        "unicorn/prevent-abbreviations": [
          "error",
          {
            replacements: {
              param: false,
              params: false,
              prev: false,
              prop: false,
              props: false,
              ref: false,
              refs: false,
            },
          },
        ],
      },
    });
  });

  it("enforces barrel-files and plain javascript restrictions", () => {
    const barrelConfig = required(
      yarapa.find(config => config.name === "yarapa/typescript/barrel-files"),
      "barrel files config",
    );

    expect(barrelConfig.files).toEqual(INDEX_FILES);
    expect(barrelConfig.rules?.["no-restricted-syntax"]).toBeDefined();

    const plainJsConfig = required(
      yarapa.find(config => config.name === "yarapa/typescript/no-plain-js"),
      "no plain js config",
    );

    expect(plainJsConfig.files).toEqual(PLAIN_JAVASCRIPT_FILES);
    expect(plainJsConfig.ignores).toEqual(["**/fixtures/**"]);
    expect(plainJsConfig.rules?.["no-restricted-syntax"]).toBeDefined();
  });

  it("enforces feature-colocation restrictions on implementation files", () => {
    const colocationConfig = required(
      yarapa.find(config => config.name === "yarapa/typescript/colocation"),
      "typescript colocation config",
    );

    expect(colocationConfig.files).toEqual(TYPESCRIPT_FILES);
    expect(colocationConfig.ignores).toEqual(TYPESCRIPT_COLOCATION_IGNORES);
    expect(colocationConfig.rules?.["no-restricted-syntax"]).toBeDefined();
  });
});
