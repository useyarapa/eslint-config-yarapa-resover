import type { Linter } from "eslint";

import { base } from "../base/index.js";
import { browser } from "../browser/index.js";
import { eslintComments } from "../eslint-comments/index.js";
import { ignores } from "../ignores/index.js";
import { importX } from "../import-x/index.js";
import { jsdoc } from "../jsdoc/index.js";
import { json } from "../json/index.js";
import { node } from "../node/index.js";
import { packageJson } from "../package-json/index.js";
import { perfectionist } from "../perfectionist/index.js";
import { promise } from "../promise/index.js";
import { regexp } from "../regexp/index.js";
import { sonarjs } from "../sonarjs/index.js";
import { stylistic } from "../stylistic/index.js";
import { typeChecked } from "../type-checked/index.js";
import { typescript } from "../typescript/index.js";
import { unicorn } from "../unicorn/index.js";
import { unusedImports } from "../unused-imports/index.js";

export const yarapa: Linter.Config[] = [
  ...ignores,
  ...base,
  ...eslintComments,
  ...promise,
  ...regexp,
  ...unusedImports,
  ...node,
  ...browser,
  ...typescript,
  ...typeChecked,
  ...importX,
  ...sonarjs,
  ...jsdoc,
  ...json,
  ...packageJson,
  ...stylistic,
  ...unicorn,
  ...perfectionist,
];
