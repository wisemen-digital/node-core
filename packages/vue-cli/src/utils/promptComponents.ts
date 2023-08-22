import prompts from "prompts"
import { Component } from "./getComponents"

export async function promptForComponents(components: Component[]) {

  const { components: selectedComponents } = await prompts({
    type: "autocompleteMultiselect",
    name: "components",
    message: "Which component(s) would you like to add?",
    hint: "Space to select. A to select all. I to invert selection.",
    instructions: false,
    choices: components
      .map((component) => ({
        title: component.name,
        value: component,
      })),
  })

  return selectedComponents
}


export async function promptForComponent(components: (Component | undefined)[]) {
  const allComponents = components.filter((component) => component) as Component[]
  const { component: selectedComponent } = await prompts({
    type: "autocomplete",
    name: "component",
    message: "Which component would you like to check?",
    hint: "Space to select.",
    instructions: false,
    choices: allComponents
      .map((component) => ({
        title: component?.name,
        value: component,
      })),
  })

  return selectedComponent
}
