import type { Linter } from "eslint";

export const CONFIG_NAMES = {
  baseLinterOptions: "yarapa/base/linter-options",
  baseModernJs: "yarapa/base/modern-js",
  sonarjs: "yarapa/sonarjs",
  stylistic: "yarapa/stylistic",
  typeChecked: "yarapa/type-checked",
  typescript: "yarapa/typescript",
  unicorn: "yarapa/unicorn",
  vitest: "yarapa/vitest",
} as const;

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
