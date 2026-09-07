const JSON_EXTENSION = ".json";
const JSON5_EXTENSION = ".json5";

export const JAVASCRIPT_EXTENSIONS = [".js", ".jsx", ".mjs", ".cjs"];
export const JSON_EXTENSIONS = [JSON_EXTENSION, JSON5_EXTENSION, ".jsonc"];
export const TYPESCRIPT_EXTENSIONS = [".ts", ".tsx", ".mts", ".cts"];

export const JAVASCRIPT_AND_TYPESCRIPT_EXTENSIONS = [
  ...JAVASCRIPT_EXTENSIONS,
  ...TYPESCRIPT_EXTENSIONS,
];
export const JAVASCRIPT_FILES = JAVASCRIPT_EXTENSIONS.map(
  extension => `**/*${extension}`,
);
export const PLAIN_JAVASCRIPT_EXTENSIONS = [".js", ".jsx"];
export const PLAIN_JAVASCRIPT_FILES = PLAIN_JAVASCRIPT_EXTENSIONS.map(
  extension => `**/*${extension}`,
);
export const INDEX_FILES = JAVASCRIPT_AND_TYPESCRIPT_EXTENSIONS.map(
  extension => `**/index${extension}`,
);
export const REACT_FILES = ["**/*.jsx", "**/*.tsx"];
export const JSON5_FILES = JSON_EXTENSIONS.filter(
  extension => extension === JSON5_EXTENSION,
).map(extension => `**/*${extension}`);
export const JSON_FILES = JSON_EXTENSIONS.map(extension => `**/*${extension}`);
export const NODE_RESOLUTION_EXTENSIONS = [
  ...JAVASCRIPT_AND_TYPESCRIPT_EXTENSIONS,
  JSON_EXTENSION,
  ".node",
];
export const TYPESCRIPT_DECLARATION_FILES = [".d.ts", ".d.mts", ".d.cts"].map(
  extension => `**/*${extension}`,
);
export const TYPESCRIPT_FILES = TYPESCRIPT_EXTENSIONS.map(
  extension => `**/*${extension}`,
);
export const TYPESCRIPT_TEST_FILES = TYPESCRIPT_EXTENSIONS.map(
  extension => `**/*.test${extension}`,
);
export const JAVASCRIPT_AND_TYPESCRIPT_FILES = [
  ...JAVASCRIPT_FILES,
  ...TYPESCRIPT_FILES,
];
