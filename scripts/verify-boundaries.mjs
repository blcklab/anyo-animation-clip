import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
const root = await readFile(new URL('../dist/index.js', import.meta.url), 'utf8')
assert.equal(root.includes('@blcklab/sekai64'), false, 'Renderer-neutral root must not import Sekai64.')
assert.equal(root.includes('@blcklab/anyo-animation'), false, 'Renderer-neutral root must not import Anyo Animation.')
const sekai = await readFile(new URL('../dist/sekai64/index.js', import.meta.url), 'utf8')
assert.equal(sekai.includes('./loader.js'), true, 'Sekai64 subpath must expose the clip loader.')
console.log('Anyo Animation Clip package boundaries verified.')
