import { execSync } from 'node:child_process'
import process from 'node:process'
import fs from 'fs-extra'
import { r } from './utils'

type BumpType = 'patch' | 'minor' | 'major'

function run(cmd: string) {
  execSync(cmd, { stdio: 'inherit' })
}

function bumpVersion(version: string, type: BumpType): string {
  const parts = version.split('.').map(Number)
  if (type === 'major') {
    parts[0]++
    parts[1] = 0
    parts[2] = 0
  }
  else if (type === 'minor') {
    parts[1]++
    parts[2] = 0
  }
  else {
    parts[2]++
  }
  return parts.join('.')
}

async function release() {
  const bumpType: BumpType = (process.argv[2] as BumpType) || 'patch'

  if (!['patch', 'minor', 'major'].includes(bumpType)) {
    console.error(`Invalid bump type: "${bumpType}". Use patch, minor, or major.`)
    process.exit(1)
  }

  // Read package.json
  const pkgPath = r('package.json')
  const pkg = await fs.readJson(pkgPath)
  const oldVersion = pkg.version
  const newVersion = bumpVersion(oldVersion, bumpType)

  console.log(`\nBumping version: ${oldVersion} → ${newVersion} (${bumpType})\n`)

  // Update package.json
  pkg.version = newVersion
  await fs.writeJson(pkgPath, pkg, { spaces: 2 })
  console.log(`✓ Updated package.json`)

  // Build
  console.log('\nBuilding...')
  run('bun run build')
  console.log('✓ Build complete')

  // Pack
  console.log('\nPacking...')
  run('bun run pack')
  console.log('✓ Pack complete')

  // Git commit + tag
  console.log('\nCreating git commit and tag...')
  run(`git add package.json`)
  run(`git commit -m "chore: bump version to v${newVersion}"`)
  run(`git tag v${newVersion}`)
  console.log(`✓ Tagged v${newVersion}`)

  // Push
  run(`git push origin main`)
  run(`git push origin v${newVersion}`)
  console.log(`✓ Pushed v${newVersion} to origin`)

  console.log(`\nRelease v${newVersion} complete!`)
}

release().catch((err) => {
  console.error(err)
  process.exit(1)
})
