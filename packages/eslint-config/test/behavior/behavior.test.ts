import path from "node:path";
import { describe, expect, it } from "vitest";

import { packageRoot, required } from "../helpers/index.js";
import {
  eslint,
  javascriptFixture,
  projectRoot,
} from "./behavior.helper.js";

describe("shared YARAPA behavior", () => {
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

  it("reports emoji and pictographic symbols through unicorn string-content policy", async () => {
    const [result] = await eslint.lintText(
      `export const message = "Hello ${String.fromCodePoint(0x1_F6_00)}";\n`,
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
});
