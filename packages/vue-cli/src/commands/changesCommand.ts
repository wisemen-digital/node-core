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
import { installComponent } from "../utils/installComponent"
import { getConfig } from "../utils/getConfig"
export const addChangesCommand = ({ program }: { program: Command }) => {
  program
    .command("changes")
    .name("changes")
    .description("check for changes against the registry")
    .action(async (name, opts) => {
      const installedComponents  = await getInstalledComponents()
      if(!installedComponents)
        return
      let noChanges = true
      for(const component of installedComponents) {
        if(!component)
          return
        const changes = await diffComponent(component)
        if (!changes.length) {
          return
        }
        noChanges = false
        logger.info(chalk.cyan(`Changes found for ${chalk.green(component.name)}`))

        changes.forEach((change) => {
          logger.warn(`- ${change.filePath} ${chalk.magenta(`(${change.patch.length} changes)`)}`)
        })    
      }
    if(noChanges)
      logger.info(chalk.cyan(`No changes found.`))
  })
}
