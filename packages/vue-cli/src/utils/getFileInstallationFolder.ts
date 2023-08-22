import { FileType } from "./getComponents";
import { Config } from "./getConfig";

export const getFileInstallationFolder = (fileType: FileType, config: Config) => {
  return config.resolvedPaths[fileType]
}
