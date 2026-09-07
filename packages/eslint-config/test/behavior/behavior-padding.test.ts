import { describe, expect, it } from "vitest";

import { required } from "../helpers/index.js";
import { eslint, javascriptFixture } from "./behavior.helper.js";

const PADDING_RULE = "@stylistic/padding-line-between-statements";

const TYPESCRIPT_UNUSED_ASSERTION
  = "expect(findRule(yarapa, \"@typescript-eslint/no-unused-vars\")).toBe(\"off\");";

const JAVASCRIPT_UNUSED_ASSERTION
  = "expect(findRule(yarapa, \"no-unused-vars\")).toBe(\"off\");";

const PLUGIN_IMPORTS_ASSERTION
  = "expect(findRule(yarapa, \"unused-imports/no-unused-imports\")).toBe(\"error\");";

const PLUGIN_VARIABLES_ASSERTION = [
  "expect(findRule(yarapa, \"unused-imports/no-unused-vars\")).toEqual([",
  "  \"error\",",
  "  {",
  "    args: \"after-used\",",
  "    argsIgnorePattern: \"^_\",",
  "    vars: \"all\",",
  "    varsIgnorePattern: \"^_\",",
  "  },",
  "]);",
].join("\n");

describe("padding-line-between-statements behavior", () => {
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
      PADDING_RULE,
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
      PADDING_RULE,
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
      PADDING_RULE,
    );
  });

  it("reports missing blank line between variable declaration and expression", async () => {
    const badSource = [
      "const summary = 1;",
      "expect(summary).toEqual(1);",
      "",
    ].join("\n");

    const goodSource = [
      "const summary = 1;",
      "",
      "expect(summary).toEqual(1);",
      "",
    ].join("\n");

    const [badResult] = await eslint.lintText(badSource, {
      filePath: javascriptFixture,
    });

    const [goodResult] = await eslint.lintText(goodSource, {
      filePath: javascriptFixture,
    });

    const badLintResult = required(badResult, "bad result");
    const goodLintResult = required(goodResult, "good result");

    expect(
      badLintResult.messages.map(message => message.ruleId),
    ).toContain(PADDING_RULE);

    expect(
      goodLintResult.messages.map(message => message.ruleId),
    ).not.toContain(PADDING_RULE);
  });

  it.each([
    {
      badSource: [
        TYPESCRIPT_UNUSED_ASSERTION,
        JAVASCRIPT_UNUSED_ASSERTION,
        PLUGIN_IMPORTS_ASSERTION,
        PLUGIN_VARIABLES_ASSERTION,
        "",
      ].join("\n"),
      goodSource: [
        TYPESCRIPT_UNUSED_ASSERTION,
        JAVASCRIPT_UNUSED_ASSERTION,
        PLUGIN_IMPORTS_ASSERTION,
        "",
        PLUGIN_VARIABLES_ASSERTION,
        "",
      ].join("\n"),
      name: "requires padding before a multiline expression",
    },
    {
      badSource: [
        TYPESCRIPT_UNUSED_ASSERTION,
        JAVASCRIPT_UNUSED_ASSERTION,
        PLUGIN_VARIABLES_ASSERTION,
        PLUGIN_IMPORTS_ASSERTION,
        "",
      ].join("\n"),
      goodSource: [
        TYPESCRIPT_UNUSED_ASSERTION,
        JAVASCRIPT_UNUSED_ASSERTION,
        "",
        PLUGIN_VARIABLES_ASSERTION,
        "",
        PLUGIN_IMPORTS_ASSERTION,
        "",
      ].join("\n"),
      name: "requires padding around a multiline expression",
    },
    {
      badSource: [
        TYPESCRIPT_UNUSED_ASSERTION,
        "",
        JAVASCRIPT_UNUSED_ASSERTION,
        "",
        PLUGIN_IMPORTS_ASSERTION,
        "",
      ].join("\n"),
      goodSource: [
        TYPESCRIPT_UNUSED_ASSERTION,
        JAVASCRIPT_UNUSED_ASSERTION,
        PLUGIN_IMPORTS_ASSERTION,
        "",
      ].join("\n"),
      name: "groups adjacent single-line expressions",
    },
    {
      badSource: [
        TYPESCRIPT_UNUSED_ASSERTION,
        "",
        JAVASCRIPT_UNUSED_ASSERTION,
        "",
        PLUGIN_VARIABLES_ASSERTION,
        "",
        PLUGIN_IMPORTS_ASSERTION,
        "",
      ].join("\n"),
      goodSource: [
        TYPESCRIPT_UNUSED_ASSERTION,
        JAVASCRIPT_UNUSED_ASSERTION,
        "",
        PLUGIN_VARIABLES_ASSERTION,
        "",
        PLUGIN_IMPORTS_ASSERTION,
        "",
      ].join("\n"),
      name: "groups single-line expressions before multiline expressions",
    },
  ])("$name", async ({ badSource, goodSource }) => {
    const [badResult] = await eslint.lintText(badSource, {
      filePath: javascriptFixture,
    });

    const [goodResult] = await eslint.lintText(goodSource, {
      filePath: javascriptFixture,
    });

    const badLintResult = required(
      badResult,
      "invalid expression padding result",
    );

    const goodLintResult = required(
      goodResult,
      "valid expression padding result",
    );

    const badRuleIds = badLintResult.messages.map(message => message.ruleId);
    const goodRuleIds = goodLintResult.messages.map(message => message.ruleId);

    expect(badRuleIds).toContain(PADDING_RULE);
    expect(goodRuleIds).not.toContain(PADDING_RULE);
  });
});
