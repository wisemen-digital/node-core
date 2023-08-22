import ora from "ora"
import { existsSync, promises as fs } from "fs"
import path from "path"
import { execa } from "execa"

import { Component, getAvailableComponents } from "./getComponents"
import { PackageManager, getPackageManager } from "./getPackageManager"
import { logger } from "./logger"
import { Config } from "./getConfig"
import { getFileInstallationFolder } from "./getFileInstallationFolder"
import { replaceFileDirectories } from "./replaceFileDirectories"
export interface InstallComponentOptions {
  component: Component
  cliConfig: Config | null
  options: {
    overwrite: boolean;
  },
  packageManager: PackageManager;
  inRoot?: boolean;
}
  

export const installComponent = async ({ component, cliConfig, options, packageManager }: InstallComponentOptions) => {
  const componentSpinner = ora(`${component.name}...`).start()
  if(!cliConfig) {
    return componentSpinner.fail(`No config found. Please run 'wisemen-ui init' first.`)
  }
  
  // Write the files.
  for (const file of component.files) {
    const installationDir = getFileInstallationFolder(file.type, cliConfig)
    const fileDir = file.placementDir === '' ? `${installationDir}` : `${installationDir}/${file.placementDir}`
    const resolvedFile = await replaceFileDirectories(file, cliConfig)
    const spinner = ora(`Creating ${fileDir}/${resolvedFile.name}...`).start()

    if (!existsSync(path.resolve(fileDir))) {
      await fs.mkdir(path.resolve(fileDir), { recursive: true })
    }

    const filePath = path.resolve(fileDir, resolvedFile.name)
    if (existsSync(filePath) && !options.overwrite) {
      spinner.warn(`${resolvedFile.name} already exists. Skipping. Use --overwrite to overwrite existing files`)
      spinner.stop()
      continue
    }
    spinner.succeed(`Created ${fileDir}/${resolvedFile.name}`)
    spinner.stop()
    await fs.writeFile(filePath, resolvedFile.content)
  }

  // Install dependencies.
  if (component.dependencies?.length) {
    const spinner = ora(`Installing dependencies...`).start()

    await execa(packageManager, [
      packageManager === "npm" ? "install" : "add",
      ...component.dependencies,
    ])
    spinner.succeed(
      `Installed ${component.dependencies.length} dependencies.\n${component.dependencies.join(", ")}`
    )

  }
  componentSpinner.succeed(component.name)
}