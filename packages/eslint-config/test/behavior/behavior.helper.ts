import type { ESLint } from "eslint";

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
