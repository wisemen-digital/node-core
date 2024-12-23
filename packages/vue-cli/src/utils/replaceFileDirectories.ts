import { Component } from "./getComponents"
import { Config } from "./getConfig"
import { unresolveImport } from "./resolveImport"

const defaultDirectories = {
  components: "@/components",
  utils: "@/utils",
  composables: "@/composables",
  transitions: "@/transitions",
  icons: "@/icons",
}

export const replaceFileDirectories = async (file: Component['files'][number], config: Config) => {
  const defaultDirectoriesKeys = Object.keys(defaultDirectories)

  for (const key of defaultDirectoriesKeys) {
    if (!config.resolvedPaths[key as keyof typeof defaultDirectories])
      continue

    const unresolvedPath = await unresolveImport(config.resolvedPaths[key as keyof typeof defaultDirectories])
    file.content = file.content.replaceAll(
      defaultDirectories[key as keyof typeof defaultDirectories],
      unresolvedPath,
    )
  }

  return file
}