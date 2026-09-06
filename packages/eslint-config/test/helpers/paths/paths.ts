import path from "node:path";
import { fileURLToPath } from "node:url";

export const packageRoot = fileURLToPath(new URL("../../../", import.meta.url));
export const configsDir = path.resolve(packageRoot, "src/configs");
