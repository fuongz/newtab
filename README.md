# Your NewTab

A Chrome new tab extension that shows a random quote.

Based on [antfu/vitesse-webext](https://github.com/antfu/vitesse-webext).

## Development

```bash
bun install
bun run dev
```

Load the `extension/` folder in Chrome via `chrome://extensions` with **Developer mode** on.

## Release

The release script bumps the version, builds, packs, and creates a git tag in one command.

```bash
bun run release          # patch bump: 0.0.7 → 0.0.8
bun run release:minor    # minor bump: 0.0.7 → 0.1.0
bun run release:major    # major bump: 0.0.7 → 1.0.0
```

This will:
1. Bump the version in `package.json`
2. Run `bun run build`
3. Run `bun run pack` (outputs `extension.zip`, `extension.crx`, `extension.xpi`)
4. Commit the version bump, tag it, and push to origin

## Deploy to Chrome Web Store

### 1. Build & pack manually

```bash
bun run build
bun run pack:zip
# outputs extension.zip
```

### 2. Upload

1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Select your extension
3. Click **Package** → **Upload new package**
4. Upload `extension.zip`
5. Click **Submit for review**
