export function exhaustiveCheck (_x: never): never {
  throw new Error('This code should be unreachable')
}
