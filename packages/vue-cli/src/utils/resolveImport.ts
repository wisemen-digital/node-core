import { createMatchPath, type ConfigLoaderSuccessResult } from "tsconfig-paths"

export async function resolveImport(
  importPath: string,
) {
  return importPath.replaceAll('@/', './src/')
}

export async function unresolveImport(importPath: string,) {
  return importPath.replaceAll('./src/', '@/')
}