import { buildForBrowser, buildForNode } from '@jsheaven/easybuild'

await buildForNode({
  entryPoint: './src/index.ts',
  outfile: './dist/index.js',
  debug: process.argv.indexOf('--dev') > -1,
  esBuildOptions: {
    logLevel: 'error',
  },
}).then(() => console.log('bundled core'))

await buildForBrowser({
  entryPoint: './src/client.ts',
  outfile: './dist/client.js',
  debug: process.argv.indexOf('--dev') > -1,
  esBuildOptions: {
    logLevel: 'error',
  },
}).then(() => console.log('bundled for client'))

await buildForNode({
  entryPoint: './src/server.ts',
  outfile: './dist/server.js',
  debug: process.argv.indexOf('--dev') > -1,
  esBuildOptions: {
    logLevel: 'error',
  },
}).then(() => console.log('bundled for server'))
