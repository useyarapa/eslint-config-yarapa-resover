import { describe, expect, it } from "vitest";

import yarapa from "../../src/index.js";
import { fixTwice } from "./autofix.helper.js";

describe("autofix safety and idempotence", () => {
  it("normalizes representative stylistic source once", async () => {
    const output = await fixTwice(
      yarapa,
      "export const value = 'ok'\n",
      "fixtures/autofix/stylistic.js",
    );

    expect(output).toBe("export const value = \"ok\";\n");
  });

  it("removes an unused import without changing the used export", async () => {
    const output = await fixTwice(
      yarapa,
      "import { readFileSync } from \"node:fs\";\n\nexport const value = 1;\n",
      "fixtures/autofix/unused-import.js",
    );

    expect(output).toBe("export const value = 1;\n");
  });

  it("keeps single-parameter block arrows idempotent", async () => {
    const output = await fixTwice(
      yarapa,
      "export const identity = (value) => { return value; };\n",
      "fixtures/autofix/arrow-parens.js",
    );

    expect(output).toContain("identity = value =>");
  });

  it("orders imports deterministically", async () => {
    const output = await fixTwice(
      yarapa,
      "import z from \"z\";\nimport a from \"a\";\n\nexport { a, z };\n",
      "fixtures/autofix/import-order.js",
    );

    expect(output.indexOf("from \"a\"")).toBeLessThan(output.indexOf("from \"z\""));
  });

  it("sorts explicitly sortable arrays by natural order", async () => {
    const output = await fixTwice(
      yarapa,
      "export const sortedValues = [\"item10\", \"item2\", \"item1\"];\n",
      "fixtures/autofix/array.js",
    );

    expect(output).toBe(
      "export const sortedValues = [\"item1\", \"item2\", \"item10\"];\n",
    );
  });

  it("preserves semantic array order without explicit opt-in", async () => {
    const source = "export const rule = [\"error\", \"always\"];\n";
    const output = await fixTwice(yarapa, source, "fixtures/autofix/array.js");

    expect(output).toBe(source);
  });

  it("normalizes template strings and object shorthand once", async () => {
    const output = await fixTwice(
      yarapa,
      "export const greet = name => { const value = \"Hello \" + name; return { value: value }; };\n",
      "fixtures/autofix/modern-js.js",
    );

    expect(output).toBe(
      "export const greet = name => {\n  const value = `Hello ${name}`;\n\n  return { value };\n};\n",
    );
  });

  it("normalizes expression arrows to implicit returns once", async () => {
    const output = await fixTwice(
      yarapa,
      "export const double = value => { return value * 2; };\n",
      "fixtures/autofix/implicit-arrow.js",
    );

    expect(output).toBe("export const double = value => value * 2;\n");
  });

  it("formats structured JSON data idempotently", async () => {
    const source = "{\n\"name\":   \"example\",\n\"version\":\"1.0.0\"\n}\n";
    const output = await fixTwice(yarapa, source, "fixtures/autofix/data.json");

    expect(output).toBe("{\n  \"name\": \"example\",\n  \"version\": \"1.0.0\"\n}\n");
  });

  it("orders package manifest properties idempotently", async () => {
    const source = `${JSON.stringify(
      Object.fromEntries([
        ["version", "1.0.0"],
        ["type", "commonjs"],
        ["name", "example"],
      ]),
      null,
      2,
    )}\n`;

    const output = await fixTwice(
      yarapa,
      source,
      "fixtures/autofix/package.json",
    );

    expect(output).toBe(
      `${JSON.stringify(
        Object.fromEntries([
          ["name", "example"],
          ["version", "1.0.0"],
          ["type", "commonjs"],
        ]),
        null,
        2,
      )}\n`,
    );
  });
});
