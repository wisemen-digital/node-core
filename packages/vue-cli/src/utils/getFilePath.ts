import { Component } from "./getComponents";
import { Config } from "./getConfig";
import { getFileInstallationFolder } from "./getFileInstallationFolder";
import { resolveImport } from "./resolveImport";

export const getFilePath = async (file: Component['files'][number], config: Config) => {
  const installationDir = getFileInstallationFolder(file.type, config)
  const fileDir = file.placementDir === '' ? `${installationDir}` : `${installationDir}/${file.placementDir}`
  const filePath = await resolveImport(`${fileDir}/${file.name}`)
  return filePath
}