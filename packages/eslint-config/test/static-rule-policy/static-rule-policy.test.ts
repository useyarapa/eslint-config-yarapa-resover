import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { configsDir } from "../helpers/index.js";
import {
  collectConfigViolations,
  FORBIDDEN_CONFIG_PATTERNS,
} from "./static-rule-policy.helper.js";

describe("static rule policy guard", () => {
  it("forbids upstream preset access and extends in production configs", () => {
    const violations = collectConfigViolations(
      configsDir,
      FORBIDDEN_CONFIG_PATTERNS,
    );

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
