import path from "path"
import { resolveImport } from "@/src/utils/resolveImport"
import { cosmiconfig } from "cosmiconfig"
import { loadConfig } from "tsconfig-paths"
import * as z from "zod"

export const DEFAULT_STYLE = "default"
export const DEFAULT_COMPONENTS = "@/components"
export const DEFAULT_UTILS = "@/utils"
export const DEFAULT_TAILWIND_CSS = "app/globals.css"
export const DEFAULT_TAILWIND_CONFIG = "tailwind.config.js"
export const DEFAULT_TAILWIND_BASE_COLOR = "slate"

const explorer = cosmiconfig("components", {
  searchPlaces: ["components.json"],
})

export const rawConfigSchema = z
  .object({
    $schema: z.string().optional(),
    style: z.string(),
    aliases: z.object({
      components: z.string(),
      utils: z.string(),
      composables: z.string(),
      transitions: z.string(),
      icons: z.string(),
      styles: z.string(),
      config: z.string(),
    }),
  })
  .strict()

export type RawConfig = z.infer<typeof rawConfigSchema>

export const configSchema = rawConfigSchema.extend({
  resolvedPaths: z.object({
    config: z.string(),
    styles: z.string(),
    utils: z.string(),
    components: z.string(),
    composables: z.string(),
    icons: z.string(),
    transitions: z.string(),
  }),
})

export type Config = z.infer<typeof configSchema>

export async function getConfig(cwd: string) {
  const config = await getRawConfig(cwd)

  if (!config) {
    return null
  }

  return await resolveConfigPaths(cwd, config)
}

export async function resolveConfigPaths(cwd: string, config: RawConfig) {
  const tsConfig = await loadConfig(cwd)

  if (tsConfig.resultType === "failed") {
    throw new Error(
      `Failed to load tsconfig.json. ${tsConfig.message ?? ""}`.trim()
    )
  }

  return configSchema.parse({
    ...config,
    resolvedPaths: {
      config: path.resolve(cwd, config.aliases.config),
      styles: path.resolve(cwd, config.aliases.styles),
      utils: await resolveImport(config.aliases.utils),
      components: await resolveImport(config.aliases.components),
      composables: await resolveImport(config.aliases.composables),
      icons: await resolveImport(config.aliases.icons),
      transitions: await resolveImport(config.aliases.transitions),
    },
  })
}

export async function getRawConfig(cwd: string): Promise<RawConfig | null> {
  try {
    const configResult = await explorer.search(cwd)

    if (!configResult) {
      return null
    }

    return rawConfigSchema.parse(configResult.config)
  } catch (error) {
    throw new Error(`Invald configuration found in ${cwd}/components.json.`)
  }
}