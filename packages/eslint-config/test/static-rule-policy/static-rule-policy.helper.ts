import fs from "node:fs";
import path from "node:path";

export const FORBIDDEN_CONFIG_PATTERNS = [
  /\.configs[.[\]]/u,
  /\bextends\s*:/u,
  /import\s*\{[^}]*\bconfigs\b[^}]*\}\s*from\s+["'][^./]/u,
] as const;

/**
 * Inspect config files under directory for forbidden pattern violations.
 * @param configsDirectory Path to directory containing production config
 * subdirectories.
 * @param patterns Prohibited patterns in production configs.
 * @returns Array of formatted violation strings.
 */
export function collectConfigViolations(
  configsDirectory: string,
  patterns: readonly RegExp[],
): string[] {
  const subdirectories = fs
    .readdirSync(configsDirectory, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  const configFiles = subdirectories
    .map(sub => path.join(configsDirectory, sub, `${sub}.ts`))
    .filter(filePath => fs.existsSync(filePath));

  const violations: string[] = [];

  for (const filePath of configFiles) {
    const content = fs.readFileSync(filePath, "utf8");
    const relativePath = path.relative(configsDirectory, filePath);

    for (const pattern of patterns) {
      if (pattern.test(content)) {
        violations.push(`${relativePath} matched ${pattern.toString()}`);
      }
    }
  }

  return violations;
}
