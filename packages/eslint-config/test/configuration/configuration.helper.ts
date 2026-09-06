import type { Linter } from "eslint";

/**
 * Resolve the final configured value for one rule.
 * @param config Flat Config array.
 * @param ruleName Fully qualified rule name.
 * @returns The final rule entry when configured.
 */
export function findRule(
  config: Linter.Config[],
  ruleName: string,
): Linter.RuleEntry | undefined {
  let resolved: Linter.RuleEntry | undefined;

  for (const entry of config) {
    const rule = Reflect.get(entry.rules ?? {}, ruleName) as
      Linter.RuleEntry | undefined;

    if (rule !== undefined) {
      resolved = rule;
    }
  }

  return resolved;
}
