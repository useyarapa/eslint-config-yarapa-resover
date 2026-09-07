export const MAX_LINE_LENGTH = 80;

export const PADDING_LINE_BETWEEN_STATEMENTS = [
  { blankLine: "always", next: "*", prev: "directive" },
  { blankLine: "any", next: "directive", prev: "directive" },
  { blankLine: "always", next: "*", prev: "import" },
  { blankLine: "any", next: "import", prev: "import" },
  {
    blankLine: "never",
    next: ["singleline-const", "singleline-let", "singleline-var"],
    prev: ["singleline-const", "singleline-let", "singleline-var"],
  },
  {
    blankLine: "always",
    next: ["multiline-const", "multiline-let", "multiline-var"],
    prev: "*",
  },
  {
    blankLine: "always",
    next: "*",
    prev: ["multiline-const", "multiline-let", "multiline-var"],
  },
  {
    blankLine: "never",
    next: "singleline-expression",
    prev: "singleline-expression",
  },
  { blankLine: "always", next: "multiline-expression", prev: "*" },
  { blankLine: "always", next: "*", prev: "multiline-expression" },
  { blankLine: "always", next: "block-like", prev: "*" },
  { blankLine: "always", next: "*", prev: "block-like" },
  { blankLine: "always", next: ["return", "throw"], prev: "*" },
];
