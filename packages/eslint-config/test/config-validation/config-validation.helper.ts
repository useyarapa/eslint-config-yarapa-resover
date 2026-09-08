export const REACT_SAMPLE_FILES = [
  "fixtures/projects/typed/src/app/blog/[slug]/page.tsx",
  "fixtures/projects/typed/src/component.tsx",
] as const;

export const NON_REACT_TYPED_SAMPLE_FILES = [
  "fixtures/projects/typed/src/app/api/[id]/route.ts",
  "fixtures/projects/typed/src/cats.controller.ts",
  "fixtures/projects/typed/src/valid.ts",
] as const;

export const SAMPLE_FILES = [
  ...NON_REACT_TYPED_SAMPLE_FILES,
  ...REACT_SAMPLE_FILES,
  "fixtures/projects/untyped/index.js",
] as const;
