export function pascalCase (text: string): string {
  return text.replace(/(^\w|-\w)/g, clearAndUpper)
}

function clearAndUpper (text: string): string {
  return text.replace(/-/, '').toUpperCase()
}
