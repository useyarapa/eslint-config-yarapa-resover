import {
  mkdirSync,
  mkdtempSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { PACKAGE_SPECIFIER, run } from "./verify-tarball.helper.mts";

const EXPECT_RULE_CALL = "await expectRule(";

if (process.platform === "win32" && !process.env.PNPM_HOME) {
  throw new Error("PNPM_HOME is required for the Windows consumer smoke test");
}

const packageRoot = fileURLToPath(new URL("../../", import.meta.url));

/**
 * Pack the package and verify it in an isolated consumer project.
 */
export function verifyTarball(): void {
  const temporaryRoot = mkdtempSync(path.join(tmpdir(), "yarapa-consumer-"));
  const packageDirectory = path.resolve(temporaryRoot, "pack");
  const consumerDirectory = path.resolve(temporaryRoot, "consumer");

  mkdirSync(packageDirectory, { recursive: true });
  mkdirSync(consumerDirectory, { recursive: true });

  const windowsPnpm = path.resolve(process.env.PNPM_HOME ?? "", "pnpm.exe");
  const pnpm = process.platform === "win32" ? windowsPnpm : "pnpm";
  const node = process.execPath;
  const eslintVersion = process.env.ESLINT_VERSION ?? "10.9.1";
  const typescriptVersion = process.env.TYPESCRIPT_VERSION ?? "6.0.3";
  const eslintConfigPath = path.resolve(consumerDirectory, "eslint.config.mjs");

  try {
    run(pnpm, ["exec", "publint"], packageRoot);
    run(pnpm, ["pack", "--pack-destination", packageDirectory], packageRoot);

    const tarballName = readdirSync(packageDirectory).find(name =>
      name.endsWith(".tgz"),
    );

    if (!tarballName) {
      throw new Error("pnpm pack did not produce a tarball");
    }

    const tarball = path.resolve(packageDirectory, tarballName);

    run(pnpm, ["exec", "attw", tarball, "--profile", "esm-only"], packageRoot);

    writeFileSync(
      path.resolve(consumerDirectory, "package.json"),
      `${JSON.stringify(
        {
          name: "yarapa-consumer-smoke",
          private: true,
          type: "module",
        },
        null,
        2,
      )}\n`,
    );

    run(
      pnpm,
      [
        "--allow-build=sharp",
        "--allow-build=unrs-resolver",
        "add",
        "--save-exact",
        `eslint@${eslintVersion}`,
        `typescript@${typescriptVersion}`,
        tarball,
      ],
      consumerDirectory,
    );

    writeFileSync(
      path.resolve(consumerDirectory, "verify.mjs"),
      [
        `import yarapa from "${PACKAGE_SPECIFIER}";`,
        "",
        "if (!Array.isArray(yarapa) || yarapa.length === 0) {",
        `  throw new Error("Expected non-empty Flat Config array");`,
        "}",
        "",
      ].join("\n"),
    );

    writeFileSync(
      path.resolve(consumerDirectory, "verify-behavior.mjs"),
      [
        `import { ESLint } from "eslint";`,
        `import yarapa from "${PACKAGE_SPECIFIER}";`,
        "",
        "async function expectRule(config, filePath, source, expectedRule) {",
        "  const eslint = new ESLint({",
        "    cwd: process.cwd(),",
        "    overrideConfig: config,",
        "    overrideConfigFile: true,",
        "  });",
        "  const [result] = await eslint.lintText(source, { filePath });",
        "  if (!result) throw new Error(`No lint result for ${filePath}`);",
        "  const ruleIds = result.messages.map(message => message.ruleId);",
        "  if (!ruleIds.includes(expectedRule)) {",
        "    throw new Error(",
        `      \`Expected \${expectedRule} for \${filePath}; got \${ruleIds.join(", ")}\``,
        "    );",
        "  }",
        "}",
        "",
        EXPECT_RULE_CALL,
        "  yarapa,",
        `  "sample-invalid.js",`,
        String.raw`  "export function value() { var answer = 42; return answer; }\n",`,
        `  "no-var",`,
        ");",
        "",
        EXPECT_RULE_CALL,
        "  yarapa,",
        `  "sample.ts",`,
        String.raw`  "export const value: any = 1;\n",`,
        `  "@typescript-eslint/no-explicit-any",`,
        ");",
        "",
        EXPECT_RULE_CALL,
        "  yarapa,",
        `  "sample.json",`,
        String.raw`  '{\n  "name": "one",\n  "name": "two"\n}\n',`,
        `  "jsonc/no-dupe-keys",`,
        ");",
        "",
        EXPECT_RULE_CALL,
        "  yarapa,",
        `  "package.json",`,
        String.raw`  '{\n  "version": "1.0.0",\n  "name": "consumer"\n}\n',`,
        `  "package-json/order-properties",`,
        ");",
        "",
      ].join("\n"),
    );

    writeFileSync(
      eslintConfigPath,
      [
        `import yarapa from "${PACKAGE_SPECIFIER}";`,
        "",
        "export default yarapa;",
        "",
      ].join("\n"),
    );

    writeFileSync(
      path.resolve(consumerDirectory, "tsconfig.json"),
      `${JSON.stringify(
        {
          compilerOptions: {
            module: "NodeNext",
            moduleResolution: "NodeNext",
            strict: true,
            target: "ES2022",
          },
          include: ["sample.ts"],
        },
        null,
        2,
      )}\n`,
    );

    writeFileSync(
      path.resolve(consumerDirectory, "sample.js"),
      "export const answer = 42;\n",
    );

    writeFileSync(
      path.resolve(consumerDirectory, "sample.ts"),
      "export const answer: number = 42;\n",
    );

    run(node, ["verify.mjs"], consumerDirectory);
    run(node, ["verify-behavior.mjs"], consumerDirectory);
    run(pnpm, ["exec", "eslint", "sample.js", "sample.ts"], consumerDirectory);
  } finally {
    rmSync(temporaryRoot, { force: true, recursive: true });
  }
}

const scriptPath = process.argv[1];
const currentPath = fileURLToPath(import.meta.url);

const isDirectExecution = Boolean(
  scriptPath && path.resolve(scriptPath) === currentPath,
);

if (isDirectExecution) {
  verifyTarball();
}
