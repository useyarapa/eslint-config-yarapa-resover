import path from "node:path";
import { describe, expect, it } from "vitest";

import { packageRoot, required } from "../helpers/index.js";
import { eslint, javascriptFixture, projectRoot } from "./behavior.helper.js";

describe("test policy behavior", () => {
  it("reports focused test violations through yarapa vitest policy", async () => {
    const testSource = "describe.only(\"sample\", () => {});\n";

    const [result] = await eslint.lintText(testSource, {
      filePath: path.resolve(
        packageRoot,
        "test/behavior/behavior-test-policy.test.ts",
      ),
    });

    const lintResult = required(result, "vitest behavior result");

    expect(lintResult.messages.map(message => message.ruleId)).toContain(
      "vitest/no-focused-tests",
    );
  });

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

  it("rejects eslint-disable comments through noInlineConfig", async () => {
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
});
