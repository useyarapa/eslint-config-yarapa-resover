import { spawnSync } from "node:child_process";

export const PACKAGE_SPECIFIER = "@yarapa/eslint-config";

/**
 * Run a command and throw when it exits unsuccessfully.
 * @param command Executable to run.
 * @param arguments_ Arguments passed to the executable.
 * @param cwd Working directory for the command.
 * @param expectedStatus Expected process exit status.
 */
export function run(
  command: string,
  arguments_: string[],
  cwd: string,
  expectedStatus = 0,
): void {
  const result = spawnSync(command, arguments_, {
    cwd,
    env: process.env,
    stdio: "inherit",
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== expectedStatus) {
    throw new Error(
      `${command} ${arguments_.join(" ")} exited with ${result.status}; expected ${expectedStatus}`,
    );
  }
}
