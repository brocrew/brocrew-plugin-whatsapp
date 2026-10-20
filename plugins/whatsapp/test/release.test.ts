import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { gunzipSync } from 'node:zlib'
import { expect, it } from 'vitest'
const folder = process.env.BROCREW_WHATSAPP_TEST_ARTIFACT
const names = ['whatsapp-darwin-arm64', 'whatsapp-win32-x64']
it.skipIf(!folder)('pins the platform-neutral gzip header bytes', () => {
  for (const name of names) {
    const bytes = fs.readFileSync(path.join(folder!, name + '.tar.gz'))
    expect([...bytes.subarray(0, 10)]).toEqual([0x1f, 0x8b, 8, 0, 0, 0, 0, 0, 2, 255])
  }
})
it.skipIf(!folder)('publishes exactly the built archives and their fixed repository pins, one target each', () => {
  const entry = JSON.parse(fs.readFileSync(path.join(folder!, 'plugin-list-entry.json'), 'utf8'))
  expect(entry.targets.map((one: { os: string; cpu: string }) => 'whatsapp-' + one.os + '-' + one.cpu)).toEqual(names)
  for (const [index, name] of names.entries()) {
    const target = entry.targets[index]
    const bytes = fs.readFileSync(path.join(folder!, name + '.tar.gz'))
    expect(bytes.length).toBe(target.bytes)
    expect(createHash('sha256').update(bytes).digest('hex')).toBe(target.sha256)
    expect(gunzipSync(bytes).equals(fs.readFileSync(path.join(folder!, name, 'whatsapp.tar')))).toBe(true)
    expect(target.url).toBe('https://github.com/brocrew/brocrew-plugin-whatsapp/releases/download/v' + entry.version + '/' + name + '.tar.gz')
    const manifest = JSON.parse(fs.readFileSync(path.join(folder!, name, 'package/plugin.json'), 'utf8'))
    expect(manifest.platforms).toEqual([{ os: target.os, cpu: target.cpu }])
  }
})
