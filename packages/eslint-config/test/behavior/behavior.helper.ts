import type { ESLint } from "eslint";

import path from "node:path";

import yarapa from "../../src/index.js";
import { eslintForConfigs, packageRoot } from "../helpers/index.js";

export const eslint = eslintForConfigs(yarapa);

export const javascriptFixture = path.resolve(
  packageRoot,
  "fixtures/projects/untyped/index.js",
);

export const projectRoot = path.resolve(packageRoot, "fixtures/projects/typed");

/**
 * Reduce a lint result to stable diagnostic fields for assertions.
 * @param result ESLint result to summarize.
 * @returns Stable diagnostic summary objects.
 */
export function messageSummary(result: ESLint.LintResult): object[] {
  return result.messages.map(message => ({
    message: message.message,
    ruleId: message.ruleId,
    severity: message.severity,
  }));
}
