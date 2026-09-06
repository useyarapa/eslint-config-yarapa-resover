import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { configsDir } from "../helpers/index.js";

describe("static rule policy guard", () => {
  it("forbids upstream preset access and extends in production configs", () => {
    const subdirectories = fs
      .readdirSync(configsDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    const configFiles = subdirectories
      .map(sub => path.join(configsDir, sub, `${sub}.ts`))
      .filter(filePath => fs.existsSync(filePath));

    const forbiddenPatterns = [
      /\.configs[.[\]]/u,
      /\bextends\s*:/u,
      /import\s*\{[^}]*\bconfigs\b[^}]*\}\s*from\s+["'][^./]/u,
    ];

    const violations: string[] = [];

    for (const filePath of configFiles) {
      const content = fs.readFileSync(filePath, "utf8");
      const relativePath = path.relative(configsDir, filePath);

      for (const pattern of forbiddenPatterns) {
        if (pattern.test(content)) {
          violations.push(`${relativePath} matched ${pattern.toString()}`);
        }
      }
    }

    expect(violations).toEqual([]);
  });

  it("keeps yarapa.ts orchestration-only", () => {
    const yarapaPath = path.join(configsDir, "yarapa/yarapa.ts");
    const content = fs.readFileSync(yarapaPath, "utf8");

    expect(content).not.toMatch(/\brules\s*:/u);
    expect(content).not.toMatch(/\bplugins\s*:/u);
    expect(content).not.toMatch(/\blanguageOptions\s*:/u);
    expect(content).not.toMatch(/\bsettings\s*:/u);
    expect(content).not.toMatch(/from\s+["']eslint-plugin-[^./]+/u);
  });
});
