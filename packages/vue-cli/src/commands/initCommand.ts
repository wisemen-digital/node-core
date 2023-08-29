
import { existsSync, promises as fs } from "fs"
import path from "path"
import { Command } from "commander"
import { execa } from "execa"
import ora from "ora"
import prompts from "prompts"

import { getGlobalComponents, getGlobalConfig } from "../utils/getComponents"
import { logger } from "../utils/logger"

import { installComponent } from "../utils/installComponent"
import { PackageManager } from "../utils/getPackageManager"
import { Config, getConfig, rawConfigSchema, resolveConfigPaths } from "../utils/getConfig"
import chalk from "chalk"


interface AddInitCommandOptions {
  program: Command;
  packageManager: PackageManager
  projectInfo: {
    tsconfig: any;
    srcDir: boolean;
    appDir: boolean;
    srcComponentsUiDir: boolean;
    componentsUiDir: boolean;
  }
  cliConfig: Config | null
}

const PROJECT_DEPENDENCIES: string[] = [
  '@appwise/forms',
  'class-variance-authority',
  'tailwind-merge',
  'zod',
]

const baseUrl = process.env.COMPONENTS_BASE_URL ?? "https://wisemen-components.netlify.app/"

export const DEFAULT_STYLE = "default"
export const DEFAULT_COMPONENTS = "@/components"
export const DEFAULT_UTILS = "@/utils"
export const DEFAULT_STYLES = "src/assets/styles"
export const DEFAULT_CONFIG = "./"
export const DEFAULT_COMPOSABLES = "@/composables"
export const DEFAULT_TRANSITIONS = "@/transitions"
export const DEFAULT_ICONS = "@/icons"

const highlight = (text: string) => chalk.cyan(text)

const promptForConfig = async (optionsCwd: any) => {
  if (!optionsCwd.yes) {
    const { proceed } = await prompts({
      type: "confirm",
      name: "proceed",
      message:
        "Running this command will install dependencies and overwrite your existing tailwind.config.js / globals.css. Proceed?",
      initial: true,
    })

    if (!proceed) {
      process.exit(0)
    }
  }

  const options = await prompts([
    {
      type: "text",
      name: "styles",
      message: `Where is your ${highlight("style")} files?`,
      initial: DEFAULT_STYLES,
    },
    {
      type: "text",
      name: "config",
      message: `Where is your ${highlight("config files")}, like tailwind.config.js located?`,
      initial: DEFAULT_CONFIG,
    },
    {
      type: "text",
      name: "components",
      message: `Configure the import alias for ${highlight("components")}:`,
      initial: DEFAULT_COMPONENTS,
    },
    {
      type: "text",
      name: "utils",
      message: `Configure the import alias for ${highlight("utils")}:`,
      initial: DEFAULT_UTILS,
    },
    {
      type: "text",
      name: "composables",
      message: `Configure the import alias for ${highlight("composables")}:`,
      initial: DEFAULT_COMPOSABLES,
    },
    {
      type: "text",
      name: "transitions",
      message: `Configure the import alias for ${highlight("transitions")}:`,
      initial: DEFAULT_TRANSITIONS,
    },
    {
      type: "text",
      name: "icons",
      message: `Configure the import alias for ${highlight("icons")}:`,
      initial: DEFAULT_ICONS,
    },
  ])


  const config = rawConfigSchema.parse({
    $schema: "https://wisemen-components.netlify.app/api/components.json",
    style: 'wisemen',
    aliases: {
      utils: options.utils,
      components: options.components,
      composables: options.composables,
      transitions: options.transitions,
      icons: options.icons,
      styles: options.styles,
      config: options.config,
    },
  })
  
  const targetPath = path.resolve("components.json")
  await fs.writeFile(targetPath, JSON.stringify(config, null, 2), "utf8")

  return await resolveConfigPaths('./', config)
}

export const addInitCommand = ({ 
    program, 
    packageManager,
  }: AddInitCommandOptions) => {

  program
  .command("init")
  .description("Configure your Vue project.")
  .option("-y, --yes", "Skip confirmation prompt.")
  .action(async (options) => {
    logger.warn(
      "This command assumes a Vue project with TypeScript and Tailwind CSS."
    )
    logger.warn("")

    const config = await getConfig('/')
    if(config) {
      logger.error('Project already configured.')
    }
    logger.info("No config found. Setting up new config.")

  
    const configOptions = await promptForConfig(options)
    // Install dependencies.
    if(PROJECT_DEPENDENCIES.length > 0) {
      const dependenciesSpinner = ora(`Installing dependencies...`).start()

      await execa(packageManager, [
        packageManager === "npm" ? "install" : "add",
        ...PROJECT_DEPENDENCIES,
      ])
      dependenciesSpinner.succeed()
    }


    const globalConfig = await getGlobalConfig()
    const globalComponents = await getGlobalComponents()

    for (const component of Array.from(globalConfig)) {
      await installComponent({
        component,
        options,
        cliConfig: configOptions,
        packageManager,
        inRoot: true,
      })
    }

    for (const component of Array.from(globalComponents)) {
      await installComponent({
        component,
        options,
        cliConfig: configOptions,
        packageManager,
        inRoot: true,
      })
    }
  })
}