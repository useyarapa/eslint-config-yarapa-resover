import path from "node:path";
import { describe, expect, it } from "vitest";

import { packageRoot, required } from "../helpers/index.js";
import {
  eslint,
  javascriptFixture,
  projectRoot,
} from "./behavior.helper.js";

const PREVENT_ABBREVIATIONS = "unicorn/prevent-abbreviations";

describe("JavaScript policy behavior", () => {
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

    expect(lintResult.messages.map(message => message.ruleId)).toContain("no-var");
  });

  it("requires strict equality in shared JavaScript handwriting", async () => {
    const [result] = await eslint.lintText(
      "export const equivalent = (left, right) => left == right;\n",
      { filePath: javascriptFixture },
    );

    const lintResult = required(result, "equality lint result");

    expect(lintResult.messages.map(message => message.ruleId)).toContain("eqeqeq");
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
      PREVENT_ABBREVIATIONS,
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
        PREVENT_ABBREVIATIONS,
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

    const restricted = lintResult.messages.find(
      message => message.ruleId === "no-restricted-imports",
    );

    expect(restricted).toBeDefined();
    expect(restricted?.message).toContain("es-toolkit");
  });

  it("rejects eslint-disable comments via noInlineConfig while validating comments policy", async () => {
    const [result] = await eslint.lintText(
      "/* eslint-disable no-var */\nvar x = 1;\n",
      { filePath: javascriptFixture },
    );

    const lintResult = required(result, "eslint-comments behavior result");
    const ruleIds = lintResult.messages.map(message => message.ruleId);

    expect(ruleIds).toContain(
      "@eslint-community/eslint-comments/require-description",
    );

    expect(ruleIds).toContain("@eslint-community/eslint-comments/no-use");

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
});
