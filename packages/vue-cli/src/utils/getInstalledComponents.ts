import { existsSync } from "fs"
import { Component, getAvailableComponents } from "./getComponents"
import { getFilePath } from "./getFilePath"
import { logger } from "./logger"
import { Config, getConfig } from "./getConfig"

export const getInstalledComponent = async ({ componentName, availableComponents, config}: { availableComponents: Component[], componentName: string, config: Config}) => {
  const component = availableComponents.find((component) => {
    return component.name === componentName
  })
  if(!component) {
    return
  }

  const installedFiles: (Component['files'][number] & { localPath: string })[] = []

  for(const file of component.files) {
    const filePath = await getFilePath(file, config)
    if(existsSync(filePath)) {
      installedFiles.push({
        ...file,
        localPath: filePath
      })
    } 
    else {
      return
    }
  }
    
  if(installedFiles.length === 0) {
    return
  }

  return {
    ...component,
    files: installedFiles
  }
}
  

export const getInstalledComponents = async () => {
  const config = await getConfig('.')
  if(!config) {
    logger.error('No config file found. Please run `init` to create a config file.')
    return
  }
  const components = await getAvailableComponents()
  const installedComponents = await Promise.all(components.map(async (component) => {
    const installedComponent = await getInstalledComponent({ componentName: component.name, availableComponents: components, config })
    if(!installedComponent) {
      return
    }
    return installedComponent
  }))
  return installedComponents.filter((component) => component)
}
