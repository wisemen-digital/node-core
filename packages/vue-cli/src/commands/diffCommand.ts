import { existsSync, promises as fs } from "fs"
import { logger } from "@/src/utils/logger"
import chalk from "chalk"
import { Command } from "commander"
import { diffLines, type Change } from "diff"
import * as z from "zod"
import { Component } from "../utils/getComponents"
import { getInstalledComponents } from "../utils/getInstalledComponents"
import { promptForComponent, promptForComponents } from "../utils/promptComponents"
import { printDiff } from "../utils/printDifferences"
import { diffComponent } from "../utils/getDifferenceComponent"

const updateOptionsSchema = z.object({
  component: z.string().optional(),
})

export const addDiffCommand = ({ program }: { program: Command }) => {
  program
    .command("diff")
    .name("diff")
    .description("check for updates against the registry")
    .argument("[component]", "the component name")
    .action(async (name, opts) => {
      const options = updateOptionsSchema.parse({
        component: name,
      })

      const installedComponents  = await getInstalledComponents()
      if(!installedComponents)
        return
      
      if(!options.component) {
        const component = await promptForComponent(installedComponents) as Component
        options.component = component.name
      }
      const component = installedComponents.find((component) => {
        return component?.name === options.component
      })
      if (!component) {
        logger.error(
          `The component ${chalk.green(options.component)} does not exist.`
        )
        process.exit(1)
      }

      const changes = await diffComponent(component)

      if (!changes.length) {
        logger.info(`No updates found for ${options.component}.`)
        process.exit(0)
      }

      for (const change of changes) {
        logger.info(`- ${change.filePath}`)
        await printDiff(change.patch)
        logger.info("")
      }
    
  })
}
