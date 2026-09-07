import type { Linter } from "eslint";

import importXPlugin from "eslint-plugin-import-x";

import { JAVASCRIPT_AND_TYPESCRIPT_FILES } from "../constants/index.js";
import { IMPORT_X_SETTINGS } from "./import-x.constant.js";

const importXRules: Linter.RulesRecord = {
  "import-x/default": "error",
  "import-x/export": "error",
  "import-x/named": "off",
  "import-x/namespace": "error",
  "import-x/no-duplicates": "error",
  "import-x/no-named-as-default": "error",
  "import-x/no-named-as-default-member": "error",
  "import-x/no-unresolved": "error",
};

export const importX: Linter.Config[] = [
  {
    files: JAVASCRIPT_AND_TYPESCRIPT_FILES,
    name: "yarapa/import-x",
    plugins: { "import-x": importXPlugin },
    rules: importXRules,
    settings: IMPORT_X_SETTINGS,
  },
];
