import type { Linter } from "eslint";

import { parser, plugin } from "typescript-eslint";

import {
  TYPESCRIPT_DECLARATION_FILES,
  TYPESCRIPT_FILES,
  TYPESCRIPT_TEST_FILES,
} from "../constants/index.js";

const typescriptCoreReplacementRules: Linter.RulesRecord = {
  "constructor-super": "off",
  "default-param-last": "off",
  "getter-return": "off",
  "no-array-constructor": "off",
  "no-class-assign": "off",
  "no-const-assign": "off",
  "no-dupe-args": "off",
  "no-dupe-class-members": "off",
  "no-dupe-keys": "off",
  "no-func-assign": "off",
  "no-import-assign": "off",
  "no-new-native-nonconstructor": "off",
  "no-new-symbol": "off",
  "no-obj-calls": "off",
  "no-redeclare": "off",
  "no-setter-return": "off",
  "no-this-before-super": "off",
  "no-undef": "off",
  "no-unreachable": "off",
  "no-unsafe-negation": "off",
  "no-unused-expressions": "off",
  "no-unused-vars": "off",
  "no-var": "error",
  "no-with": "off",
  "prefer-const": "error",
  "prefer-rest-params": "error",
  "prefer-spread": "error",
};

const typescriptPolicyRules: Linter.RulesRecord = {
  "@typescript-eslint/ban-ts-comment": [
    "error",
    {
      minimumDescriptionLength: 10,
      "ts-check": false,
      "ts-expect-error": "allow-with-description",
      "ts-ignore": true,
      "ts-nocheck": true,
    },
  ],
  "@typescript-eslint/consistent-type-definitions": ["error", "type"],
  "@typescript-eslint/consistent-type-imports": [
    "error",
    { fixStyle: "separate-type-imports", prefer: "type-imports" },
  ],
  "@typescript-eslint/default-param-last": "error",
  "@typescript-eslint/no-array-constructor": "error",
  "@typescript-eslint/no-duplicate-enum-values": "error",
  "@typescript-eslint/no-empty-object-type": "error",
  "@typescript-eslint/no-explicit-any": "error",
  "@typescript-eslint/no-extra-non-null-assertion": "error",
  "@typescript-eslint/no-import-type-side-effects": "error",
  "@typescript-eslint/no-misused-new": "error",
  "@typescript-eslint/no-namespace": "error",
  "@typescript-eslint/no-non-null-asserted-optional-chain": "error",
  "@typescript-eslint/no-non-null-assertion": "error",
  "@typescript-eslint/no-require-imports": "error",
  "@typescript-eslint/no-this-alias": "error",
  "@typescript-eslint/no-unnecessary-type-constraint": "error",
  "@typescript-eslint/no-unsafe-declaration-merging": "error",
  "@typescript-eslint/no-unsafe-function-type": "error",
  "@typescript-eslint/no-unused-expressions": "error",
  "@typescript-eslint/no-unused-vars": "off",
  "@typescript-eslint/no-wrapper-object-types": "error",
  "@typescript-eslint/prefer-as-const": "error",
  "@typescript-eslint/prefer-namespace-keyword": "error",
  "@typescript-eslint/triple-slash-reference": "error",
};

const typescriptDeclarationRules: Linter.RulesRecord = {
  "@typescript-eslint/no-empty-object-type": [
    "error",
    { allowInterfaces: "always" },
  ],
};

const typescriptTestRules: Linter.RulesRecord = {
  "no-restricted-syntax": [
    "error",
    {
      message: "Move type declarations to a sibling .type.ts file.",
      selector: "TSTypeAliasDeclaration, TSInterfaceDeclaration",
    },
    {
      message: "Move helper functions to a sibling .helper.ts file.",
      selector:
        "Program > FunctionDeclaration, Program > VariableDeclaration > VariableDeclarator[init.type='ArrowFunctionExpression'], Program > VariableDeclaration > VariableDeclarator[init.type='FunctionExpression']",
    },
  ],
};

export const typescript: Linter.Config[] = [
  {
    files: TYPESCRIPT_FILES,
    languageOptions: {
      parser,
      sourceType: "module",
    },
    name: "yarapa/typescript",
    plugins: {
      "@typescript-eslint": plugin,
    },
    rules: {
      ...typescriptCoreReplacementRules,
      ...typescriptPolicyRules,
    },
  },
  {
    files: TYPESCRIPT_DECLARATION_FILES,
    name: "yarapa/typescript/declaration-files",
    rules: typescriptDeclarationRules,
  },
  {
    files: TYPESCRIPT_TEST_FILES,
    name: "yarapa/typescript/test-files",
    rules: typescriptTestRules,
  },
];
