import {
  JAVASCRIPT_AND_TYPESCRIPT_EXTENSIONS,
  TYPESCRIPT_EXTENSIONS,
} from "../constants/index.js";

export const IMPORT_X_SETTINGS: Record<string, unknown> = {
  "import-x/extensions": JAVASCRIPT_AND_TYPESCRIPT_EXTENSIONS,
  "import-x/external-module-folders": ["node_modules", "node_modules/@types"],
  "import-x/parsers": {
    "@typescript-eslint/parser": TYPESCRIPT_EXTENSIONS,
  },
  "import-x/resolver": {
    typescript: true,
  },
};
