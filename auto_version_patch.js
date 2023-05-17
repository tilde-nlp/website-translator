/* eslint no-console: 0 */
const fs = require('fs')
const { execSync, exec } = require('child_process')

const packageJSON = fs.readFileSync('package.json')

const json = JSON.parse(packageJSON)

const packageName = json.name
const packageVersion = json.version
let registryVersion = packageVersion

console.log(`Package name: ${packageName}`)
console.log(`Package version: ${packageVersion}`)

try {
  const npmViewCommand = execSync(`npm view ${packageName} version`)

  registryVersion = npmViewCommand.toString().trim()
}
catch (error) {
  console.warn('Failed to get registry version')
}

console.log(`Registry version: ${registryVersion}`)

// Increment package patch version
// DOCS: https://docs.npmjs.com/about-semantic-versioning
const packageVersionParsed = packageVersion.split('.')
const registryPackageVersionParsed = registryVersion.split('.')

const majorVer = packageVersionParsed[0]
const minorVer = packageVersionParsed[1]

const majorVerReg = registryPackageVersionParsed[0]
const minorVerReg = registryPackageVersionParsed[1]
const patchVerReg = registryPackageVersionParsed[2]

let patchVersion = 0

if (majorVer === majorVerReg && minorVer === minorVerReg) {
  patchVersion = parseInt(patchVerReg) + 1
}

const newVersion = `${packageVersionParsed[0]}.${packageVersionParsed[1]}.${patchVersion}`

console.log(`\nNew package version 🤖: ${newVersion}\n`)

json.version = newVersion

console.log('Write version to ./package.json')
fs.writeFileSync('./package.json', JSON.stringify(json, null, 2))

console.log('Write version to ./src/js/PluginVersion.js')
fs.writeFileSync('./src/js/PluginVersion.js', `module.exports = '${newVersion}'\n`)
