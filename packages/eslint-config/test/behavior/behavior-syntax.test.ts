import path from "node:path";
import { describe, expect, it } from "vitest";

import { packageRoot, required } from "../helpers/index.js";
import {
  eslint,
  javascriptFixture,
  projectRoot,
} from "./behavior.helper.js";

const RESTRICTED_SYNTAX = "no-restricted-syntax";

describe("syntax and colocation behavior", () => {
  it("reports implementation declarations in barrel index files", async () => {
    const [result] = await eslint.lintText(
      "export const helper = (): number => 42;\n",
      { filePath: path.resolve(projectRoot, "src/index.ts") },
    );

    const lintResult = required(result, "barrel index behavior result");

    const restricted = lintResult.messages.find(
      message => message.ruleId === RESTRICTED_SYNTAX,
    );

    expect(restricted?.message).toContain("Barrel index files");
  });

  it("accepts pure re-exports in barrel index files", async () => {
    const [result] = await eslint.lintText(
      "export { valid } from \"./valid.js\";\n",
      { filePath: path.resolve(projectRoot, "src/index.ts") },
    );

    const lintResult = required(result, "barrel index valid result");

    expect(lintResult.messages.map(message => message.ruleId)).not.toContain(
      RESTRICTED_SYNTAX,
    );
  });

  it("reports plain JavaScript files outside fixtures", async () => {
    const [result] = await eslint.lintText(
      "export const value = 1;\n",
      { filePath: path.resolve(projectRoot, "src/plain.js") },
    );

    const lintResult = required(result, "plain js behavior result");

    const restricted = lintResult.messages.find(
      message => message.ruleId === RESTRICTED_SYNTAX,
    );

    expect(restricted?.message).toContain("Plain JavaScript files");
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

      const restricted = lintResult.messages.find(
        message => message.ruleId === RESTRICTED_SYNTAX,
      );

      expect(restricted).toBeDefined();
    },
  );

  it("permits colocation in sibling type and helper files", async () => {
    const [typeResult] = await eslint.lintText(
      "export type Contract = { name: string };\n",
      { filePath: path.resolve(packageRoot, "src/sample-feature.type.ts") },
    );

    expect(
      typeResult?.messages.map(message => message.ruleId),
    ).not.toContain(RESTRICTED_SYNTAX);

    const [helperResult] = await eslint.lintText(
      "export function helper(): boolean { return true; }\n",
      { filePath: path.resolve(packageRoot, "src/sample-feature.helper.ts") },
    );

    expect(
      helperResult?.messages.map(message => message.ruleId),
    ).not.toContain(RESTRICTED_SYNTAX);
  });

  it("reports deep imports from es-toolkit via restricted imports", async () => {
    const [result] = await eslint.lintText(
      "import { debounce } from \"es-toolkit/compat\";\nexport { debounce };\n",
      { filePath: javascriptFixture },
    );

    const lintResult = required(result, "deep import behavior result");

    const restricted = lintResult.messages.find(
      message => message.ruleId === "no-restricted-imports",
    );

    expect(restricted).toBeDefined();

    expect(restricted?.message).toContain(
      "Deep imports from es-toolkit are prohibited",
    );
  });

  it("reports namespace imports from es-toolkit via restricted syntax", async () => {
    const [result] = await eslint.lintText(
      "import * as esToolkit from \"es-toolkit\";\nexport { esToolkit };\n",
      { filePath: javascriptFixture },
    );

    const lintResult = required(result, "namespace import behavior result");

    const restricted = lintResult.messages.find(
      message => message.ruleId === RESTRICTED_SYNTAX,
    );

    expect(restricted).toBeDefined();

    expect(restricted?.message).toContain(
      "Namespace imports from 'es-toolkit' are prohibited",
    );
  });
});
