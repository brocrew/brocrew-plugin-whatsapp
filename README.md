# WhatsApp plugin for BroCrew

This repository is a clean source export of the WhatsApp plugin maintained and integration-tested with BroCrew. It contains no app history, no WhatsApp session and no messages. Its release workflow builds reproducible archives for macOS arm64 and Windows x64 with Go 1.27.2 and no cgo, runs the tests with a fake bridge and made-up chats, and emits the entry for BroCrew’s plugin list. Users install from Settings → Plugins and link a phone by scanning a QR code; they run no commands and supply no key or token.

BroCrew installs the archive for its own system; on Windows that needs an app whose plugin host runs plugins there. The plugin’s own notes are in `plugins/whatsapp/README.md`; the copied code’s MIT notice is in `plugins/whatsapp/bridge/UPSTREAM-LICENSE`.
