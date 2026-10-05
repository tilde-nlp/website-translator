import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawn } from 'node:child_process'

const appRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const configurationRoute = '/api/configurationservice/configuration/72aab105-df74-4b1c-b9b4-2f374d6eff29.json'
const configurationPath = join(appRoot, 'public', 'api', 'configurationservice', 'configuration', 'spa-test-site.json')

const mockApi = createServer(async (request, response) => {
  if (request.method !== 'GET' || request.url !== configurationRoute) {
    response.writeHead(404).end()
    return
  }

  const configuration = await readFile(configurationPath, 'utf8')
  response.writeHead(200, { 'Content-Type': 'application/json' })
  response.end(configuration)
})

mockApi.listen(4300, () => {
  console.log('Mock widget API listening on http://localhost:4300')
})

const angularCli = join(appRoot, 'node_modules', '@angular', 'cli', 'bin', 'ng.js')
const angular = spawn(process.execPath, [angularCli, 'serve', '--proxy-config', 'proxy.conf.json'], {
  cwd: appRoot,
  stdio: 'inherit'
})

const shutdown = () => {
  angular.kill()
  mockApi.close()
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
angular.on('exit', code => {
  mockApi.close()
  process.exitCode = code ?? 0
})