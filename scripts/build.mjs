import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
await import('./clean.mjs')
await import('./generate-version.mjs')
const tsc = fileURLToPath(new URL('../node_modules/typescript/bin/tsc', import.meta.url))
const result = spawnSync(process.execPath, [tsc, '-p', 'tsconfig.json', '--pretty', 'false'], { stdio: 'inherit' })
if (result.status !== 0) process.exit(result.status ?? 1)
