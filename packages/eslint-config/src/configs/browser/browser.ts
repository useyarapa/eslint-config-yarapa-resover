import type { Linter } from "eslint";

import globals from "globals";

import { JAVASCRIPT_AND_TYPESCRIPT_FILES } from "../constants/index.js";

export const browser: Linter.Config[] = [
  {
    files: JAVASCRIPT_AND_TYPESCRIPT_FILES,
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    name: "yarapa/browser/globals",
  },
];
