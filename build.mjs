import { buildForBrowser, buildForNode } from '@jsheaven/easybuild'
import { cp } from 'fs/promises'

console.log('Bundling mode:', process.argv.indexOf('--dev') > -1 ? 'development' : 'production')

console.time('Bundling')

console.log('Bundling for client...')

await buildForBrowser({
  entryPoint: './src/client.ts',
  outfile: './dist/client.js',
  debug: process.argv.indexOf('--dev') > -1,
  esBuildOptions: {
    logLevel: 'error',
  },
})

console.log('Bundling for server...')

await buildForNode({
  entryPoint: './src/server.ts',
  outfile: './dist/server.js',
  debug: process.argv.indexOf('--dev') > -1,
  esBuildOptions: {
    logLevel: 'error',
  },
})

console.log('Copying .d.ts...')

await cp('./src/types.d.ts', './dist/jsx.d.ts')

console.timeEnd('Bundling')
