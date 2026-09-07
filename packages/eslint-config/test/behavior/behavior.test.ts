import path from "node:path";
import { describe, expect, it } from "vitest";

import yarapa from "../../src/index.js";
import { eslintForConfigs, packageRoot, required } from "../helpers/index.js";
import { messageSummary } from "./behavior.helper.js";

describe("shared YARAPA behavior", () => {
  const eslint = eslintForConfigs(yarapa);

  const javascriptFixture = path.resolve(
    packageRoot,
    "fixtures/projects/untyped/index.js",
  );

  const projectRoot = path.resolve(packageRoot, "fixtures/projects/typed");

  it("accepts a typed project source file", async () => {
    const [result] = await eslint.lintFiles(
      path.resolve(projectRoot, "src/valid.ts"),
    );

    const summary = messageSummary(required(result, "typed valid lint result"));

    expect(summary, JSON.stringify(summary, null, 2)).toEqual([]);
  });

  it("reports a floating promise with type information", async () => {
    const [result] = await eslint.lintFiles(
      path.resolve(projectRoot, "src/invalid.ts"),
    );

    const lintResult = required(result, "typed invalid lint result");

    expect(lintResult.messages.map(message => message.ruleId)).toContain(
      "@typescript-eslint/no-floating-promises",
    );
  });

  it("permits empty interfaces in declaration files but reports in source", async () => {
    const declarationSource = "export interface Marker {}\n";

    const [dtsResult] = await eslint.lintText(declarationSource, {
      filePath: path.resolve(projectRoot, "src/types.d.ts"),
    });

    const dtsLintResult = required(dtsResult, "declaration lint result");

    expect(dtsLintResult.messages.map(message => message.ruleId)).not.toContain(
      "@typescript-eslint/no-empty-object-type",
    );

    const source = "export interface Marker {}\n";

    const [tsResult] = await eslint.lintText(source, {
      filePath: path.resolve(projectRoot, "src/valid.ts"),
    });

    const tsLintResult = required(tsResult, "source lint result");

    expect(tsLintResult.messages.map(message => message.ruleId)).toContain(
      "@typescript-eslint/no-empty-object-type",
    );
  });

  it.each([
    {
      name: "type aliases",
      source: "export type Contract = { name: string };\n",
    },
    {
      name: "interfaces",
      source: "export interface Contract { name: string }\n",
    },
  ])("moves $name out of test files", async ({ source }) => {
    const [result] = await eslint.lintText(source, {
      filePath: path.resolve(
        packageRoot,
        "test/public-api/public-api.test.ts",
      ),
    });

    const lintResult = required(result, "test declaration lint result");

    const restrictedSyntax = lintResult.messages.find(
      message => message.ruleId === "no-restricted-syntax",
    );

    expect(restrictedSyntax?.message).toContain("sibling .type.ts file");
  });

  it("permits type declarations in sibling type files", async () => {
    const [result] = await eslint.lintText(
      "export type Contract = { name: string };\n",
      {
        filePath: path.resolve(
          packageRoot,
          "test/public-api/public-api.type.ts",
        ),
      },
    );

    const lintResult = required(result, "type file lint result");

    expect(lintResult.messages.map(message => message.ruleId)).not.toContain(
      "no-restricted-syntax",
    );
  });

  it("moves helper functions out of test files", async () => {
    const [result] = await eslint.lintText(
      "function helper(): boolean { return true; }\nvoid helper();\n",
      {
        filePath: path.resolve(
          packageRoot,
          "test/behavior/behavior.test.ts",
        ),
      },
    );

    const lintResult = required(result, "test helper lint result");

    const restrictedSyntax = lintResult.messages.find(
      message => message.ruleId === "no-restricted-syntax",
    );

    expect(restrictedSyntax?.message).toContain("sibling .helper.ts file");
  });

  it("permits helper functions in sibling helper files", async () => {
    const [result] = await eslint.lintText(
      "export function helper(): boolean { return true; }\n",
      {
        filePath: path.resolve(
          packageRoot,
          "test/behavior/behavior.helper.ts",
        ),
      },
    );

    const lintResult = required(result, "helper file lint result");

    expect(lintResult.messages.map(message => message.ruleId)).not.toContain(
      "no-restricted-syntax",
    );
  });

  it("rejects unused JavaScript variables", async () => {
    const [result] = await eslint.lintText("const unused = 1;\n", {
      filePath: javascriptFixture,
    });

    const lintResult = required(result, "unused variable lint result");

    expect(lintResult.messages.map(message => message.ruleId)).toContain(
      "unused-imports/no-unused-vars",
    );
  });

  it("rejects var in shared JavaScript handwriting", async () => {
    const [result] = await eslint.lintText(
      "export function increment(value) { var next = value + 1; return next; }\n",
      { filePath: javascriptFixture },
    );

    const lintResult = required(result, "var lint result");

    expect(lintResult.messages.map(message => message.ruleId)).toContain(
      "no-var",
    );
  });

  it("requires strict equality in shared JavaScript handwriting", async () => {
    const [result] = await eslint.lintText(
      "export const equivalent = (left, right) => left == right;\n",
      { filePath: javascriptFixture },
    );

    const lintResult = required(result, "equality lint result");

    expect(lintResult.messages.map(message => message.ruleId)).toContain(
      "eqeqeq",
    );
  });

  it("prefers literal constructors and dot property access", async () => {
    const source = [
      "export const build = value => {",
      "  const object = new Object();",
      "  const items = new Array(value, value);",
      "  object[\"value\"] = items[0];",
      "  return object;",
      "};",
      "",
    ].join("\n");

    const [result] = await eslint.lintText(source, {
      filePath: javascriptFixture,
    });

    const lintResult = required(result, "literal syntax lint result");
    const ruleIds = lintResult.messages.map(message => message.ruleId);

    expect(ruleIds).toContain("no-object-constructor");
    expect(ruleIds).toContain("no-array-constructor");
    expect(ruleIds).toContain("dot-notation");
  });

  it("prefers rest/spread and default parameters last", async () => {
    const source = [
      "export const call = (fallback = 0, action, args) =>",
      "  action.apply(undefined, args) ?? fallback;",
      "export function collect() { return Array.from(arguments); }",
      "",
    ].join("\n");

    const [result] = await eslint.lintText(source, {
      filePath: javascriptFixture,
    });

    const lintResult = required(result, "modern function lint result");
    const ruleIds = lintResult.messages.map(message => message.ruleId);

    expect(ruleIds).toContain("default-param-last");
    expect(ruleIds).toContain("prefer-spread");
    expect(ruleIds).toContain("prefer-rest-params");
  });

  it("requires braces, Object.hasOwn, and explicit parseInt radix", async () => {
    const source = [
      "export const parse = (object, key, value) => {",
      "  if (object) return Object.prototype.hasOwnProperty.call(object, key);",
      "  return parseInt(value);",
      "};",
      "",
    ].join("\n");

    const [result] = await eslint.lintText(source, {
      filePath: javascriptFixture,
    });

    const lintResult = required(result, "modern builtins lint result");
    const ruleIds = lintResult.messages.map(message => message.ruleId);

    expect(ruleIds).toContain("curly");
    expect(ruleIds).toContain("prefer-object-has-own");
    expect(ruleIds).toContain("radix");
  });

  it("reports hard-coded passwords through yarapa sonarjs policy", async () => {
    const [result] = await eslint.lintText(
      "const password = \"secret-value\";\n",
      { filePath: javascriptFixture },
    );

    const lintResult = required(result, "SonarJS behavior result");

    expect(lintResult.messages.map(message => message.ruleId)).toContain(
      "sonarjs/no-hardcoded-passwords",
    );
  });

  it("reports unresolved imports through yarapa import-x policy", async () => {
    const [result] = await eslint.lintText(
      "import missing from \"./does-not-exist.js\";\nexport { missing };\n",
      { filePath: path.resolve(packageRoot, "fixtures/import-resolution.js") },
    );

    const lintResult = required(result, "import-x behavior result");

    expect(lintResult.messages.map(message => message.ruleId)).toContain(
      "import-x/no-unresolved",
    );
  });

  it("reports node protocol violations through yarapa unicorn policy", async () => {
    const [result] = await eslint.lintText(
      "import fs from \"fs\";\nexport { fs };\n",
      { filePath: path.resolve(packageRoot, "fixtures/unicorn-sample.js") },
    );

    const lintResult = required(result, "unicorn behavior result");

    expect(lintResult.messages.map(message => message.ruleId)).toContain(
      "unicorn/prefer-node-protocol",
    );
  });

  it.each([
    "src/app/api/[id]/route.ts",
    "src/app/blog/[slug]/page.tsx",
    "src/cats.controller.ts",
    "src/component.tsx",
  ])("accepts framework names in %s", async filePath => {
    const [result] = await eslint.lintFiles(
      path.resolve(projectRoot, filePath),
    );

    const lintResult = required(result, "framework naming lint result");

    expect(lintResult.messages.map(message => message.ruleId)).not.toContain(
      "unicorn/prevent-abbreviations",
    );
  });

  it.each([
    {
      filePath: "src/valid.ts",
      source:
        "export function normalize(arg: unknown): unknown { return arg; }\n",
    },
    {
      filePath: "src/component.tsx",
      source:
        "export function Component(opts: unknown): unknown { return opts; }\n",
    },
  ])(
    "reports unrelated abbreviations in $filePath",
    async ({ filePath, source }) => {
      const [result] = await eslint.lintText(source, {
        filePath: path.resolve(projectRoot, filePath),
      });

      const lintResult = required(result, "abbreviation lint result");

      expect(lintResult.messages.map(message => message.ruleId)).toContain(
        "unicorn/prevent-abbreviations",
      );
    },
  );

  it("reports package manifest property order", async () => {
    const source = `${JSON.stringify(
      Object.fromEntries([
        ["version", "1.0.0"],
        ["name", "example"],
      ]),
    )}\n`;

    const [result] = await eslint.lintText(source, {
      filePath: path.resolve(packageRoot, "fixtures/package.json"),
    });

    const lintResult = required(result, "package manifest behavior result");

    expect(lintResult.messages.map(message => message.ruleId)).toContain(
      "package-json/order-properties",
    );
  });

  it("restricts alternative utility libraries in favor of es-toolkit", async () => {
    const [result] = await eslint.lintText(
      "import _ from \"lodash\";\nexport { _ };\n",
      { filePath: javascriptFixture },
    );

    const lintResult = required(result, "restricted imports behavior result");

    const restrictedMessage = lintResult.messages.find(
      message => message.ruleId === "no-restricted-imports",
    );

    expect(restrictedMessage).toBeDefined();
    expect(restrictedMessage?.message).toContain("es-toolkit");
  });

  it("rejects eslint-disable comments via noInlineConfig while validating comments policy", async () => {
    const [result] = await eslint.lintText(
      "/* eslint-disable no-var */\nvar x = 1;\n",
      { filePath: javascriptFixture },
    );

    const lintResult = required(result, "eslint-comments behavior result");

    expect(lintResult.messages.map(message => message.ruleId)).toContain(
      "@eslint-community/eslint-comments/require-description",
    );
    expect(lintResult.messages.map(message => message.ruleId)).toContain(
      "@eslint-community/eslint-comments/no-use",
    );
    expect(
      lintResult.messages.some(message =>
        message.message.includes("'noInlineConfig' setting"),
      ),
    ).toBe(true);
  });

  it.each([
    {
      expectedRule: "promise/catch-or-return",
      name: "unhandled promises",
      source: "export function wait() { Promise.resolve().then(() => 1); }\n",
    },
    {
      expectedRule: "regexp/no-dupe-characters-character-class",
      name: "duplicate characters in regular expression character classes",
      source: "export const pattern = /[aa]/;\n",
    },
    {
      expectedRule: "n/no-deprecated-api",
      name: "deprecated Node.js APIs",
      source:
        "import buffer from \"node:buffer\";\nexport const b = new buffer.Buffer(10);\n",
    },
    {
      expectedRule: "jsdoc/check-alignment",
      name: "misaligned JSDoc comment blocks",
      source: "/**\n* missing space\n */\nexport const documented = 1;\n",
    },
    {
      expectedRule: "perfectionist/sort-imports",
      name: "unsorted imports through perfectionist policy",
      source: "import z from \"z\";\nimport a from \"a\";\nexport { a, z };\n",
    },
    {
      expectedRule: "@stylistic/semi",
      name: "missing semicolons in shared stylistic handwriting",
      source: "export const value = 1\n",
    },
  ])(
    "reports $name in shared JavaScript handwriting",
    async ({ expectedRule, source }) => {
      const [result] = await eslint.lintText(source, {
        filePath: javascriptFixture,
      });

      const lintResult = required(result, "lint result");

      expect(lintResult.messages.map(message => message.ruleId)).toContain(
        expectedRule,
      );
    },
  );

  it("reports duplicate keys in JSON files", async () => {
    const source = "{\n  \"name\": \"one\",\n  \"name\": \"two\"\n}\n";

    const [result] = await eslint.lintText(source, {
      filePath: path.resolve(packageRoot, "fixtures/sample.json"),
    });

    const lintResult = required(result, "JSON behavior result");

    expect(lintResult.messages.map(message => message.ruleId)).toContain(
      "jsonc/no-dupe-keys",
    );
  });

  it(
    "reports focused test violations through yarapa vitest policy",
    async () => {
      const testSource = "describe.only(\"sample\", () => {});\n";

      const [result] = await eslint.lintText(testSource, {
        filePath: path.resolve(
          packageRoot,
          "test/behavior/behavior.test.ts",
        ),
      });

      const lintResult = required(result, "vitest behavior result");

      expect(lintResult.messages.map(message => message.ruleId)).toContain(
        "vitest/no-focused-tests",
      );
    },
  );

  it("reports ts-expect-error comments through ban-ts-comment policy", async () => {
    const [result] = await eslint.lintText(
      "// @ts-expect-error explanation of suppression\nexport const value = 1;\n",
      { filePath: path.resolve(projectRoot, "src/valid.ts") },
    );

    const lintResult = required(result, "ts-comment behavior result");

    expect(lintResult.messages.map(message => message.ruleId)).toContain(
      "@typescript-eslint/ban-ts-comment",
    );
  });

  it("reports implementation declarations in barrel index files", async () => {
    const [result] = await eslint.lintText(
      "export const helper = (): number => 42;\n",
      { filePath: path.resolve(projectRoot, "src/index.ts") },
    );

    const lintResult = required(result, "barrel index behavior result");

    const restrictedSyntax = lintResult.messages.find(
      message => message.ruleId === "no-restricted-syntax",
    );

    expect(restrictedSyntax?.message).toContain("Barrel index files");
  });

  it("accepts pure re-exports in barrel index files", async () => {
    const [result] = await eslint.lintText(
      "export { valid } from \"./valid.js\";\n",
      { filePath: path.resolve(projectRoot, "src/index.ts") },
    );

    const lintResult = required(result, "barrel index valid result");

    expect(lintResult.messages.map(message => message.ruleId)).not.toContain(
      "no-restricted-syntax",
    );
  });

  it("reports plain JavaScript files outside fixtures", async () => {
    const [result] = await eslint.lintText(
      "export const value = 1;\n",
      { filePath: path.resolve(projectRoot, "src/plain.js") },
    );

    const lintResult = required(result, "plain js behavior result");

    const restrictedSyntax = lintResult.messages.find(
      message => message.ruleId === "no-restricted-syntax",
    );

    expect(restrictedSyntax?.message).toContain("Plain JavaScript files");
  });

  it("reports emoji and pictographic symbols through unicorn string-content policy", async () => {
    const [result] = await eslint.lintText(
      "export const message = \"Hello \u{1F600}\";\n",
      { filePath: javascriptFixture },
    );

    const lintResult = required(result, "emoji behavior result");

    expect(lintResult.messages.map(message => message.ruleId)).toContain(
      "unicorn/string-content",
    );
  });

  it("reports inline comments and warning comments", async () => {
    const [result] = await eslint.lintText(
      "export const value = 1; // inline comment\n// TODO: fix later\n",
      { filePath: javascriptFixture },
    );

    const lintResult = required(result, "comment policy behavior result");
    const ruleIds = lintResult.messages.map(message => message.ruleId);

    expect(ruleIds).toContain("no-inline-comments");
    expect(ruleIds).toContain("no-warning-comments");
  });

  it.each([
    {
      name: "type declarations",
      source: "export type Contract = { name: string };\n",
    },
    {
      name: "standalone helper functions",
      source: "function helper(): boolean { return true; }\nvoid helper();\n",
    },
  ])(
    "reports inline $name in implementation files",
    async ({ source }) => {
      const [result] = await eslint.lintText(source, {
        filePath: path.resolve(packageRoot, "src/sample-feature.ts"),
      });

      const lintResult = required(result, "colocation implementation result");

      const restrictedSyntax = lintResult.messages.find(
        message => message.ruleId === "no-restricted-syntax",
      );

      expect(restrictedSyntax).toBeDefined();
    },
  );

  it("permits colocation in sibling type and helper files", async () => {
    const [typeResult] = await eslint.lintText(
      "export type Contract = { name: string };\n",
      { filePath: path.resolve(packageRoot, "src/sample-feature.type.ts") },
    );

    expect(
      typeResult?.messages.map(message => message.ruleId),
    ).not.toContain("no-restricted-syntax");

    const [helperResult] = await eslint.lintText(
      "export function helper(): boolean { return true; }\n",
      { filePath: path.resolve(packageRoot, "src/sample-feature.helper.ts") },
    );

    expect(
      helperResult?.messages.map(message => message.ruleId),
    ).not.toContain("no-restricted-syntax");
  });

  it("reports deep imports from es-toolkit via restricted imports", async () => {
    const [result] = await eslint.lintText(
      "import { debounce } from \"es-toolkit/compat\";\nexport { debounce };\n",
      { filePath: javascriptFixture },
    );

    const lintResult = required(result, "deep import behavior result");

    const restrictedMessage = lintResult.messages.find(
      message => message.ruleId === "no-restricted-imports",
    );

    expect(restrictedMessage).toBeDefined();
    expect(restrictedMessage?.message).toContain(
      "Deep imports from es-toolkit are prohibited",
    );
  });

  it("reports namespace imports from es-toolkit via restricted syntax", async () => {
    const [result] = await eslint.lintText(
      "import * as esToolkit from \"es-toolkit\";\nexport { esToolkit };\n",
      { filePath: javascriptFixture },
    );

    const lintResult = required(result, "namespace import behavior result");

    const restrictedMessage = lintResult.messages.find(
      message => message.ruleId === "no-restricted-syntax",
    );

    expect(restrictedMessage).toBeDefined();
    expect(restrictedMessage?.message).toContain(
      "Namespace imports from 'es-toolkit' are prohibited",
    );
  });

  it("reports duplicate string literals via sonarjs policy", async () => {
    const source = [
      "export const first = \"duplicated-magic-string-token\";",
      "export const second = \"duplicated-magic-string-token\";",
      "export const third = \"duplicated-magic-string-token\";",
      "",
    ].join("\n");

    const [result] = await eslint.lintText(source, {
      filePath: javascriptFixture,
    });

    const lintResult = required(result, "sonarjs duplicate string result");

    expect(lintResult.messages.map(message => message.ruleId)).toContain(
      "sonarjs/no-duplicate-string",
    );
  });

  it("reports missing blank line around multiline variable declarations", async () => {
    const source = [
      "const first = 1;",
      "const second = [",
      "  1,",
      "  2,",
      "];",
      "const third = 3;",
      "",
    ].join("\n");

    const [result] = await eslint.lintText(source, {
      filePath: javascriptFixture,
    });

    const lintResult = required(result, "multiline padding lint result");

    expect(lintResult.messages.map(message => message.ruleId)).toContain(
      "@stylistic/padding-line-between-statements",
    );
  });

  it("reports unexpected blank line between adjacent single-line variable declarations", async () => {
    const source = [
      "const first = 1;",
      "",
      "const second = 2;",
      "",
    ].join("\n");

    const [result] = await eslint.lintText(source, {
      filePath: javascriptFixture,
    });

    const lintResult = required(result, "singleline padding lint result");

    expect(lintResult.messages.map(message => message.ruleId)).toContain(
      "@stylistic/padding-line-between-statements",
    );
  });

  it("reports missing blank line before block statements", async () => {
    const source = [
      "export function run(): void {",
      "  const value = 1;",
      "  if (value) {",
      "    void value;",
      "  }",
      "}",
      "",
    ].join("\n");

    const [result] = await eslint.lintText(source, {
      filePath: javascriptFixture,
    });

    const lintResult = required(result, "block-like padding lint result");

    expect(lintResult.messages.map(message => message.ruleId)).toContain(
      "@stylistic/padding-line-between-statements",
    );
  });
});
