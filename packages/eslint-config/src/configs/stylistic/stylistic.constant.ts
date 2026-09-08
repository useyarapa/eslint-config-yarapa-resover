export const MAX_LINE_LENGTH = 80;

const SINGLELINE_VARS = [
  "singleline-const",
  "singleline-let",
  "singleline-var",
] as const;

const MULTILINE_VARS = [
  "multiline-const",
  "multiline-let",
  "multiline-var",
] as const;

const SINGLELINE_EXPRESSION = "singleline-expression" as const;
const MULTILINE_EXPRESSION = "multiline-expression" as const;

export const PADDING_LINE_BETWEEN_STATEMENTS = [
  { blankLine: "always", next: "*", prev: "directive" },
  { blankLine: "any", next: "directive", prev: "directive" },
  { blankLine: "always", next: "*", prev: "import" },
  { blankLine: "any", next: "import", prev: "import" },
  {
    blankLine: "never",
    next: SINGLELINE_VARS,
    prev: SINGLELINE_VARS,
  },
  {
    blankLine: "always",
    next: MULTILINE_VARS,
    prev: "*",
  },
  {
    blankLine: "always",
    next: "*",
    prev: MULTILINE_VARS,
  },
  {
    blankLine: "never",
    next: SINGLELINE_EXPRESSION,
    prev: SINGLELINE_EXPRESSION,
  },
  {
    blankLine: "always",
    next: SINGLELINE_EXPRESSION,
    prev: SINGLELINE_VARS,
  },
  {
    blankLine: "always",
    next: SINGLELINE_VARS,
    prev: SINGLELINE_EXPRESSION,
  },
  { blankLine: "always", next: MULTILINE_EXPRESSION, prev: "*" },
  { blankLine: "always", next: "*", prev: MULTILINE_EXPRESSION },
  { blankLine: "always", next: "block-like", prev: "*" },
  { blankLine: "always", next: "*", prev: "block-like" },
  { blankLine: "always", next: ["return", "throw"], prev: "*" },
];
