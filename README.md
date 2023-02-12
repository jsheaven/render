<h1 align="center">@jsheaven/render</h1>

> Nano library to render JSX isomorphic

<h2 align="center">User Stories</h2>

1. As a developer, I want to render JSX/TSX on client and server likewise

2. As a developer, I don't want support for functional components and web components likewise

<h2 align="center">Features</h2>

- ✅ Does render JSX/TSX on client and server - DOM (`render`) and HTML (`renderToString`)
- ✅ Available as a simple API
- ✅ Just `1180 byte` nano sized (ESM, gizpped) on client
- ✅ Just `1200 byte` nano sized (ESM, gizpped) on server
- ✅ Tree-shakable and side-effect free
- ✅ First class TypeScript support
- ✅ 100% Unit Test coverage

<h2 align="center">Example usage</h2>

<h3 align="center">Setup</h3>

- yarn: `yarn add @jsheaven/render`
- npm: `npm install @jsheaven/render`

<h3 align="center">ESM</h3>

On server:

```tsx
import { render, renderToString, tsx } from '@jsheaven/render/server.esm.js'

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

On client (in-browser):

```tsx
import { render, renderToString, tsx } from '@jsheaven/render/client.esm.js'

// HTMLParagraphElement
const dom: Node = render(<p>Some paragraph</p>)

// <p xmlns="http://www.w3.org/1999/xhtml">In body</p>
const html: string = renderToString(dom)
```

<h3 align="center">CommonJS</h3>

```ts
const { render, renderToString, tsx } = require('@jsheaven/render/client.cjs.js')

// same API like ESM variant
```
