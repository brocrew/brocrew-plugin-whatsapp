import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { gzipSync } from 'node:zlib'
import { buildWhatsAppPackage, WHATSAPP_TARGETS } from '../plugins/whatsapp/build.mjs'
const commit = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim()
const out = path.resolve(process.argv[2] ?? 'artifact')
fs.mkdirSync(out)
const targets = []
let version
for (const target of WHATSAPP_TARGETS) {
  const name = 'whatsapp-' + target.os + '-' + target.cpu
  const built = path.join(out, name)
  const release = await buildWhatsAppPackage(built, commit, undefined, target)
  version = release.version
  const bytes = gzipSync(fs.readFileSync(path.join(built, 'whatsapp.tar')), { level: 9 })
  // zlib emits a host-specific OS byte. Canonicalize it; payload and trailer stay unchanged.
  bytes[9] = 255
  fs.writeFileSync(path.join(out, name + '.tar.gz'), bytes)
  targets.push({ os: target.os, cpu: target.cpu,
    url: 'https://github.com/brocrew/brocrew-plugin-whatsapp/releases/download/v' + version + '/' + name + '.tar.gz',
    sha256: createHash('sha256').update(bytes).digest('hex'), bytes: bytes.length,
    compression: 'tar.gz', manifestSha256: release.manifestSha256 })
}
const entry = {
  id: 'whatsapp', name: 'WhatsApp',
  description: 'Lets agents read your WhatsApp chats when you allow it, and send to the groups you choose.',
  version, minAppVersion: '0.0.0', sourceCommit: commit, targets,
}
fs.writeFileSync(path.join(out, 'plugin-list-entry.json'), JSON.stringify(entry, null, 2) + '\n')
console.log(JSON.stringify(targets.map((one) => ({ os: one.os, cpu: one.cpu, bytes: one.bytes, sha256: one.sha256 }))))
