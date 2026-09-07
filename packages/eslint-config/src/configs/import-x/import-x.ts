import type { Linter } from "eslint";

import importXPlugin from "eslint-plugin-import-x";

import {
  JAVASCRIPT_AND_TYPESCRIPT_EXTENSIONS,
  TYPESCRIPT_EXTENSIONS,
} from "../constants/index.js";

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

const importXSettings: Record<string, unknown> = {
  "import-x/extensions": JAVASCRIPT_AND_TYPESCRIPT_EXTENSIONS,
  "import-x/external-module-folders": ["node_modules", "node_modules/@types"],
  "import-x/parsers": {
    "@typescript-eslint/parser": TYPESCRIPT_EXTENSIONS,
  },
  "import-x/resolver": {
    typescript: true,
  },
};

export const importX: Linter.Config[] = [
  {
    name: "yarapa/import-x",
    plugins: { "import-x": importXPlugin },
    rules: importXRules,
    settings: importXSettings,
  },
];
