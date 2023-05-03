# This script updates patch version of the pacakge.json
# WARNING: Assumptions: Major and Minor versions are changed by hand and registry major and minor are <= source control git major and minor versions

$packageName = (Select-String -Path ".\package.json" -Pattern '(?<=\"name\"\s*:\s*\")([^"]*)(?=\")').Matches[0].Value
$packageVersion = (Select-String -Path ".\package.json" -Pattern '(?<=\"version\"\s*:\s*\")([^"]*)(?=\")').Matches[0].Value
$registryVersion = Invoke-Expression -Command "npm view $packageName version"

Write-Output "Package name: $packageName"
Write-Output "Package version: $packageVersion"
Write-Output "Registry version: $registryVersion"


# Increment package patch version

# DOCS: https://docs.npmjs.com/about-semantic-versioning

$major, $minor, $patch = $packageVersion.Split(".")
$majorREG, $minorREG, $patchREG = $registryVersion.Split(".")

$newPatch = ""
if ($major -eq $majorREG -and $minor -eq $minorREG) {
    $newPatch = ([int]$patchREG) + 1
}
else {
    $newPatch = 0
}
$newVersion = "$major.$minor.$newPatch"

Write-Output "New package version: $newVersion"

(Get-Content .\package.json) -replace '(?<=\"version\"\s*:\s*\")([^"]*)(?=\")', "$newVersion" | Set-Content -Path ".\package.json"


# Add widget version to build, to see in production what version is this 
Write-Output "module.exports = '$newVersion'" | Set-Content -Path ".\src\js\PluginVersion.js"