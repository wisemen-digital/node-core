
import { findUp } from 'find-up'
import path from 'node:path'

export interface DetectOptions {
  autoInstall?: boolean
  programmatic?: boolean
  cwd?: string
}

export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun'

export const LOCKS: Record<string, PackageManager> = {
  'bun.lockb': 'bun',
  'pnpm-lock.yaml': 'pnpm',
  'yarn.lock': 'yarn',
  'package-lock.json': 'npm',
  'npm-shrinkwrap.json': 'npm',
} as const

export async function getPackageManager() {
  const lockPath = await findUp(Object.keys(LOCKS)) ?? 'pnpm-lock.yaml'
  const agent = LOCKS[path.basename(lockPath)]
  return agent
}