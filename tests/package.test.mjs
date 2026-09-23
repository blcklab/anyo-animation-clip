import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { ANYO_ANIMATION_CLIP_VERSION } from '../dist/index.js'

test('package version export matches package.json', async () => {
  const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'))
  assert.equal(ANYO_ANIMATION_CLIP_VERSION, pkg.version)
})

test('package keeps renderer integrations behind explicit subpaths', async () => {
  const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'))
  assert.ok(pkg.exports['./sekai64'])
  assert.ok(pkg.exports['./anyo-animation'])
  assert.equal(pkg.dependencies, undefined)
})
