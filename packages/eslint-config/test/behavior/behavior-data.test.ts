import path from "node:path";
import { describe, expect, it } from "vitest";

import { packageRoot, required } from "../helpers/index.js";
import { eslint } from "./behavior.helper.js";

describe("data format behavior", () => {
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
});
