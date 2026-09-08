import type { Linter } from "eslint";

import promisePlugin from "eslint-plugin-promise";

import type { Plugin } from "./promise.type.js";

import { JAVASCRIPT_AND_TYPESCRIPT_FILES } from "../constants/index.js";

const promiseRules: Linter.RulesRecord = {
  "promise/always-return": "error",
  "promise/avoid-new": "off",
  "promise/catch-or-return": "error",
  "promise/no-callback-in-promise": "error",
  "promise/no-native": "off",
  "promise/no-nesting": "error",
  "promise/no-new-statics": "error",
  "promise/no-promise-in-callback": "error",
  "promise/no-return-in-finally": "error",
  "promise/no-return-wrap": "error",
  "promise/param-names": "error",
  "promise/valid-params": "error",
};

export const promise: Linter.Config[] = [
  {
    files: JAVASCRIPT_AND_TYPESCRIPT_FILES,
    name: "yarapa/promise",
    plugins: {
      promise: promisePlugin as unknown as Plugin,
    },
    rules: promiseRules,
  },
];
