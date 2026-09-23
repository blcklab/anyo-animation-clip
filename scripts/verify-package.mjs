import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'))
const mod = await import(new URL('../dist/index.js', import.meta.url))
assert.equal(mod.ANYO_ANIMATION_CLIP_VERSION, pkg.version)
assert.equal(pkg.sideEffects, false)
assert.equal(pkg.dependencies, undefined)
assert.ok(pkg.exports['./sekai64'])
assert.ok(pkg.exports['./anyo-animation'])
const result = spawnSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['pack', '--dry-run', '--json'], { cwd: new URL('..', import.meta.url), encoding: 'utf8' })
if (result.status !== 0) throw new Error(result.stderr || result.stdout)
const packed = JSON.parse(result.stdout)[0]
assert.equal(packed.id, `${pkg.name}@${pkg.version}`)
assert.ok(packed.files.some((file) => file.path === 'dist/index.js'))
assert.ok(packed.files.some((file) => file.path === 'dist/sekai64/index.js'))
assert.ok(packed.files.some((file) => file.path === 'dist/anyo-animation/index.js'))
assert.equal(packed.files.some((file) => file.path.startsWith('.internal/')), false)
assert.equal(packed.files.some((file) => file.path.startsWith('src/')), false)
assert.equal(packed.files.some((file) => file.path.startsWith('tests/')), false)
console.log(`Verified packed ${packed.id}.`)
