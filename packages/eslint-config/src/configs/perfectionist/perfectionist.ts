import type { Linter } from "eslint";

import perfectionistPlugin from "eslint-plugin-perfectionist";

import { JAVASCRIPT_AND_TYPESCRIPT_FILES } from "../constants/index.js";

const perfectionistRules: Linter.RulesRecord = {
  "perfectionist/sort-array-includes": [
    "error",
    { order: "asc", type: "natural" },
  ],
  "perfectionist/sort-arrays": [
    "error",
    {
      order: "asc",
      type: "natural",
      useConfigurationIf: {
        matchesAstSelector:
          "VariableDeclarator[id.name=/^(SORTED_|sorted)/] > ArrayExpression",
      },
    },
  ],
  "perfectionist/sort-classes": ["error", { order: "asc", type: "natural" }],
  "perfectionist/sort-decorators": ["error", { order: "asc", type: "natural" }],
  "perfectionist/sort-enums": ["error", { order: "asc", type: "natural" }],
  "perfectionist/sort-export-attributes": [
    "error",
    { order: "asc", type: "natural" },
  ],
  "perfectionist/sort-exports": ["error", { order: "asc", type: "natural" }],
  "perfectionist/sort-heritage-clauses": [
    "error",
    { order: "asc", type: "natural" },
  ],
  "perfectionist/sort-import-attributes": [
    "error",
    { order: "asc", type: "natural" },
  ],
  "perfectionist/sort-imports": ["error", { order: "asc", type: "natural" }],
  "perfectionist/sort-interfaces": ["error", { order: "asc", type: "natural" }],
  "perfectionist/sort-intersection-types": [
    "error",
    { order: "asc", type: "natural" },
  ],
  "perfectionist/sort-jsx-props": ["error", { order: "asc", type: "natural" }],
  "perfectionist/sort-maps": ["error", { order: "asc", type: "natural" }],
  "perfectionist/sort-modules": ["error", { order: "asc", type: "natural" }],
  "perfectionist/sort-named-exports": [
    "error",
    { order: "asc", type: "natural" },
  ],
  "perfectionist/sort-named-imports": [
    "error",
    { order: "asc", type: "natural" },
  ],
  "perfectionist/sort-object-types": [
    "error",
    { order: "asc", type: "natural" },
  ],
  "perfectionist/sort-objects": ["error", { order: "asc", type: "natural" }],
  "perfectionist/sort-sets": ["error", { order: "asc", type: "natural" }],
  "perfectionist/sort-switch-case": [
    "error",
    { order: "asc", type: "natural" },
  ],
  "perfectionist/sort-union-types": [
    "error",
    { order: "asc", type: "natural" },
  ],
  "perfectionist/sort-variable-declarations": [
    "error",
    { order: "asc", type: "natural" },
  ],
};

export const perfectionist: Linter.Config[] = [
  {
    files: JAVASCRIPT_AND_TYPESCRIPT_FILES,
    name: "yarapa/perfectionist",
    plugins: { perfectionist: perfectionistPlugin },
    rules: perfectionistRules,
  },
];
