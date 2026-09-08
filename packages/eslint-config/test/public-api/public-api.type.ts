export type PublicApiPackageJson = {
  bin?: Record<string, string>;
  exports: Record<string, unknown>;
  name: string;
  publishConfig: {
    access: string;
    provenance: boolean;
  };
};
