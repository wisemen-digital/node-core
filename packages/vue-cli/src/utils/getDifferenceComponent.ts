import { Component } from "./getComponents"
import { Change, diffLines } from "diff"
import { existsSync, promises as fs } from "fs"

export interface FileDiff {
  file: string
  filePath: string
  patch: Change[]
}

export async function diffComponent(
  component: Component & { files: { localPath: string }[] },
): Promise<FileDiff[]> {
  const changes: FileDiff[] = []

  for (const registryFile of component.files) {
    const localFilePath = registryFile.localPath

    if (!existsSync(localFilePath)) {
      continue 
    }

    const fileContent = await fs.readFile(localFilePath, "utf8")
    const registryContent = registryFile.content

    const patch = diffLines(registryContent, fileContent)
    if (patch.length > 1) {
      changes.push({
        file: registryFile.name,
        filePath: localFilePath,
        patch,
      })
    }
  }
  return changes
}