<h1 align="center">@jsheaven/render</h1>

> Nano library to render JSX isomorphic

<h2 align="center">User Stories</h2>

1. As a developer, I want to render JSX/TSX on client and server likewise

2. As a developer, I want support for functional components and web components likewise

3. As a developer, I don't want to use a framework for that

<h2 align="center">Features</h2>

- ✅ Does render JSX/TSX on client and server - DOM (`render`) and HTML (`renderToString`)
- ✅ Allows to render `Function`al components like `<Foo />`
- ✅ Supports every JSX feature you know, including Fragments `<></>`, Refs `ref={}` and `onMount={fn}`
- ✅ Allows to render a whole HTML document server-side, starting with `<html>`
- ✅ Available as a simple API
- ✅ Just `1113 byte` nano sized (ESM, gizpped) on client
- ✅ Just `1254 byte` nano sized (ESM, gizpped) on server
- ✅ Tree-shakable and side-effect free
- ✅ First class TypeScript support
- ✅ 100% Unit Test coverage

<h2 align="center">Example usage</h2>

<h3 align="center">Setup</h3>

- yarn: `yarn add @jsheaven/render`
- npm: `npm install @jsheaven/render`

<h3 align="center">ESM</h3>

Configure the following values in your `tsconfig.json` or likewise,
in the configuration options of your favourite bundler:

```json
{
  ...
  "jsx": "react",
  "jsxFactory": "tsx",
  "jsxFragmentFactory": "Fragment",
  ...
}
```

This will make sure that the JSX syntax is correctly transformed into a
JavaScript object tree (AOT, at compile time) that can be rendered by this library
at runtime (SSG, SSR or even, if desired, in-browser).

<h4 align="center">Server-side usage:</h4>

```tsx
import { render, renderToString, tsx, Fragment } from '@jsheaven/render/dist/server.esm.js'

// HTMLElement
const dom: Node = render(
  <html>
    <head></head>
    <body></body>
  </html>,
)

// <html><head></head><body></body></html>
const html: string = renderToString(dom)
```

<h4 align="center">Client-side/in-browser usage:</h4>

```tsx
import { render, renderToString, tsx, Fragment } from '@jsheaven/render/dist/client.esm.js'

// HTMLParagraphElement
const dom: Node = render(<p>Some paragraph</p>)

// <p>Some paragraph</p>
const html: string = renderToString(dom)
```

<h3 align="center">CommonJS</h3>

```ts
const { render, renderToString, tsx } = require('@jsheaven/render/client.cjs.js')

// same API like ESM variant
```
