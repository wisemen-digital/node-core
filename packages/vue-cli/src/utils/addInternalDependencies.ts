import { Component } from "./getComponents"

export const addInternalDependencies = 
  ({selectedComponents, availableComponents, addedComponents}: 
  { selectedComponents: Component[], availableComponents: Component[], addedComponents: Component[] }) => 
{
  let newComponents: Component[] = []
  selectedComponents.forEach((component) => {
    component?.internalDependencies?.forEach((dependency) => {
      const dependencyComponent = availableComponents.find((component) => component.name === dependency)
      if(dependencyComponent 
        && !addedComponents.find((component) => component.name === dependencyComponent.name)
        && !newComponents.find((component) => component.name === dependencyComponent.name)) 
      {
        newComponents.push(dependencyComponent)
      }
    })
  })
  if(newComponents.length > 0) {
    newComponents = [...selectedComponents, ...newComponents, ...addInternalDependencies({ selectedComponents: newComponents, availableComponents, addedComponents: selectedComponents })]
  } 
  return [...newComponents, ...addedComponents, ...selectedComponents]
}