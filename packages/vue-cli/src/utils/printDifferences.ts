import chalk from "chalk"
import { Change } from "diff"

export async function printDiff(diff: Change[]) {
  diff.forEach((part) => {
    if (part) {
      if (part.added) {
        return process.stdout.write(chalk.green(part.value))
      }
      if (part.removed) {
        return process.stdout.write(chalk.red(part.value))
      }

      return process.stdout.write(part.value)
    }
  })
}