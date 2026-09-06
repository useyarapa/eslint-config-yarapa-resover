import type { Linter } from "eslint";

import path from "node:path";
import { expect } from "vitest";

import { eslintForConfigs, packageRoot, required } from "../helpers/index.js";

/**
 * Apply an ESLint fixer twice and verify idempotence.
 * @param config Flat Config entries under test.
 * @param code Source text to fix.
 * @param filename Virtual fixture path used for config matching.
 * @returns Output from the first fix pass.
 */
export async function fixTwice(
  config: Linter.Config[],
  code: string,
  filename: string,
): Promise<string> {
  const eslint = eslintForConfigs(config, { fix: true });

  const [first] = await eslint.lintText(code, {
    filePath: path.resolve(packageRoot, filename),
  });
  expect(first).toBeDefined();
  const firstResult = required(first, "first autofix lint result");
  expect(firstResult.fatalErrorCount).toBe(0);

  const output1 = firstResult.output ?? code;
  const [second] = await eslint.lintText(output1, {
    filePath: path.resolve(packageRoot, filename),
  });
  expect(second).toBeDefined();
  const secondResult = required(second, "second autofix lint result");
  expect(secondResult.fatalErrorCount).toBe(0);

  const output2 = secondResult.output ?? output1;
  expect(output2).toBe(output1);

  return output1;
}
