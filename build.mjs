import { buildForBrowser, buildForNode } from '@jsheaven/easybuild'
import { cp } from 'node:fs/promises'

console.log('Bundling mode:', process.argv.indexOf('--dev') > -1 ? 'development' : 'production')

await buildForBrowser({
  entryPoint: './src/client.ts',
  outfile: './dist/client.js',
  debug: process.argv.indexOf('--dev') > -1,
  esBuildOptions: {
    logLevel: 'error',
  },
})

await buildForNode({
  entryPoint: './src/server.ts',
  outfile: './dist/server.js',
  debug: process.argv.indexOf('--dev') > -1,
  esBuildOptions: {
    logLevel: 'error',
  },
})

console.log('Copying ./src/types.d.ts to ./dist/jsx.d.ts...')

await cp('./src/types.d.ts', './dist/jsx.d.ts')
