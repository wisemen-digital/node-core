import { logger } from "@/src/utils/logger"
import chalk from "chalk"
import { Command } from "commander"
import {  getInstalledComponents } from "../utils/getInstalledComponents"



interface AddInstalledCommand {
  program: Command;
}
export const addInstalledCommand = ({ program }: AddInstalledCommand) => { 
  program
    .command('installed')
    .name("installed")
    .description("check which components are installed")
    .action(async (name, opts) => {
      try {
        const allComponents = await getInstalledComponents()
        if (allComponents?.length === 0) {
          logger.info(
            `No components installed. Run ${chalk.green(
              `add`
            )} to install components.`
          )
          process.exit(0)
        }
        allComponents?.forEach((component) => {
          logger.info(`Component: ${chalk.green(component?.name)}`)
          component?.files.forEach((file) => {
            logger.info(chalk.magenta(`File: ${chalk.yellow(file.localPath)}`))
          })
        })
        logger.info(
          `Command ${chalk.green(`diff <component>`)} to see the changes.`
        )
      } catch (error) {
        logger.error(error)
      }
  })
}
