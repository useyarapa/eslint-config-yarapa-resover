import path from "node:path";
import { describe, expect, it } from "vitest";

import yarapa from "../../src/index.js";
import { eslintForConfigs, packageRoot } from "../helpers/index.js";
import { SAMPLE_FILES } from "./config-validation.helper.js";

describe("Flat Config validation", () => {
  it.each(SAMPLE_FILES)("resolves configuration for %s", async sampleFile => {
    await expect(
      eslintForConfigs(yarapa).calculateConfigForFile(
        path.resolve(packageRoot, sampleFile),
      ),
    ).resolves.toBeDefined();
  });

  it("isolates source and JSON rule scopes", async () => {
    const eslint = eslintForConfigs(yarapa);
    const jsonPath = path.resolve(packageRoot, "fixtures/sample.json");

    await expect(
      eslint.calculateConfigForFile(
        path.resolve(packageRoot, SAMPLE_FILES[0]),
      ),
    ).resolves.not.toHaveProperty(["rules", "jsonc/no-dupe-keys"]);
    await expect(
      eslint.calculateConfigForFile(jsonPath),
    ).resolves.toHaveProperty(["rules", "jsonc/no-dupe-keys"]);
    await expect(
      eslint.calculateConfigForFile(jsonPath),
    ).resolves.not.toHaveProperty(["rules", "promise/catch-or-return"]);
  });
});
