import { Command } from "commander"

import { getAvailableComponents } from "../utils/getComponents"
import { logger } from "../utils/logger"

import { installComponent } from "../utils/installComponent"
import { PackageManager } from "../utils/getPackageManager"
import { addInternalDependencies } from "../utils/addInternalDependencies"
import { promptForComponents } from "../utils/promptComponents"
import { Config } from "../utils/getConfig"
import ora from "ora"

interface AddAddCommandOptions {
  program: Command;
  packageManager: PackageManager
  cliConfig: Config | null,
}

export const addAddCommand = ({ 
  program, 
  packageManager,
  cliConfig
}: AddAddCommandOptions) => {
  program
  .command("add")
  .description("add components to your project")
  .option("-o, --overwrite", "Overwrite existing components.")
  .argument("[components...]", "name of components")
  .action(async (components: string[], options: { overwrite: boolean}) => {
    if(!cliConfig) {
      logger.error(`No config found. Please run 'init' first.`)
      return
    }
  
    const availableComponents = await getAvailableComponents()

    if (!availableComponents?.length) {
      logger.error(
        "An error occurred while fetching components. Please try again."
      )
      process.exit(0)
    }

    let selectedComponents = availableComponents.filter((component) =>
      components.includes(component.name) || components.includes(component.component)
    )

    if(components.includes("all") || components.includes("*")) {
      selectedComponents = availableComponents
    }

    if (!selectedComponents?.length) {
      selectedComponents = await promptForComponents(availableComponents)
    }


    if (!selectedComponents?.length) {
      logger.warn("No components selected. Nothing to install.")
      process.exit(0)
    }

    logger.success(
      `Installing ${selectedComponents.length} component(s) and dependencies...`
    )

    // Add all components and their internal dependencies to the list of components to install recursively.
    const allComponents = new Set(addInternalDependencies( {selectedComponents, availableComponents, addedComponents: selectedComponents}))
    for (const component of Array.from(allComponents)) {
      await installComponent({
        component,
        options,
        cliConfig,
        packageManager,
      })
    }
  })
}