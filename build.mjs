import { buildForBrowser, buildForNode } from '@jsheaven/easybuild'

await buildForNode({
  entryPoint: './src/index.ts',
  outfile: './dist/index.js',
  esBuildOptions: {
    logLevel: 'error',
  },
}).then(() => console.log('bundled core'))

await buildForBrowser({
  entryPoint: './src/client.ts',
  outfile: './dist/client.js',
  //debug: true,
  esBuildOptions: {
    logLevel: 'error',
  },
}).then(() => console.log('bundled for client'))

await buildForNode({
  entryPoint: './src/server.ts',
  outfile: './dist/server.js',
  //debug: true,
  esBuildOptions: {
    logLevel: 'error',
  },
}).then(() => console.log('bundled for server'))
