import type { Linter } from "eslint";

export type Plugin = NonNullable<Linter.Config["plugins"]>[string];
