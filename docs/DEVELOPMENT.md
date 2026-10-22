# Building and testing the WhatsApp plugin

Use Node 22.23.3, Go 1.27.2 and Git. From the repository root:

```sh
npm ci --legacy-peer-deps --ignore-scripts --no-audit --no-fund
npm ci --prefix plugins/whatsapp --ignore-scripts --no-audit --no-fund
npm run typecheck
BROCREW_GO=/absolute/path/to/go1.27.2/bin/go npm run build -- artifact
BROCREW_WHATSAPP_TEST_ARTIFACT="$PWD/artifact" npm test
```

The output folder must not already exist. The build creates reproducible archives for macOS arm64 and Windows x64, plus `plugin-list-entry.json` with their download URLs, sizes and SHA-256 checksums. Go builds the bridge without cgo, using `CGO_ENABLED=0 -trimpath -buildvcs=false -ldflags="-s -w -buildid="`.

From `plugins/whatsapp/bridge`, with Go 1.27.2 on your path, check the bridge separately:

```sh
CGO_ENABLED=0 GOTOOLCHAIN=local go vet ./...
CGO_ENABLED=0 GOTOOLCHAIN=local go test ./...
CGO_ENABLED=0 GOTOOLCHAIN=local GOOS=windows GOARCH=amd64 go vet ./...
```

Tests use a simulated bridge and made-up chats; none starts WhatsApp.

BroCrew installs the archive for its own system; on Windows that needs an app whose plugin host runs plugins there.

See the [plugin notes](../plugins/whatsapp/README.md), [release script](../scripts/release.mjs) and [release workflow](../.github/workflows/release.yml).

The repository is under [Apache-2.0](../LICENSE). It includes code under the MIT licence; keep the [upstream notice](../plugins/whatsapp/bridge/UPSTREAM-LICENSE) with that code and in the package's `licenses/` folder.

[Back to the plugin](../README.md)
