import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { packageRoot } from "../helpers/index.js";

type PackageJson = {
  bin?: Record<string, string>;
  exports: Record<string, unknown>;
  name: string;
  publishConfig: {
    access: string;
    provenance: boolean;
  };
};

const packageJson = JSON.parse(
  readFileSync(path.resolve(packageRoot, "package.json"), "utf8"),
) as PackageJson;

describe("public API", () => {
  it("publishes as a public scoped package with provenance", () => {
    expect(packageJson.name).toBe("@yarapa/eslint-config");
    expect(packageJson.publishConfig).toEqual({
      access: "public",
      provenance: true,
    });
  });

  it("exports only the canonical default configuration", async () => {
    const module = await import("../../src/index.js");

    expect(Object.keys(module)).toEqual(["default"]);
    expect(Reflect.get(module, "default")).toEqual(expect.any(Array));
  });

  it("does not publish binary executables", () => {
    expect(packageJson.bin).toBeUndefined();
  });

  it("publishes root entry and package.json exports only", () => {
    expect(Object.keys(packageJson.exports)).toEqual([".", "./package.json"]);
  });

  it.each(["./nest", "./react", "./node"])(
    "does not expose %s as a public subpath",
    subpath => {
      expect(Reflect.has(packageJson.exports, subpath)).toBe(false);
    },
  );
});
