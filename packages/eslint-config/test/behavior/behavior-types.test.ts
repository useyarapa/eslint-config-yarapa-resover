import path from "node:path";
import { describe, expect, it } from "vitest";

import { packageRoot, required } from "../helpers/index.js";
import {
  eslint,
  messageSummary,
  projectRoot,
} from "./behavior.helper.js";

const RESTRICTED_SYNTAX = "no-restricted-syntax";
const CONTRACT_TYPE = "export type Contract = { name: string };\n";
const VALID_TS = "src/valid.ts";

describe("type-aware and test restriction behavior", () => {
  it("accepts a typed project source file", async () => {
    const [result] = await eslint.lintFiles(
      path.resolve(projectRoot, VALID_TS),
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
      filePath: path.resolve(projectRoot, VALID_TS),
    });

    const tsLintResult = required(tsResult, "source lint result");

    expect(tsLintResult.messages.map(message => message.ruleId)).toContain(
      "@typescript-eslint/no-empty-object-type",
    );
  });

  it.each([
    {
      name: "type aliases",
      source: CONTRACT_TYPE,
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

    const restricted = lintResult.messages.find(
      message => message.ruleId === RESTRICTED_SYNTAX,
    );

    expect(restricted?.message).toContain("sibling .type.ts file");
  });

  it("permits type declarations in sibling type files", async () => {
    const [result] = await eslint.lintText(
      CONTRACT_TYPE,
      {
        filePath: path.resolve(
          packageRoot,
          "test/public-api/public-api.type.ts",
        ),
      },
    );

    const lintResult = required(result, "type file lint result");

    expect(lintResult.messages.map(message => message.ruleId)).not.toContain(
      RESTRICTED_SYNTAX,
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

    const restricted = lintResult.messages.find(
      message => message.ruleId === RESTRICTED_SYNTAX,
    );

    expect(restricted?.message).toContain("sibling .helper.ts file");
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
      RESTRICTED_SYNTAX,
    );
  });
});
